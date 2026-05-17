<?php

namespace App\Services;

use Anakadote\StatamicRecaptcha\Services\RecaptchaV3;
use Illuminate\Validation\ValidationException;

class RecaptchaGuardService
{
    public function validate(?string $token, ?string $action): void
    {
        if (! config('recaptcha.enabled', true)) {
            return;
        }

        if (config('recaptcha.recaptcha_version') !== 'v3') {
            return;
        }

        if (! $token || ! $action) {
            throw ValidationException::withMessages([
                'recaptcha' => 'reCAPTCHA doğrulaması gerekli.',
            ]);
        }

        if (! RecaptchaV3::verify($token, $action, config('recaptcha.recaptcha_v3.threshold', 0.5))) {
            throw ValidationException::withMessages([
                'recaptcha' => 'reCAPTCHA doğrulaması başarısız oldu.',
            ]);
        }
    }
}
