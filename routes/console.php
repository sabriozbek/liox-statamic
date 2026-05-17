<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\SeedMailingDataCommand;
use App\Console\Commands\SendEventReminderEmailsCommand;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
*/

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command(SendEventReminderEmailsCommand::class)->hourly();

Artisan::command('mailing:install', function () {
    $this->call(SeedMailingDataCommand::class);
})->purpose('Mailing modülü varsayılan verilerini kurar');
