<?php

namespace App\Jobs;

use App\Models\Appointment;
use App\Services\CrmService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncAppointmentToCrm implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        public int $appointmentId
    ) {}

    public function handle(CrmService $crm): void
    {
        $appointment = Appointment::find($this->appointmentId);

        if (!$appointment) {
            Log::warning('Appointment not found for CRM sync', ['appointment_id' => $this->appointmentId]);
            return;
        }

        if ($appointment->crm_status === Appointment::CRM_STATUS_SYNCED) {
            Log::info('Appointment already synced to CRM', ['appointment_id' => $this->appointmentId]);
            return;
        }

        try {
            $success = $crm->saveAppointment($appointment);

            $appointment->update([
                'crm_status' => $success ? Appointment::CRM_STATUS_SYNCED : Appointment::CRM_STATUS_ERROR,
                'crm_message' => $success
                    ? 'CRM\'e başarıyla aktarıldı.'
                    : 'CRM kaydı başarısız oldu.',
            ]);
        } catch (\Exception $e) {
            $appointment->update([
                'crm_status' => Appointment::CRM_STATUS_ERROR,
                'crm_message' => 'Hata: ' . $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $exception): void
    {
        $appointment = Appointment::find($this->appointmentId);

        if ($appointment) {
            $appointment->update([
                'crm_status' => Appointment::CRM_STATUS_ERROR,
                'crm_message' => 'Queue failed: ' . $exception->getMessage(),
            ]);
        }
    }
}
