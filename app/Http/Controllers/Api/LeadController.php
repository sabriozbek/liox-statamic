<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLeadRequest;
use App\Jobs\SyncLeadToCrm;
use App\Models\FormSubmission;
use App\Services\AutomationService;
use App\Services\MailService;
use App\Services\RecaptchaGuardService;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    public function __construct(
        private MailService $mailService,
        private AutomationService $automationService,
    ) {}

    /**
     * Yeni lead oluştur
     * 
     * POST /api/crm/lead
     */
    public function store(StoreLeadRequest $request): JsonResponse
    {
        try {
            // UTM parametrelerini al
            $utm = [
                'source' => $request->utm_source ?? $request->utm['source'] ?? null,
                'medium' => $request->utm_medium ?? $request->utm['medium'] ?? null,
                'campaign' => $request->utm_campaign ?? $request->utm['campaign'] ?? null,
                'term' => $request->utm_term ?? $request->utm['term'] ?? null,
                'content' => $request->utm_content ?? $request->utm['content'] ?? null,
                'gclid' => $request->gclid ?? $request->utm['gclid'] ?? null,
                'fbclid' => $request->fbclid ?? $request->utm['fbclid'] ?? null,
            ];

            // Null değerleri temizle
            $utm = array_filter($utm, fn($v) => $v !== null);

            app(RecaptchaGuardService::class)->validate(
                $request->input('recaptcha_token'),
                $request->input('recaptcha_action')
            );

            // Lead oluştur
            $lead = Lead::create([
                'name' => $request->name,
                'company' => $request->company,
                'email' => $request->email,
                'tel' => $request->tel,
                'employee_count' => $request->employee_count,
                'meta' => [
                    'user_agent' => $request->userAgent(),
                    'ip' => $request->ip(),
                    'referer' => $request->header('referer'),
                ],
                'utm' => $utm ?: null,
                'path' => $request->path ?? '/',
                'variant_id' => $request->variant_id,
                'crm_status' => Lead::CRM_STATUS_PENDING,
            ]);

            $this->storeStatamicLeadSubmission($lead, $utm);

            Log::info('New lead created', [
                'lead_id' => $lead->id,
                'email' => $lead->email,
                'path' => $lead->path,
            ]);

            // CRM'e gönder (queue)
            SyncLeadToCrm::dispatch($lead->id);

            // Hoşgeldin e-postası gönder
            try {
                $this->mailService->sendLeadWelcome($lead);

                $this->automationService->trigger('lead_created', [
                    'lead_id' => $lead->id,
                    'name' => $lead->name,
                    'company' => $lead->company,
                    'email' => $lead->email,
                    'tel' => $lead->tel,
                    'employee_count' => $lead->employee_count,
                    'path' => $lead->path,
                    'variant_id' => $lead->variant_id,
                    'form_handle' => 'lead',
                    'utm' => $utm,
                ], $lead);
            } catch (\Exception $e) {
                Log::error('Welcome email failed', [
                    'lead_id' => $lead->id,
                    'error' => $e->getMessage(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lead başarıyla oluşturuldu.',
                'data' => [
                    'id' => $lead->id,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Lead creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
            ], 500);
        }
    }

    private function storeStatamicLeadSubmission(Lead $lead, array $utm): void
    {
        $payload = [
            'name' => $lead->name,
            'email' => $lead->email,
            'tel' => $lead->tel,
            'company' => $lead->company,
            'employee_count' => $lead->employee_count,
            'path' => $lead->path,
            'variant_id' => $lead->variant_id,
            'utm_source' => $utm['source'] ?? null,
            'utm_medium' => $utm['medium'] ?? null,
            'utm_campaign' => $utm['campaign'] ?? null,
            'utm_term' => $utm['term'] ?? null,
            'utm_content' => $utm['content'] ?? null,
            'gclid' => $utm['gclid'] ?? null,
            'fbclid' => $utm['fbclid'] ?? null,
        ];

        FormSubmission::create([
            'form' => 'lead',
            'data' => array_filter($payload, fn ($value) => ! is_null($value)),
            'ip_address' => $lead->meta['ip'] ?? null,
            'user_agent' => $lead->meta['user_agent'] ?? null,
            'created_at' => $lead->created_at,
            'updated_at' => $lead->updated_at,
        ]);
    }

    /**
     * Lead'i ID'ye göre getir
     * 
     * GET /api/admin/leads/{id}
     */
    public function show(int $id): JsonResponse
    {
        $lead = Lead::find($id);

        if (!$lead) {
            return response()->json([
                'success' => false,
                'message' => 'Lead bulunamadı.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $lead,
        ]);
    }

    /**
     * Tüm leadleri listele
     * 
     * GET /api/admin/leads
     */
    public function index(Request $request): JsonResponse
    {
        $query = Lead::query();

        // Filtreler
        if ($request->has('crm_status')) {
            $query->where('crm_status', $request->crm_status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        $leads = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $leads,
        ]);
    }

    /**
     * Lead'i manuel olarak CRM'e tekrar gönder
     * 
     * POST /api/admin/leads/{id}/resync
     */
    public function resync(int $id): JsonResponse
    {
        $lead = Lead::find($id);

        if (!$lead) {
            return response()->json([
                'success' => false,
                'message' => 'Lead bulunamadı.',
            ], 404);
        }

        // CRM durumunu pending'e çek
        $lead->update(['crm_status' => Lead::CRM_STATUS_PENDING]);

        // Queue'ya ekle
        SyncLeadToCrm::dispatch($lead->id);

        return response()->json([
            'success' => true,
            'message' => 'Lead CRM sırasına eklendi.',
        ]);
    }
}
