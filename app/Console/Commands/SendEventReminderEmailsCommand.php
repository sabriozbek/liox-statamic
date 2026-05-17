<?php

namespace App\Console\Commands;

use App\Services\MailService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Symfony\Component\Yaml\Yaml;

class SendEventReminderEmailsCommand extends Command
{
    protected $signature = 'mail:send-event-reminders {--dry-run : Sadece aday kayıtları listeler}';

    protected $description = 'Etkinlik kayıtlarına hatırlatma e-postalarını gönderir';

    public function handle(MailService $mailService): int
    {
        $directory = resource_path('forms/event_registration');

        if (! File::exists($directory)) {
            $this->info('Etkinlik kayıt dizini bulunamadı.');

            return self::SUCCESS;
        }

        $files = collect(File::files($directory))
            ->filter(fn ($file) => $file->getExtension() === 'yaml');

        $sentCount = 0;

        foreach ($files as $file) {
            $data = Yaml::parseFile($file->getPathname()) ?? [];

            if (! data_get($data, 'email')) {
                continue;
            }

            if ($this->option('dry-run')) {
                $this->line('Aday kayıt: '.data_get($data, 'email'));
                continue;
            }

            $mailService->sendBySlug('event-reminder', (string) data_get($data, 'email'), (string) data_get($data, 'name'), [
                'name' => data_get($data, 'name'),
                'email' => data_get($data, 'email'),
                'company' => data_get($data, 'company'),
                'tel' => data_get($data, 'tel'),
                'event_title' => data_get($data, 'event_title'),
                'event_slug' => data_get($data, 'event_slug'),
                'notes' => data_get($data, 'notes'),
                'form_handle' => 'event_registration',
            ], null, 'event_registration_reminder');

            $sentCount++;
        }

        $this->info("Hatırlatma işlemi tamamlandı. Gönderim sayısı: {$sentCount}");

        return self::SUCCESS;
    }
}
