<?php

namespace App\Console\Commands;

use App\Models\AutomationRule;
use App\Models\MailSetting;
use App\Models\MailTemplate;
use Illuminate\Console\Command;

class SeedMailingDataCommand extends Command
{
    protected $signature = 'mailing:seed-defaults';

    protected $description = 'Varsayılan mailing şablonları, SMTP profili ve otomasyon kuralları oluşturur';

    public function handle(): int
    {
        MailSetting::query()->firstOrCreate(
            ['name' => 'Primary SMTP'],
            [
                'is_enabled' => false,
                'mailer' => 'smtp',
                'port' => 587,
                'encryption' => 'tls',
                'track_opens' => true,
                'track_clicks' => true,
            ]
        );

        $templates = [
            [
                'name' => 'Hoşgeldin Lead',
                'slug' => 'welcome-lead',
                'subject' => 'LioXERP\'e Hoşgeldiniz, {{ name }}',
                'content' => '<h1>Merhaba {{ name }}</h1><p>LioXERP ailesine hoş geldiniz. En kısa sürede sizinle iletişime geçeceğiz.</p>',
                'type' => 'welcome',
                'variables' => ['name', 'company', 'email'],
            ],
            [
                'name' => 'Etkinlik Kayıt Onayı',
                'slug' => 'event-registration-welcome',
                'subject' => '{{ event_title }} kaydınız alındı',
                'content' => '<h1>Merhaba {{ name }}</h1><p>{{ event_title }} etkinliği için kaydınız başarıyla alındı.</p>',
                'type' => 'event_registration',
                'variables' => ['name', 'email', 'event_title', 'event_slug', 'company'],
            ],
            [
                'name' => 'Etkinlik Hatırlatma',
                'slug' => 'event-reminder',
                'subject' => 'Hatırlatma: {{ event_title }}',
                'content' => '<h1>{{ event_title }}</h1><p>Merhaba {{ name }}, etkinlik başlangıcı yaklaşmaktadır.</p>',
                'type' => 'event_reminder',
                'variables' => ['name', 'email', 'event_title', 'event_slug'],
            ],
            [
                'name' => 'Randevu Onayı',
                'slug' => 'appointment-confirmation',
                'subject' => 'Randevu talebiniz alındı',
                'content' => '<p>Merhaba {{ name }}, {{ preferred_date }} {{ preferred_time }} için talebiniz alındı.</p>',
                'type' => 'appointment',
                'variables' => ['name', 'email', 'preferred_date', 'preferred_time'],
            ],
            [
                'name' => 'İhtiyaç Analizi Onayı',
                'slug' => 'assessment-confirmation',
                'subject' => 'İhtiyaç analizi formunuz alındı',
                'content' => '<p>Merhaba {{ name }}, ihtiyaç analizi formunuz için teşekkür ederiz.</p>',
                'type' => 'assessment',
                'variables' => ['name', 'email', 'company'],
            ],
        ];

        foreach ($templates as $template) {
            MailTemplate::query()->updateOrCreate(
                ['slug' => $template['slug']],
                array_merge($template, ['is_active' => true])
            );
        }

        $eventRegistrationTemplate = MailTemplate::query()->where('slug', 'event-registration-welcome')->first();
        $eventReminderTemplate = MailTemplate::query()->where('slug', 'event-reminder')->first();
        $leadTemplate = MailTemplate::query()->where('slug', 'welcome-lead')->first();

        $rules = [
            [
                'name' => 'Yeni form geldiğinde lead hoşgeldin',
                'trigger' => AutomationRule::TRIGGER_LEAD_CREATED,
                'form_handle' => 'lead',
                'template_id' => $leadTemplate?->id,
                'send_to' => 'submitter',
            ],
            [
                'name' => 'Etkinlik kayıt sonrası karşılama',
                'trigger' => AutomationRule::TRIGGER_EVENT_REGISTRATION_CREATED,
                'form_handle' => 'event_registration',
                'template_id' => $eventRegistrationTemplate?->id,
                'send_to' => 'submitter',
            ],
            [
                'name' => 'Etkinlik hatırlatma',
                'trigger' => 'event_registration_reminder',
                'form_handle' => 'event_registration',
                'template_id' => $eventReminderTemplate?->id,
                'send_to' => 'submitter',
            ],
        ];

        foreach ($rules as $rule) {
            if (! $rule['template_id']) {
                continue;
            }

            AutomationRule::query()->updateOrCreate(
                ['name' => $rule['name']],
                array_merge($rule, [
                    'description' => $rule['name'],
                    'is_active' => true,
                    'recipient_field' => 'email',
                    'priority' => 100,
                    'delay_minutes' => 0,
                    'stop_on_match' => false,
                    'settings' => [],
                    'conditions' => [],
                ])
            );
        }

        $this->info('Varsayılan mailing verileri oluşturuldu.');

        return self::SUCCESS;
    }
}
