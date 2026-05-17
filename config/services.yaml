<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    /*
    |--------------------------------------------------------------------------
    | CRM Integration (Uyumsoft)
    |--------------------------------------------------------------------------
    */

    'crm' => [
        'login_url' => env('CRM_LOGIN_URL', 'http://crmapi.erp.uyumcloud.com/UyumApi/v1/GNL/UyumLogin/'),
        'save_url' => env('CRM_SAVE_URL', 'http://crmapi.erp.uyumcloud.com/UyumApi/v1/CRM/SaveCrmForm'),
        'username' => env('CRM_USERNAME'),
        'password' => env('CRM_PASSWORD'),
        'timeout' => env('CRM_TIMEOUT', 15),
        'retry_attempts' => env('CRM_RETRY_ATTEMPTS', 3),
    ],

];
