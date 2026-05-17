<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Lead extends Model
{
    use HasFactory, SoftDeletes;

    protected $appends = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',
        'fbclid',
    ];

    protected $fillable = [
        'name',
        'company',
        'email',
        'tel',
        'employee_count',
        'meta',
        'utm',
        'path',
        'variant_id',
        'crm_status',
        'crm_message',
        'sector',
        'message',
        'crm_lead_id',
        'ip_address',
        'user_agent',
        'priority',
    ];

    protected $casts = [
        'meta' => 'array',
        'utm' => 'array',
    ];

    const CRM_STATUS_PENDING = 'pending';
    const CRM_STATUS_SYNCED = 'synced';
    const CRM_STATUS_ERROR = 'error';
    const CRM_STATUS_SKIPPED = 'skipped';

    /**
     * Scope: CRM'sine gönderilmeyi bekleyen leadler
     */
    public function scopePendingCrm($query)
    {
        return $query->where('crm_status', self::CRM_STATUS_PENDING);
    }

    /**
     * Scope: Son X günde oluşturulan leadler
     */
    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Scope: CRM'e başarıyla gönderilen leadler
     */
    public function scopeCrmSynced($query)
    {
        return $query->where('crm_status', self::CRM_STATUS_SYNCED);
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

    /**
     * Lead'in UTM verilerini JSON olarak döndür
     */
    public function getUtmString(): string
    {
        $utm = $this->utm ?? [];
        
        $parts = [];
        if (isset($utm['source'])) {
            $parts[] = 'source: ' . $utm['source'];
        }
        if (isset($utm['medium'])) {
            $parts[] = 'medium: ' . $utm['medium'];
        }
        if (isset($utm['campaign'])) {
            $parts[] = 'campaign: ' . $utm['campaign'];
        }

        return implode(', ', $parts);
    }

    public function getUtmSourceAttribute(): ?string
    {
        return data_get($this->utm, 'source');
    }

    public function getUtmMediumAttribute(): ?string
    {
        return data_get($this->utm, 'medium');
    }

    public function getUtmCampaignAttribute(): ?string
    {
        return data_get($this->utm, 'campaign');
    }

    public function getUtmTermAttribute(): ?string
    {
        return data_get($this->utm, 'term');
    }

    public function getUtmContentAttribute(): ?string
    {
        return data_get($this->utm, 'content');
    }

    public function getGclidAttribute(): ?string
    {
        return data_get($this->utm, 'gclid');
    }

    public function getFbclidAttribute(): ?string
    {
        return data_get($this->utm, 'fbclid');
    }
}
