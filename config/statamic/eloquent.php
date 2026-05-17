<?php

return [
    'driver' => 'file',

    'directories' => [
        'content' => base_path('content'),
    ],

    'custom' => [
        'lead_entries' => \App\Models\Lead::class,
        'mail_templates' => \App\Models\MailTemplate::class,
        'popups' => \App\Models\Popup::class,
    ],
];