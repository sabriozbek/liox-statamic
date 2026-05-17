<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

/*
|--------------------------------------------------------------------------
| Assets Routes (CDN)
|--------------------------------------------------------------------------
*/

// Assets are served from storage/app/public
// This file is for additional asset routing if needed

Route::get('/assets/{path}', function (string $path) {
    abort_unless(Storage::disk('local')->exists($path), 404);

    $fullPath = Storage::disk('local')->path($path);
    $mimeType = mime_content_type($fullPath) ?: 'application/octet-stream';

    return Response::file($fullPath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*');
