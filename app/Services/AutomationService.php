<?php

namespace App\Services;

use App\Models\AutomationRule;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class AutomationService
{
    public function __construct(private readonly MailService $mailService)
    {
    }

    public function trigger(string $trigger, array $payload = [], ?Model $related = null): void
    {
        $rules = AutomationRule::query()
            ->forTrigger($trigger)
            ->with('template')
            ->get();

        foreach ($rules as $rule) {
            if (! $this->matchesRule($rule, $payload)) {
                continue;
            }

            $recipient = $this->resolveRecipient($rule, $payload);

            if (! $recipient) {
                continue;
            }

            $this->mailService->sendTemplate(
                template: $rule->template,
                toEmail: $recipient['email'],
                toName: $recipient['name'] ?? null,
                data: $payload,
                automationRule: $rule,
                related: $related,
                formHandle: $payload['form_handle'] ?? null,
                trigger: $trigger,
            );

            if ($rule->stop_on_match) {
                break;
            }
        }
    }

    private function matchesRule(AutomationRule $rule, array $payload): bool
    {
        if ($rule->form_handle && $rule->form_handle !== ($payload['form_handle'] ?? null)) {
            return false;
        }

        foreach (($rule->conditions ?? []) as $condition) {
            $field = Arr::get($condition, 'field');
            $operator = Arr::get($condition, 'operator', 'equals');
            $expected = Arr::get($condition, 'value');
            $actual = data_get($payload, $field);

            $matched = match ($operator) {
                'not_equals' => (string) $actual !== (string) $expected,
                'contains' => str_contains(mb_strtolower((string) $actual), mb_strtolower((string) $expected)),
                'in' => in_array($actual, (array) $expected, true),
                default => (string) $actual === (string) $expected,
            };

            if (! $matched) {
                return false;
            }
        }

        return true;
    }

    private function resolveRecipient(AutomationRule $rule, array $payload): ?array
    {
        return match ($rule->send_to) {
            'custom' => $rule->settings['custom_recipient'] ?? null
                ? ['email' => $rule->settings['custom_recipient'], 'name' => $rule->settings['custom_name'] ?? null]
                : null,
            'field' => ($email = data_get($payload, $rule->recipient_field ?: 'email'))
                ? ['email' => $email, 'name' => data_get($payload, 'name')]
                : null,
            default => ($email = data_get($payload, 'email'))
                ? ['email' => $email, 'name' => data_get($payload, 'name')]
                : null,
        };
    }
}
