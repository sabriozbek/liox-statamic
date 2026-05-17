<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assessment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'company',
        'email',
        'tel',
        'employee_count',
        'sector',
        'current_erp',
        'current_challenges',
        'goals',
        'budget_range',
        'timeline',
        'meta',
        'utm',
        'path',
        'variant_id',
        'crm_status',
        'crm_message',
    ];

    protected $casts = [
        'meta' => 'array',
        'utm' => 'array',
    ];

    const CRM_STATUS_PENDING = 'pending';
    const CRM_STATUS_SYNCED = 'synced';
    const CRM_STATUS_ERROR = 'error';

    /**
     * Scope: CRM'e gönderilmeyi bekleyen analizler
     */
    public function scopePendingCrm($query)
    {
        return $query->where('crm_status', self::CRM_STATUS_PENDING);
    }

    /**
     * Scope: Son X günde oluşturulan analizler
     */
    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * CRM'e gönderim durumunu güncelle
     */
    public function updateCrmStatus(string $status, ?string $message = null): void
    {
        $this->update([
            'crm_status' => $status,
            'crm_message' => $message,
        ]);
    }
}
