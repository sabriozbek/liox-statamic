<?php

namespace App\Support;

use Statamic\Facades\Asset;

trait ResolvesStatamicAssets
{
    protected function resolveAssetUrl(mixed $value): string
    {
        if (empty($value)) {
            return '';
        }

        if (is_string($value)) {
            if (str_starts_with($value, 'http://') || str_starts_with($value, 'https://') || str_starts_with($value, '/')) {
                return $value;
            }

            if (str_contains($value, '::')) {
                return Asset::find($value)?->url() ?? '';
            }

            return url('/assets/' . ltrim($value, '/'));
        }

        if (is_array($value)) {
            $first = $value[0] ?? null;

            if (is_string($first)) {
                return $this->resolveAssetUrl($first);
            }

            if (is_object($first) && method_exists($first, 'url')) {
                return $first->url() ?? '';
            }

            if (is_array($first)) {
                $candidate = $first['id'] ?? $first['path'] ?? $first['url'] ?? null;

                return $candidate ? $this->resolveAssetUrl($candidate) : '';
            }
        }

        if (is_object($value) && method_exists($value, 'url')) {
            return $value->url() ?? '';
        }

        return '';
    }

    protected function normalizeAssetGrid(array $items, array $fields): array
    {
        return array_map(function ($item) use ($fields) {
            foreach ($fields as $field) {
                if (isset($item[$field])) {
                    $item[$field] = $this->resolveAssetUrl($item[$field]);
                }
            }

            return $item;
        }, $items);
    }
}
