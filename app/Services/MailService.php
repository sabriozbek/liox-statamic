<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Assessment;
use App\Models\AutomationRule;
use App\Models\Lead;
use App\Models\MailLog;
use App\Models\MailTemplate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class MailService
{
    public function __construct(private readonly DynamicMailConfigService $dynamicMailConfigService)
    {
    }

    public function sendLeadWelcome(Lead $lead): void
    {
        $this->sendBySlug('welcome-lead', $lead->email, $lead->name, [
            'name' => $lead->name,
            'company' => $lead->company,
            'email' => $lead->email,
        ], $lead, 'lead_created');
    }

    /**
     * Lead form verisi ile hoşgeldin e-postası gönderir
     */
    public function sendLeadWelcomeByArray(array $data): void
    {
        $this->sendBySlug('welcome-lead', $data['email'] ?? '', $data['name'] ?? '', $data, null, 'lead_created');
    }

    public function sendAssessmentConfirmation(Assessment $assessment): void
    {
        $this->sendBySlug('assessment-confirmation', $assessment->email, $assessment->name, [
            'name' => $assessment->name,
            'company' => $assessment->company,
            'email' => $assessment->email,
        ], $assessment, 'assessment_created');
    }

    /**
     * Assessment form verisi ile onay e-postası gönderir
     */
    public function sendAssessmentConfirmationByArray(array $data): void
    {
        $this->sendBySlug('assessment-confirmation', $data['email'] ?? '', $data['name'] ?? '', $data, null, 'assessment_created');
    }

    public function sendAppointmentConfirmation(Appointment $appointment): void
    {
        $this->sendBySlug('appointment-confirmation', $appointment->email, $appointment->name, [
            'name' => $appointment->name,
            'company' => $appointment->company,
            'email' => $appointment->email,
            'preferred_date' => optional($appointment->preferred_date)?->format('d.m.Y'),
            'preferred_time' => $appointment->preferred_time,
        ], $appointment, 'appointment_created');
    }

    /**
     * Appointment form verisi ile onay e-postası gönderir
     */
    public function sendAppointmentConfirmationByArray(array $data): void
    {
        $this->sendBySlug('appointment-confirmation', $data['email'] ?? '', $data['name'] ?? '', $data, null, 'appointment_created');
    }

    /**
     * Etkinlik kaydı için onay e-postası gönderir
     */
    public function sendEventRegistrationConfirmation(array $data): void
    {
        $this->sendBySlug('event-registration', $data['email'] ?? '', $data['name'] ?? '', $data, null, 'event_registration_created');
    }

    public function sendBySlug(string $slug, string $toEmail, ?string $toName, array $data = [], ?Model $related = null, ?string $trigger = null): ?MailLog
    {
        $template = MailTemplate::findBySlug($slug);

        return $this->sendTemplate($template, $toEmail, $toName, $data, null, $related, $data['form_handle'] ?? null, $trigger);
    }

    public function sendTemplate(
        ?MailTemplate $template,
        string $toEmail,
        ?string $toName = null,
        array $data = [],
        ?AutomationRule $automationRule = null,
        ?Model $related = null,
        ?string $formHandle = null,
        ?string $trigger = null,
    ): ?MailLog {
        if (! $template || ! $template->is_active) {
            Log::info('Mail template missing or inactive.', ['template_id' => $template?->id]);
            return null;
        }

        $mailSetting = $this->dynamicMailConfigService->apply();

        $subject = $template->renderSubject($data);
        $html = $template->render($data);

        $log = MailLog::create([
            'automation_rule_id' => $automationRule?->id,
            'mail_template_id' => $template->id,
            'channel' => 'email',
            'trigger' => $trigger,
            'related_type' => $related?->getMorphClass(),
            'related_id' => $related?->getKey(),
            'form_handle' => $formHandle,
            'recipient_email' => $toEmail,
            'recipient_name' => $toName,
            'subject' => $subject,
            'status' => MailLog::STATUS_PENDING,
            'provider' => $mailSetting?->mailer ?? config('mail.default'),
            'payload' => $data,
            'meta' => [
                'template_slug' => $template->slug,
                'tracking_enabled' => [
                    'opens' => $mailSetting?->track_opens ?? false,
                    'clicks' => $mailSetting?->track_clicks ?? false,
                ],
            ],
        ]);

        $trackedHtml = $this->appendTracking($html, $log, $mailSetting?->track_opens ?? false, $mailSetting?->track_clicks ?? false);

        try {
            Mail::html($trackedHtml, function ($message) use ($toEmail, $toName, $subject, $mailSetting) {
                $message->to($toEmail, $toName)->subject($subject);

                if ($mailSetting?->reply_to_address) {
                    $message->replyTo($mailSetting->reply_to_address, $mailSetting->reply_to_name);
                }
            });

            $log->update([
                'status' => MailLog::STATUS_SENT,
                'sent_at' => now(),
            ]);

            return $log;
        } catch (Throwable $e) {
            $log->update([
                'status' => MailLog::STATUS_FAILED,
                'failed_at' => now(),
                'error_message' => $e->getMessage(),
            ]);

            Log::error('Mail send failed.', ['error' => $e->getMessage(), 'mail_log_id' => $log->id]);

            return $log;
        }
    }

    public function sendAdminNotification(string $type, array $data): void
    {
        $adminEmail = config('mail.from.address');

        if (! $adminEmail) {
            return;
        }

        Mail::html($this->buildAdminNotificationContent($type, $data), function ($message) use ($adminEmail, $type) {
            $message->to($adminEmail)->subject('Admin Bildirimi: '.$type);
        });
    }

    private function appendTracking(string $html, MailLog $log, bool $trackOpens, bool $trackClicks): string
    {
        $result = $html;

        if ($trackClicks) {
            $result = preg_replace_callback('/href=["\']([^"\']+)["\']/', function (array $matches) use ($log) {
                $tracked = url('/api/mail-tracker/click/'.$log->id.'?url='.urlencode($matches[1]));
                return 'href="'.$tracked.'"';
            }, $result) ?? $result;
        }

        if ($trackOpens) {
            $pixel = '<img src="'.url('/api/mail-tracker/open/'.$log->id).'" width="1" height="1" style="display:none" alt="" />';
            $result .= $pixel;
        }

        return $result;
    }

    private function buildAdminNotificationContent(string $type, array $data): string
    {
        $rows = '';
        foreach ($data as $key => $value) {
            $rows .= '<tr><td style="padding:8px;border:1px solid #ddd;"><strong>'.e((string) $key).'</strong></td><td style="padding:8px;border:1px solid #ddd;">'.e(is_scalar($value) ? (string) $value : json_encode($value)).'</td></tr>';
        }

        return '<html><body><table style="border-collapse:collapse;width:100%;">'.$rows.'</table></body></html>';
    }
}
