<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Integrations\StatamicForms\FormSubmissionHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class FormWebhookController extends Controller
{
    public function __construct(
        private FormSubmissionHandler $handler
    ) {}

    /**
     * Statamic Forms webhook handler
     * 
     * POST /api/forms/webhook
     */
    public function handle(Request $request): JsonResponse
    {
        try {
            $form = $request->input('form');
            $data = $request->input('data', []);
            $submission = [
                'id' => $request->input('id'),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'created_at' => now()->toIso8601String(),
            ];

            if (!$form) {
                return response()->json([
                    'success' => false,
                    'message' => 'Form name is required',
                ], 400);
            }

            $this->handler->handle($form, $data, $submission);

            return response()->json([
                'success' => true,
                'message' => 'Form processed successfully',
            ]);
        } catch (\Exception $e) {
            Log::error('Form webhook error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Processing failed',
            ], 500);
        }
    }
}