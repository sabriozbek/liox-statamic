<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MailTemplate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'subject',
        'content',
        'variables',
        'type',
        'is_active',
        'metadata',
    ];

    protected $casts = [
        'variables' => 'array',
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    public static function findBySlug(string $slug): ?self
    {
        return static::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();
    }

    public static function findByType(string $type): ?self
    {
        return static::query()
            ->where('type', $type)
            ->where('is_active', true)
            ->latest('id')
            ->first();
    }

    public function render(array $data = []): string
    {
        return $this->replacePlaceholders($this->content, $data);
    }

    public function renderSubject(array $data = []): string
    {
        return $this->replacePlaceholders($this->subject, $data);
    }

    protected function replacePlaceholders(string $value, array $data): string
    {
        foreach ($data as $key => $item) {
            if (is_scalar($item) || $item === null) {
                $value = str_replace(['{{'.$key.'}}', '{{ '.$key.' }}'], (string) $item, $value);
            }
        }

        return preg_replace('/\{\{\s*[a-zA-Z0-9_\.]+\s*\}\}/', '', $value) ?? $value;
    }
}
