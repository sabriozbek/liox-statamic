<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DisableStatamicMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Disable Statamic middleware check
        return $next($request);
    }
}
