<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Statamic\Facades\Asset;
use Statamic\Facades\GlobalSet;

class NotificationContentController extends Controller
{
    private function assetUrl($value): string
    {
        if (empty($value)) {
            return '';
        }

        if (is_array($value)) {
            $first = $value[0] ?? null;

            if (is_string($first)) {
                return $this->assetUrl($first);
            }

            if (is_object($first) && method_exists($first, 'url')) {
                return $first->url();
            }
        }

        if (is_object($value) && method_exists($value, 'url')) {
            return $value->url();
        }

        if (is_string($value) && str_contains($value, '::')) {
            return Asset::find($value)?->url() ?? '';
        }

        return (string) $value;
    }

    public function index()
    {
        $global = GlobalSet::findByHandle('notifications');

        if (! $global) {
            return response()->json([
                'notifications_enabled' => false,
                'notifications_title' => 'Bildirim Merkezi',
                'notification_items' => [],
            ]);
        }

        $data = $global->inDefaultSite()->data()->all();
        $items = collect($data['notification_items'] ?? [])->map(function ($item) {
            $item['image'] = $this->assetUrl($item['image'] ?? null);
            return $item;
        })->values()->all();

        return response()->json([
            'notifications_enabled' => (bool) ($data['notifications_enabled'] ?? false),
            'notifications_title' => $data['notifications_title'] ?? 'Bildirim Merkezi',
            'notification_items' => $items,
        ]);
    }
}
