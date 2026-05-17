<?php

namespace App\Actions;

use App\Jobs\SyncLeadToCrm;
use App\Models\Lead;
use Statamic\Actions\Action;
use Statamic\Forms\Submission;

class ResendLeadSubmissionToCrm extends Action
{
    protected static $title = 'CRM Gönder';

    public static function handle()
    {
        return 'resend_lead_submission_to_crm';
    }

    public function visibleTo($item)
    {
        return $item instanceof Submission && optional($item->form())->handle() === 'lead';
    }

    public function run($items, $values)
    {
        $count = 0;

        foreach ($items as $submission) {
            if (! $submission instanceof Submission) {
                continue;
            }

            $data = $submission->data()->all();

            $lead = Lead::query()->firstOrCreate(
                [
                    'email' => $data['email'] ?? null,
                    'path' => $data['path'] ?? '/',
                    'created_at' => $submission->date(),
                ],
                [
                    'name' => $data['name'] ?? 'İsimsiz Lead',
                    'company' => $data['company'] ?? null,
                    'tel' => $data['tel'] ?? ($data['phone'] ?? null),
                    'employee_count' => $data['employee_count'] ?? null,
                    'variant_id' => $data['variant_id'] ?? null,
                    'utm' => array_filter([
                        'source' => $data['utm_source'] ?? null,
                        'medium' => $data['utm_medium'] ?? null,
                        'campaign' => $data['utm_campaign'] ?? null,
                        'term' => $data['utm_term'] ?? null,
                        'content' => $data['utm_content'] ?? null,
                        'gclid' => $data['gclid'] ?? null,
                        'fbclid' => $data['fbclid'] ?? null,
                    ]),
                    'meta' => array_filter([
                        'submission_id' => $submission->id(),
                    ]),
                    'crm_status' => Lead::CRM_STATUS_PENDING,
                ]
            );

            $lead->update([
                'crm_status' => Lead::CRM_STATUS_PENDING,
                'crm_message' => null,
            ]);

            SyncLeadToCrm::dispatch($lead->id);
            $count++;
        }

        return $count > 0
            ? __('CRM gönderimi kuyruğa alındı.|:count kayıt CRM gönderimi için kuyruğa alındı.', ['count' => $count])
            : 'Gönderilecek lead bulunamadı.';
    }
}
