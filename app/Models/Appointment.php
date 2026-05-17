<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Appointment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'company',
        'email',
        'tel',
        'preferred_date',
        'preferred_time',
        'sector',
        'notes',
        'meta',
        'utm',
        'path',
        'variant_id',
        'status',
        'crm_status',
        'crm_message',
        'reminder_sent_at',
    ];

    protected $casts = [
        'meta' => 'array',
        'utm' => 'array',
        'preferred_date' => 'date',
        'reminder_sent_at' => 'datetime',
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    const CRM_STATUS_PENDING = 'pending';
    const CRM_STATUS_SYNCED = 'synced';
    const CRM_STATUS_ERROR = 'error';

    /**
     * Scope: Bekleyen randevular
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope: Bugünkü randevular
     */
    public function scopeToday($query)
    {
        return $query->whereDate('preferred_date', today());
    }

    /**
     * Scope: Gelecek randevular
     */
    public function scopeUpcoming($query)
    {
        return $query->whereDate('preferred_date', '>=', today())
            ->where('status', self::STATUS_PENDING);
    }

    /**
     * Randevuyu onayla
     */
    public function confirm(): void
    {
        $this->update(['status' => self::STATUS_CONFIRMED]);
    }

    /**
     * Randevuyu iptal et
     */
    public function cancel(): void
    {
        $this->update(['status' => self::STATUS_CANCELLED]);
    }
}
