<?php

namespace App\Jobs;

use App\Models\Lead;
use App\Services\CrmService;
use App\Services\StatamicSubmissionStatusService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncLeadToCrm implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        public int $leadId
    ) {}

    public function handle(CrmService $crm, StatamicSubmissionStatusService $statamicSubmissionStatusService): void
    {
        $lead = Lead::find($this->leadId);

        if (!$lead) {
            Log::warning('Lead not found for CRM sync', ['lead_id' => $this->leadId]);
            return;
        }

        // Skip if already synced
        if ($lead->crm_status === Lead::CRM_STATUS_SYNCED) {
            Log::info('Lead already synced to CRM', ['lead_id' => $this->leadId]);
            return;
        }

        try {
            $success = $crm->saveLead($lead);
            $resultMeta = $crm->getLastResultMeta();

            $statusCode = $resultMeta['status_code'] ?? null;
            $body = $resultMeta['response_body'] ?? null;
            $error = $resultMeta['error_message'] ?? null;

            $message = $success
                ? "✔ CRM'e başarıyla aktarıldı" . ($statusCode ? " (HTTP {$statusCode})" : '')
                : trim(implode(' | ', array_filter([
                    '✖ CRM kaydı başarısız oldu',
                    $statusCode ? "HTTP {$statusCode}" : null,
                    $error,
                    $body ? mb_substr($body, 0, 300) : null,
                ])));

            $lead->update([
                'crm_status' => $success ? Lead::CRM_STATUS_SYNCED : Lead::CRM_STATUS_ERROR,
                'crm_message' => $message,
            ]);

            $statamicSubmissionStatusService->updateLatestByEmail('lead', $lead->email, [
                'crm_status' => $success ? Lead::CRM_STATUS_SYNCED : Lead::CRM_STATUS_ERROR,
                'crm_message' => $message,
                'crm_http_code' => $statusCode,
            ]);

            Log::info('Lead CRM sync completed', [
                'lead_id' => $this->leadId,
                'success' => $success,
            ]);
        } catch (\Exception $e) {
            $lead->update([
                'crm_status' => Lead::CRM_STATUS_ERROR,
                'crm_message' => 'Hata: ' . $e->getMessage(),
            ]);

            $statamicSubmissionStatusService->updateLatestByEmail('lead', $lead->email, [
                'crm_status' => Lead::CRM_STATUS_ERROR,
                'crm_message' => 'Hata: ' . $e->getMessage(),
            ]);

            Log::error('Lead CRM sync failed', [
                'lead_id' => $this->leadId,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        $lead = Lead::find($this->leadId);

        if ($lead) {
            $lead->update([
                'crm_status' => Lead::CRM_STATUS_ERROR,
                'crm_message' => 'Queue failed: ' . $exception->getMessage(),
            ]);
        }

        Log::error('Lead CRM sync job permanently failed', [
            'lead_id' => $this->leadId,
            'error' => $exception->getMessage(),
        ]);
    }
}
