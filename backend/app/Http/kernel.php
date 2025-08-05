<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        
    ];

    protected $middlewareGroups = [
        'web' => [
            
        ],

        'api' => [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            'bindings',
        ],
    ];

    protected $routeMiddleware = [
       
    ];
}
