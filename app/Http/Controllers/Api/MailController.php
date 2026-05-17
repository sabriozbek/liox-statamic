<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MailLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MailController extends Controller
{
    public function trackOpen(int $id): Response
    {
        $log = MailLog::find($id);

        if ($log) {
            $log->increment('opens_count');
            $log->forceFill(['last_opened_at' => now()])->save();
        }

        $pixel = base64_decode('R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');

        return response($pixel, 200, [
            'Content-Type' => 'image/gif',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
        ]);
    }

    public function trackClick(Request $request, int $id): RedirectResponse
    {
        $log = MailLog::find($id);

        if ($log) {
            $log->increment('clicks_count');
            $log->forceFill(['last_clicked_at' => now()])->save();
        }

        return redirect()->away($request->string('url')->toString() ?: url('/'));
    }
}
