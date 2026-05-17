<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AutomationRule;
use App\Models\MailLog;
use App\Models\MailSetting;
use App\Models\MailTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class CpMailingController extends Controller
{
    public function templates(): View
    {
        return view('cp.utilities.mailing.templates', [
            'templates' => MailTemplate::query()->orderBy('name')->get(),
            'editing' => null,
        ]);
    }

    public function editTemplate(MailTemplate $template): View
    {
        return view('cp.utilities.mailing.templates', [
            'templates' => MailTemplate::query()->orderBy('name')->get(),
            'editing' => $template,
        ]);
    }

    public function saveTemplate(Request $request, ?MailTemplate $template = null): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'slug' => ['required', 'string'],
            'subject' => ['required', 'string'],
            'content' => ['required', 'string'],
            'type' => ['required', 'string'],
            'variables' => ['nullable', 'string'],
        ]);

        $record = $template ?? new MailTemplate();
        $record->fill([
            'name' => $data['name'],
            'slug' => $data['slug'],
            'subject' => $data['subject'],
            'content' => $data['content'],
            'type' => $data['type'],
            'is_active' => $request->boolean('is_active'),
            'variables' => collect(explode(',', $data['variables'] ?? ''))->map(fn ($item) => trim($item))->filter()->values()->all(),
        ]);
        $record->save();

        return redirect(cp_route('utilities.mailing.templates'))->with('success', 'Şablon kaydedildi.');
    }

    public function smtp(): View
    {
        return view('cp.utilities.mailing.smtp', [
            'settings' => MailSetting::query()->latest()->get(),
            'editing' => null,
        ]);
    }

    public function editSmtp(MailSetting $setting): View
    {
        return view('cp.utilities.mailing.smtp', [
            'settings' => MailSetting::query()->latest()->get(),
            'editing' => $setting,
        ]);
    }

    public function saveSmtp(Request $request, ?MailSetting $setting = null): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'host' => ['nullable', 'string'],
            'port' => ['required', 'integer'],
            'encryption' => ['nullable', 'string'],
            'username' => ['nullable', 'string'],
            'password' => ['nullable', 'string'],
            'from_address' => ['nullable', 'email'],
            'from_name' => ['nullable', 'string'],
            'reply_to_address' => ['nullable', 'email'],
            'reply_to_name' => ['nullable', 'string'],
        ]);

        $record = $setting ?? new MailSetting();
        $record->fill($data + [
            'is_enabled' => $request->boolean('is_enabled'),
            'track_opens' => $request->boolean('track_opens'),
            'track_clicks' => $request->boolean('track_clicks'),
        ]);
        $record->save();

        return redirect(cp_route('utilities.mailing.smtp'))->with('success', 'SMTP kaydedildi.');
    }

    public function automations(): View
    {
        return view('cp.utilities.mailing.automations', [
            'rules' => AutomationRule::query()->with('template')->orderByDesc('priority')->get(),
            'templates' => MailTemplate::query()->orderBy('name')->get(),
            'editing' => null,
        ]);
    }

    public function editAutomation(AutomationRule $rule): View
    {
        return view('cp.utilities.mailing.automations', [
            'rules' => AutomationRule::query()->with('template')->orderByDesc('priority')->get(),
            'templates' => MailTemplate::query()->orderBy('name')->get(),
            'editing' => $rule,
        ]);
    }

    public function saveAutomation(Request $request, ?AutomationRule $rule = null): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'trigger' => ['required', 'string'],
            'form_handle' => ['nullable', 'string'],
            'template_id' => ['nullable', 'integer'],
            'send_to' => ['required', 'string'],
            'recipient_field' => ['nullable', 'string'],
            'priority' => ['required', 'integer'],
            'delay_minutes' => ['required', 'integer'],
            'conditions_json' => ['nullable', 'string'],
            'settings_json' => ['nullable', 'string'],
        ]);

        $record = $rule ?? new AutomationRule();
        $record->fill([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'trigger' => $data['trigger'],
            'form_handle' => $data['form_handle'] ?? null,
            'template_id' => $data['template_id'] ?? null,
            'send_to' => $data['send_to'],
            'recipient_field' => $data['recipient_field'] ?? 'email',
            'priority' => $data['priority'],
            'delay_minutes' => $data['delay_minutes'],
            'is_active' => $request->boolean('is_active'),
            'stop_on_match' => $request->boolean('stop_on_match'),
            'conditions' => $this->decodeJson($data['conditions_json'] ?? '[]'),
            'settings' => $this->decodeJson($data['settings_json'] ?? '{}'),
        ]);
        $record->save();

        return redirect(cp_route('utilities.mailing.automations'))->with('success', 'Otomasyon kaydedildi.');
    }

    public function logs(): View
    {
        return view('cp.utilities.mailing.logs', [
            'logs' => MailLog::query()->with(['template', 'automationRule'])->latest()->limit(200)->get(),
        ]);
    }

    private function decodeJson(string $value): array
    {
        $decoded = json_decode($value, true);

        return is_array($decoded) ? $decoded : [];
    }
}
