<?php

namespace App\Jobs;

use App\Models\Assessment;
use App\Services\CrmService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncAssessmentToCrm implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        public int $assessmentId
    ) {}

    public function handle(CrmService $crm): void
    {
        $assessment = Assessment::find($this->assessmentId);

        if (!$assessment) {
            Log::warning('Assessment not found for CRM sync', ['assessment_id' => $this->assessmentId]);
            return;
        }

        if ($assessment->crm_status === Assessment::CRM_STATUS_SYNCED) {
            Log::info('Assessment already synced to CRM', ['assessment_id' => $this->assessmentId]);
            return;
        }

        try {
            $success = $crm->saveAssessment($assessment);

            $assessment->update([
                'crm_status' => $success ? Assessment::CRM_STATUS_SYNCED : Assessment::CRM_STATUS_ERROR,
                'crm_message' => $success
                    ? 'CRM\'e başarıyla aktarıldı.'
                    : 'CRM kaydı başarısız oldu.',
            ]);
        } catch (\Exception $e) {
            $assessment->update([
                'crm_status' => Assessment::CRM_STATUS_ERROR,
                'crm_message' => 'Hata: ' . $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        $assessment = Assessment::find($this->assessmentId);

        if ($assessment) {
            $assessment->update([
                'crm_status' => Assessment::CRM_STATUS_ERROR,
                'crm_message' => 'Queue failed: ' . $exception->getMessage(),
            ]);
        }
    }
}
