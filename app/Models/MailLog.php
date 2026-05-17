<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailLog extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';
    public const STATUS_SENT = 'sent';
    public const STATUS_FAILED = 'failed';
    public const STATUS_SKIPPED = 'skipped';

    protected $fillable = [
        'automation_rule_id',
        'mail_template_id',
        'channel',
        'trigger',
        'related_type',
        'related_id',
        'form_handle',
        'recipient_email',
        'recipient_name',
        'subject',
        'status',
        'provider',
        'message_id',
        'opens_count',
        'clicks_count',
        'last_opened_at',
        'last_clicked_at',
        'sent_at',
        'failed_at',
        'error_message',
        'payload',
        'meta',
    ];

    protected $casts = [
        'payload' => 'array',
        'meta' => 'array',
        'sent_at' => 'datetime',
        'failed_at' => 'datetime',
        'last_opened_at' => 'datetime',
        'last_clicked_at' => 'datetime',
    ];

    public function template()
    {
        return $this->belongsTo(MailTemplate::class, 'mail_template_id');
    }

    public function automationRule()
    {
        return $this->belongsTo(AutomationRule::class, 'automation_rule_id');
    }

    public function related()
    {
        return $this->morphTo();
    }
}
