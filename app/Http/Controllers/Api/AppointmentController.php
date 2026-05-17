<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAppointmentRequest;
use App\Jobs\SyncAppointmentToCrm;
use App\Services\AutomationService;
use App\Services\MailService;
use App\Services\RecaptchaGuardService;
use App\Models\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AppointmentController extends Controller
{
    public function __construct(
        private MailService $mailService,
        private AutomationService $automationService,
    ) {}

    /**
     * Yeni randevu oluştur
     * 
     * POST /api/appointment
     */
    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        try {
            $utm = [
                'source' => $request->utm_source ?? $request->utm['source'] ?? null,
                'medium' => $request->utm_medium ?? $request->utm['medium'] ?? null,
                'campaign' => $request->utm_campaign ?? $request->utm['campaign'] ?? null,
            ];
            $utm = array_filter($utm, fn($v) => $v !== null);

            app(RecaptchaGuardService::class)->validate(
                $request->input('recaptcha_token'),
                $request->input('recaptcha_action')
            );

            $appointment = Appointment::create([
                'name' => $request->name,
                'company' => $request->company,
                'email' => $request->email,
                'tel' => $request->tel,
                'preferred_date' => $request->preferred_date,
                'preferred_time' => $request->preferred_time,
                'sector' => $request->sector,
                'notes' => $request->notes,
                'meta' => [
                    'user_agent' => $request->userAgent(),
                    'ip' => $request->ip(),
                    'referer' => $request->header('referer'),
                ],
                'utm' => $utm ?: null,
                'path' => $request->path ?? '/',
                'variant_id' => $request->variant_id,
                'status' => Appointment::STATUS_PENDING,
                'crm_status' => Appointment::CRM_STATUS_PENDING,
            ]);

            Log::info('New appointment created', [
                'appointment_id' => $appointment->id,
                'email' => $appointment->email,
                'date' => $appointment->preferred_date,
            ]);

            // CRM'e gönder
            SyncAppointmentToCrm::dispatch($appointment->id);

            // Onay e-postası gönder
            try {
                $this->mailService->sendAppointmentConfirmation($appointment);

                $this->automationService->trigger('appointment_created', [
                    'appointment_id' => $appointment->id,
                    'name' => $appointment->name,
                    'company' => $appointment->company,
                    'email' => $appointment->email,
                    'tel' => $appointment->tel,
                    'preferred_date' => optional($appointment->preferred_date)?->format('d.m.Y'),
                    'preferred_time' => $appointment->preferred_time,
                    'sector' => $appointment->sector,
                    'notes' => $appointment->notes,
                    'path' => $appointment->path,
                    'variant_id' => $appointment->variant_id,
                    'form_handle' => 'appointment',
                    'utm' => $utm,
                ], $appointment);
            } catch (\Exception $e) {
                Log::error('Appointment confirmation email failed', [
                    'appointment_id' => $appointment->id,
                    'error' => $e->getMessage(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Randevu talebiniz alındı. En kısa sürede sizinle iletişime geçeceğiz.',
                'data' => [
                    'id' => $appointment->id,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Appointment creation failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
            ], 500);
        }
    }

    /**
     * Tüm randevuları listele
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('sector')) {
            $query->where('sector', $request->sector);
        }

        if ($request->has('date')) {
            $query->whereDate('preferred_date', $request->date);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        $appointments = $query->orderBy('preferred_date', 'asc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    /**
     * Randevu detayını getir
     */
    public function show(int $id): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Randevu bulunamadı.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $appointment,
        ]);
    }

    /**
     * Randevu durumunu güncelle
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Randevu bulunamadı.',
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        $appointment->update(['status' => $validated['status']]);

        return response()->json([
            'success' => true,
            'message' => 'Randevu durumu güncellendi.',
        ]);
    }
}
