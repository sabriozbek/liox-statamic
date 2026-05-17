<?php

namespace App\Services;

use App\Models\MailSetting;
use Illuminate\Support\Facades\Config;

class DynamicMailConfigService
{
    public function apply(): ?MailSetting
    {
        $setting = MailSetting::active();

        if (! $setting || ! $setting->host || ! $setting->from_address) {
            return null;
        }

        Config::set('mail.default', $setting->mailer ?: 'smtp');
        Config::set('mail.mailers.smtp', [
            'transport' => 'smtp',
            'host' => $setting->host,
            'port' => $setting->port,
            'encryption' => $setting->encryption,
            'username' => $setting->username,
            'password' => $setting->password,
            'timeout' => null,
        ]);

        Config::set('mail.from.address', $setting->from_address);
        Config::set('mail.from.name', $setting->from_name ?: config('app.name'));

        return $setting;
    }
}
