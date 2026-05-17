<?php

namespace App\Integrations\StatamicForms;

use App\Jobs\SyncLeadToCrm;
use App\Jobs\SyncAssessmentToCrm;
use App\Jobs\SyncAppointmentToCrm;
use App\Services\MailService;
use Illuminate\Support\Facades\Log;

class FormSubmissionHandler
{
    public function __construct(
        private MailService $mailService
    ) {}

    /**
     * Form submission event handler
     */
    public function handle(string $form, array $data, array $submission): void
    {
        Log::info("Form submitted: {$form}", [
            'form' => $form,
            'submission_id' => $submission['id'] ?? null,
        ]);

        // Ekstra meta verileri ekle
        $data['ip_address'] = $submission['ip_address'] ?? null;
        $data['user_agent'] = $submission['user_agent'] ?? null;
        $data['submitted_at'] = $submission['created_at'] ?? now()->toIso8601String();

        // Form tipine göre işlem yap
        match ($form) {
            'lead' => $this->handleLeadForm($data),
            'assessment' => $this->handleAssessmentForm($data),
            'appointment' => $this->handleAppointmentForm($data),
            default => Log::warning("Unknown form type: {$form}"),
        };
    }

    /**
     * Lead form handler
     */
    private function handleLeadForm(array $data): void
    {
        try {
            // UTM verilerini çıkar
            $utm = [
                'source' => $data['utm_source'] ?? null,
                'medium' => $data['utm_medium'] ?? null,
                'campaign' => $data['utm_campaign'] ?? null,
            ];
            $utm = array_filter($utm, fn($v) => $v !== null);

            // CRM'e gönder
            SyncLeadToCrm::dispatch($data);

            // Hoşgeldin e-postası gönder
            $this->mailService->sendLeadWelcome($data['email'] ?? '', $data['name'] ?? '');

            Log::info('Lead form processed', ['email' => $data['email'] ?? 'N/A']);
        } catch (\Exception $e) {
            Log::error('Lead form processing failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Assessment form handler
     */
    private function handleAssessmentForm(array $data): void
    {
        try {
            // CRM'e gönder
            SyncAssessmentToCrm::dispatch($data);

            // Onay e-postası gönder
            $this->mailService->sendAssessmentConfirmation($data['email'] ?? '', $data['name'] ?? '');

            Log::info('Assessment form processed', ['email' => $data['email'] ?? 'N/A']);
        } catch (\Exception $e) {
            Log::error('Assessment form processing failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Appointment form handler
     */
    private function handleAppointmentForm(array $data): void
    {
        try {
            // CRM'e gönder
            SyncAppointmentToCrm::dispatch($data);

            // Onay e-postası gönder
            $this->mailService->sendAppointmentConfirmation(
                $data['email'] ?? '',
                $data['name'] ?? '',
                $data['preferred_date'] ?? '',
                $data['preferred_time'] ?? ''
            );

            Log::info('Appointment form processed', ['email' => $data['email'] ?? 'N/A']);
        } catch (\Exception $e) {
            Log::error('Appointment form processing failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}