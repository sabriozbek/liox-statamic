<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FormSubmission;
use App\Services\AutomationService;
use App\Services\RecaptchaGuardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Statamic\Facades\Form;

class FormController extends Controller
{
    public function __construct(private readonly AutomationService $automationService)
    {
    }

    public function submit(Request $request, string $handle): JsonResponse
    {
        try {
            $form = Form::find($handle);

            if (! $form) {
                return response()->json(['success' => false, 'message' => 'Form not found'], 404);
            }

            $inputData = $request->all();
            $data = $inputData['data'] ?? $inputData;
            unset($data['_token'], $data['_redirect'], $data['_form'], $data['form']);

            app(RecaptchaGuardService::class)->validate(
                $data['recaptcha_token'] ?? null,
                $data['recaptcha_action'] ?? null,
            );

            $submission = FormSubmission::create([
                'form' => $handle,
                'data' => $data,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $payload = array_merge($data, [
                'form_handle' => $handle,
                'submission_id' => (string) $submission->id,
            ]);

            $this->automationService->trigger('form_submitted', $payload);

            if ($handle === 'event_registration') {
                $this->automationService->trigger('event_registration_created', $payload);
            }

            Log::info("Statamic form submitted: {$handle}", ['submission_id' => $submission->id]);

            return response()->json(['success' => true, 'message' => 'Form submitted successfully'], 201);
        } catch (\Throwable $e) {
            Log::error("Form submission error: {$handle}", ['error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    public function submissions(Request $request, string $handle): JsonResponse
    {
        try {
            $form = Form::find($handle);

            if (! $form) {
                return response()->json(['success' => false, 'message' => 'Form not found'], 404);
            }

            $page = (int) $request->get('page', 1);
            $perPage = (int) $request->get('per_page', 20);
            $query = FormSubmission::query()
                ->where('form', $handle)
                ->latest('created_at');

            $total = $query->count();

            $submissions = $query
                ->forPage($page, $perPage)
                ->get()
                ->map(fn (FormSubmission $submission) => [
                    'id' => (string) $submission->id,
                    'data' => $submission->data ?? [],
                    'created_at' => $submission->created_at?->toIso8601String(),
                    'ip_address' => $submission->ip_address,
                    'user_agent' => $submission->user_agent,
                ])
                ->values()
                ->all();

            return response()->json(['success' => true, 'data' => ['data' => $submissions, 'total' => $total, 'per_page' => $perPage, 'current_page' => $page, 'last_page' => (int) ceil($total / $perPage)]]);
        } catch (\Throwable $e) {
            Log::error("Form submissions error: {$handle}", ['error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'Failed to get submissions'], 500);
        }
    }
}
