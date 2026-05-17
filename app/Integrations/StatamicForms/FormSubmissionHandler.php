<?php

namespace App\Integrations\StatamicForms;

use App\Jobs\SyncLeadToCrm;
use App\Jobs\SyncAssessmentToCrm;
use App\Jobs\SyncAppointmentToCrm;
use App\Services\AutomationService;
use App\Services\MailService;
use Illuminate\Support\Facades\Log;

class FormSubmissionHandler
{
    public function __construct(
        private MailService $mailService,
        private AutomationService $automationService
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
        $data['form_handle'] = $form;

        // Form tipine göre işlem yap
        match ($form) {
            'lead' => $this->handleLeadForm($data),
            'assessment' => $this->handleAssessmentForm($data),
            'appointment' => $this->handleAppointmentForm($data),
            'event_registration' => $this->handleEventRegistrationForm($data),
            default => Log::warning("Unknown form type: {$form}"),
        };
    }

    /**
     * Lead form handler
     */
    private function handleLeadForm(array $data): void
    {
        try {
            // CRM'e gönder
            SyncLeadToCrm::dispatch($data);

            // Otomasyon tetikle
            $this->automationService->trigger('lead_created', $data);
            $this->automationService->trigger('form_submitted', $data);

            // Hoşgeldin e-postası gönder
            $this->mailService->sendLeadWelcomeByArray($data);

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

            // Otomasyon tetikle
            $this->automationService->trigger('assessment_created', $data);
            $this->automationService->trigger('form_submitted', $data);

            // Onay e-postası gönder
            $this->mailService->sendAssessmentConfirmationByArray($data);

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

            // Otomasyon tetikle
            $this->automationService->trigger('appointment_created', $data);
            $this->automationService->trigger('form_submitted', $data);

            // Onay e-postası gönder
            $this->mailService->sendAppointmentConfirmationByArray($data);

            Log::info('Appointment form processed', ['email' => $data['email'] ?? 'N/A']);
        } catch (\Exception $e) {
            Log::error('Appointment form processing failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Event registration form handler
     */
    private function handleEventRegistrationForm(array $data): void
    {
        try {
            // Otomasyon tetikle - etkinlik kaydı oluşturuldu
            $this->automationService->trigger('event_registration_created', $data);

            // Otomasyon tetikle - genel form gönderimi
            $this->automationService->trigger('form_submitted', $data);

            Log::info('Event registration form processed', [
                'event' => $data['event_title'] ?? $data['event_slug'] ?? 'N/A',
                'email' => $data['email'] ?? 'N/A',
            ]);
        } catch (\Exception $e) {
            Log::error('Event registration form processing failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}