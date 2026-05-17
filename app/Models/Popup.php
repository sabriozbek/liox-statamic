<?php

namespace App\Models;

use Statamic\Entries\Entry;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Popup extends Entry
{
    use HasFactory;

    const CMS_HANDLE = 'popups';
    const AUTO_GENERATED = false;

    public $translatable = ['title', 'content'];

    /**
     * Check if popup should show on current page
     */
    public function shouldShow(string $currentPath): bool
    {
        if (!$this->get('is_active', false)) {
            return false;
        }

        $pages = $this->get('pages') ?? [];
        $excludePages = $this->get('exclude_pages') ?? [];

        // If specific pages are set, check against them
        if (!empty($pages) && !in_array($currentPath, $pages)) {
            return false;
        }

        // Check excluded pages
        if (!empty($excludePages) && in_array($currentPath, $excludePages)) {
            return false;
        }

        return true;
    }

    /**
     * Get popup config for frontend
     */
    public function toFrontendConfig(): array
    {
        return [
            'id' => $this->id(),
            'title' => $this->get('title'),
            'type' => $this->get('type', 'modal'),
            'content' => $this->get('content'),
            'button_text' => $this->get('button_text'),
            'button_url' => $this->get('button_url'),
            'trigger_delay' => $this->get('trigger_delay', 0),
            'trigger_scroll_percent' => $this->get('trigger_scroll_percent'),
            'show_again_after' => $this->get('show_again_after', 7),
            'design' => $this->get('design', 'light'),
            'size' => $this->get('size', 'medium'),
        ];
    }
}
