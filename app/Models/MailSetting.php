<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'is_enabled',
        'mailer',
        'host',
        'port',
        'encryption',
        'username',
        'password',
        'from_address',
        'from_name',
        'reply_to_address',
        'reply_to_name',
        'track_opens',
        'track_clicks',
        'daily_quota',
        'metadata',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'track_opens' => 'boolean',
        'track_clicks' => 'boolean',
        'metadata' => 'array',
    ];

    public static function active(): ?self
    {
        return static::query()->where('is_enabled', true)->latest('id')->first();
    }
}
