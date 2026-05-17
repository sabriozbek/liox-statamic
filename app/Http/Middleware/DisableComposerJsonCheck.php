<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DisableComposerJsonCheck
{
    /**
     * Handle an incoming request - bypasses Statamic's composer.json check
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip Statamic composer.json check in local development
        return $next($request);
    }
}
