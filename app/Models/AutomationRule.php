<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AutomationRule extends Model
{
    use HasFactory;

    public const TRIGGER_FORM_SUBMITTED = 'form_submitted';
    public const TRIGGER_EVENT_REGISTRATION_CREATED = 'event_registration_created';
    public const TRIGGER_APPOINTMENT_CREATED = 'appointment_created';
    public const TRIGGER_ASSESSMENT_CREATED = 'assessment_created';
    public const TRIGGER_LEAD_CREATED = 'lead_created';

    protected $fillable = [
        'name',
        'description',
        'trigger',
        'form_handle',
        'template_id',
        'is_active',
        'send_to',
        'recipient_field',
        'cc',
        'bcc',
        'conditions',
        'delay_minutes',
        'priority',
        'stop_on_match',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'conditions' => 'array',
        'settings' => 'array',
        'stop_on_match' => 'boolean',
    ];

    public function template()
    {
        return $this->belongsTo(MailTemplate::class, 'template_id');
    }

    public function scopeForTrigger($query, string $trigger)
    {
        return $query->where('trigger', $trigger)
            ->where('is_active', true)
            ->orderByDesc('priority')
            ->orderBy('id');
    }
}
