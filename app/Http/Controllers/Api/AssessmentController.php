<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssessmentRequest;
use App\Jobs\SyncAssessmentToCrm;
use App\Services\AutomationService;
use App\Services\MailService;
use App\Services\RecaptchaGuardService;
use App\Models\Assessment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AssessmentController extends Controller
{
    public function __construct(
        private MailService $mailService,
        private AutomationService $automationService,
    ) {}

    /**
     * Yeni ihtiyaç analizi oluştur
     * 
     * POST /api/assessment
     */
    public function store(StoreAssessmentRequest $request): JsonResponse
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

            $assessment = Assessment::create([
                'name' => $request->name,
                'company' => $request->company,
                'email' => $request->email,
                'tel' => $request->tel,
                'employee_count' => $request->employee_count,
                'sector' => $request->sector,
                'current_erp' => $request->current_erp,
                'current_challenges' => $request->current_challenges,
                'goals' => $request->goals,
                'budget_range' => $request->budget_range,
                'timeline' => $request->timeline,
                'meta' => [
                    'user_agent' => $request->userAgent(),
                    'ip' => $request->ip(),
                    'referer' => $request->header('referer'),
                ],
                'utm' => $utm ?: null,
                'path' => $request->path ?? '/',
                'variant_id' => $request->variant_id,
                'crm_status' => Assessment::CRM_STATUS_PENDING,
            ]);

            Log::info('New assessment created', [
                'assessment_id' => $assessment->id,
                'email' => $assessment->email,
            ]);

            // CRM'e gönder
            SyncAssessmentToCrm::dispatch($assessment->id);

            // Onay e-postası gönder
            try {
                $this->mailService->sendAssessmentConfirmation($assessment);

                $this->automationService->trigger('assessment_created', [
                    'assessment_id' => $assessment->id,
                    'name' => $assessment->name,
                    'company' => $assessment->company,
                    'email' => $assessment->email,
                    'tel' => $assessment->tel,
                    'employee_count' => $assessment->employee_count,
                    'sector' => $assessment->sector,
                    'current_erp' => $assessment->current_erp,
                    'current_challenges' => $assessment->current_challenges,
                    'goals' => $assessment->goals,
                    'budget_range' => $assessment->budget_range,
                    'timeline' => $assessment->timeline,
                    'path' => $assessment->path,
                    'variant_id' => $assessment->variant_id,
                    'form_handle' => 'assessment',
                    'utm' => $utm,
                ], $assessment);
            } catch (\Exception $e) {
                Log::error('Assessment confirmation email failed', [
                    'assessment_id' => $assessment->id,
                    'error' => $e->getMessage(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'İhtiyaç analizi başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.',
                'data' => [
                    'id' => $assessment->id,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Assessment creation failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
            ], 500);
        }
    }

    /**
     * Tüm analizleri listele
     */
    public function index(Request $request): JsonResponse
    {
        $query = Assessment::query();

        if ($request->has('crm_status')) {
            $query->where('crm_status', $request->crm_status);
        }

        if ($request->has('sector')) {
            $query->where('sector', $request->sector);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%");
            });
        }

        $assessments = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $assessments,
        ]);
    }

    /**
     * Analiz detayını getir
     */
    public function show(int $id): JsonResponse
    {
        $assessment = Assessment::find($id);

        if (!$assessment) {
            return response()->json([
                'success' => false,
                'message' => 'Analiz bulunamadı.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $assessment,
        ]);
    }
}
