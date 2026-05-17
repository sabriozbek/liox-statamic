<?php

namespace App\Services;

use App\Models\FormSubmission;

class StatamicSubmissionStatusService
{
    public function updateLatestByEmail(string $formHandle, string $email, array $statusData): void
    {
        $submission = FormSubmission::query()
            ->where('form', $formHandle)
            ->where('data->email', $email)
            ->latest('created_at')
            ->first();

        if (! $submission) {
            return;
        }

        $submission->update([
            'data' => array_merge($submission->data ?? [], $statusData),
        ]);
    }
}
