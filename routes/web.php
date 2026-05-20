<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Statamic\Facades\Site;
use App\Http\Controllers\Web\PageController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Statamic CMS routes are handled automatically
// Additional web routes can be added here

Route::get('/assets/{path}', function (string $path) {
    abort_unless(Storage::disk('local')->exists($path), 404);

    $fullPath = Storage::disk('local')->path($path);
    $mimeType = mime_content_type($fullPath) ?: 'application/octet-stream';

    return Response::file($fullPath, [
        'Content-Type' => $mimeType,
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*');

Route::get('/', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'LioXERP API Running',
        'version' => '1.0.0',
        'endpoints' => [
            'POST /api/crm/lead' => 'Submit lead form',
            'POST /api/assessment' => 'Submit needs assessment',
            'POST /api/appointment' => 'Book appointment',
        ]
    ]);
})->name('home');

// Legacy CP aliases -> Filament admin panel
Route::redirect('/cp', '/admin');
Route::redirect('/cp/auth/login', '/login');
Route::redirect('/cp/dashboard', '/admin');

// Health check
Route::get('/up', function () {
    return response()->json(['status' => 'ok']);
});
