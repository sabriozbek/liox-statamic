<?php

return [
    'forms' => [
        'driver' => 'file',
    ],

    'form_submissions' => [
        'driver' => env('STATAMIC_FORMS_DRIVER', 'eloquent'),
    ],
];
