<?php

namespace App\Services;

use App\Models\Lead;
use App\Models\Assessment;
use App\Models\Appointment;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CrmService
{
    private string $loginUrl;
    private string $saveUrl;
    private string $username;
    private string $password;
    private ?string $token = null;
    private ?int $lastStatusCode = null;
    private ?string $lastResponseBody = null;
    private ?string $lastErrorMessage = null;

    public function __construct(
        string $loginUrl,
        string $saveUrl,
        string $username,
        string $password
    ) {
        $this->loginUrl = $loginUrl;
        $this->saveUrl = $saveUrl;
        $this->username = $username;
        $this->password = $password;
    }

    /**
     * CRM'e giriş yap ve token al
     */
    public function authenticate(): ?string
    {
        try {
            $response = Http::timeout(10)->post($this->loginUrl, [
                'username' => $this->username,
                'password' => $this->password,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $this->token = $data['result']['access_token'] ?? null;
                $this->lastStatusCode = $response->status();
                $this->lastResponseBody = $response->body();
                $this->lastErrorMessage = null;
                return $this->token;
            }

            $this->lastStatusCode = $response->status();
            $this->lastResponseBody = $response->body();
            $this->lastErrorMessage = 'CRM authentication failed';

            Log::error('CRM authentication failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            $this->lastErrorMessage = $e->getMessage();
            Log::error('CRM authentication exception', [
                'error' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Lead'i CRM'e gönder
     */
    public function saveLead(Lead $lead): bool
    {
        $token = $this->token ?? $this->authenticate();

        if (!$token) {
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'Content-Type' => 'application/json',
            ])->timeout(15)->post($this->saveUrl, [
                'value' => [
                    'incomingPath' => 'website',
                    'formType' => 'WebForm',
                    'sEntityName' => $lead->company ?? '',
                    'email' => $lead->email,
                    'tel' => $lead->tel ?? '',
                    'authNameSurname' => $lead->name,
                    'productService' => 'LioxErp',
                    'note' => $this->buildLeadNote($lead),
                    'addString20' => 'ST',
                    'addstring17' => $lead->path ?? '',
                    'addString01' => $lead->utm['campaign'] ?? '',
                    'addstring18' => $lead->utm['source'] ?? '',
                    'addstring19' => $lead->utm['medium'] ?? '',
                    'addString21' => $lead->employee_count ?? '',
                ],
            ]);

            if ($response->successful()) {
                $this->lastStatusCode = $response->status();
                $this->lastResponseBody = $response->body();
                $this->lastErrorMessage = null;
                Log::info('Lead sent to CRM successfully', [
                    'lead_id' => $lead->id,
                    'email' => $lead->email,
                ]);
                return true;
            }

            $this->lastStatusCode = $response->status();
            $this->lastResponseBody = $response->body();
            $this->lastErrorMessage = 'CRM lead save failed';

            Log::error('CRM lead save failed', [
                'lead_id' => $lead->id,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return false;
        } catch (\Exception $e) {
            $this->lastErrorMessage = $e->getMessage();
            Log::error('CRM lead save exception', [
                'lead_id' => $lead->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    public function getLastResultMeta(): array
    {
        return [
            'status_code' => $this->lastStatusCode,
            'response_body' => $this->lastResponseBody,
            'error_message' => $this->lastErrorMessage,
        ];
    }

    /**
     * Assessment'i CRM'e gönder
     */
    public function saveAssessment(Assessment $assessment): bool
    {
        $token = $this->token ?? $this->authenticate();

        if (!$token) {
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'Content-Type' => 'application/json',
            ])->timeout(15)->post($this->saveUrl, [
                'value' => [
                    'incomingPath' => 'website',
                    'formType' => 'AssessmentForm',
                    'sEntityName' => $assessment->company ?? '',
                    'email' => $assessment->email,
                    'tel' => $assessment->tel ?? '',
                    'authNameSurname' => $assessment->name,
                    'productService' => 'LioxErp',
                    'note' => $this->buildAssessmentNote($assessment),
                    'addString20' => 'ST',
                    'addstring17' => $assessment->path ?? '',
                    'addString01' => $assessment->utm['campaign'] ?? '',
                    'addstring18' => $assessment->utm['source'] ?? '',
                    'addstring19' => $assessment->utm['medium'] ?? '',
                    'addString21' => $assessment->employee_count ?? '',
                    'addString22' => $assessment->sector ?? '',
                    'addString23' => $assessment->current_erp ?? '',
                    'addString24' => $assessment->budget_range ?? '',
                    'addString25' => $assessment->timeline ?? '',
                ],
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('CRM assessment save exception', [
                'assessment_id' => $assessment->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Appointment'i CRM'e gönder
     */
    public function saveAppointment(Appointment $appointment): bool
    {
        $token = $this->token ?? $this->authenticate();

        if (!$token) {
            return false;
        }

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'Content-Type' => 'application/json',
            ])->timeout(15)->post($this->saveUrl, [
                'value' => [
                    'incomingPath' => 'website',
                    'formType' => 'AppointmentForm',
                    'sEntityName' => $appointment->company ?? '',
                    'email' => $appointment->email,
                    'tel' => $appointment->tel ?? '',
                    'authNameSurname' => $appointment->name,
                    'productService' => 'LioxErp',
                    'note' => $this->buildAppointmentNote($appointment),
                    'addString20' => 'ST',
                    'addstring17' => $appointment->path ?? '',
                    'addString01' => $appointment->utm['campaign'] ?? '',
                    'addstring18' => $appointment->utm['source'] ?? '',
                    'addstring19' => $appointment->utm['medium'] ?? '',
                    'addString22' => $appointment->sector ?? '',
                    'addString26' => $appointment->preferred_date?->format('Y-m-d') ?? '',
                    'addString27' => $appointment->preferred_time ?? '',
                ],
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('CRM appointment save exception', [
                'appointment_id' => $appointment->id,
                'error' => $e->getMessage(),
            ]);
            return false;
        }
    }

    /**
     * Lead notu oluştur
     */
    private function buildLeadNote(Lead $lead): string
    {
        $parts = [];

        if ($lead->employee_count) {
            $parts[] = "Çalışan Sayısı: {$lead->employee_count}";
        }

        if ($lead->utm) {
            $utmParts = [];
            foreach ($lead->utm as $key => $value) {
                if ($value) {
                    $utmParts[] = strtoupper($key) . ': ' . $value;
                }
            }
            if ($utmParts) {
                $parts[] = 'UTM Verileri: ' . implode(' | ', $utmParts);
            }
        }

        if ($lead->meta) {
            $parts[] = 'Ek Bilgiler: ' . json_encode($lead->meta, JSON_UNESCAPED_UNICODE);
        }

        return implode("\n", $parts);
    }

    /**
     * Assessment notu oluştur
     */
    private function buildAssessmentNote(Assessment $assessment): string
    {
        $parts = [];

        if ($assessment->current_challenges) {
            $parts[] = "Mevcut Zorluklar: {$assessment->current_challenges}";
        }

        if ($assessment->goals) {
            $parts[] = "Hedefler: {$assessment->goals}";
        }

        if ($assessment->budget_range) {
            $parts[] = "Bütçe Aralığı: {$assessment->budget_range}";
        }

        if ($assessment->timeline) {
            $parts[] = "Zamanlama: {$assessment->timeline}";
        }

        return implode("\n", $parts);
    }

    /**
     * Appointment notu oluştur
     */
    private function buildAppointmentNote(Appointment $appointment): string
    {
        $parts = [];

        if ($appointment->notes) {
            $parts[] = "Notlar: {$appointment->notes}";
        }

        if ($appointment->preferred_date) {
            $parts[] = "Tercih Edilen Tarih: {$appointment->preferred_date->format('d.m.Y')}";
        }

        if ($appointment->preferred_time) {
            $parts[] = "Tercih Edilen Saat: {$appointment->preferred_time}";
        }

        return implode("\n", $parts);
    }
}
