<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Statamic\Facades\Utility;
use Statamic\Statamic;
use App\Http\Controllers\Web\CpMailingController;

class CpNavigationServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Statamic::pushCpRoutes(function () {
            \Route::prefix('utilities/mailing')->name('utilities.mailing.')->group(function () {
                \Route::get('templates', [CpMailingController::class, 'templates'])->name('templates');
                \Route::get('templates/{template}', [CpMailingController::class, 'editTemplate'])->name('templates.edit');
                \Route::post('templates', [CpMailingController::class, 'saveTemplate'])->name('templates.store');
                \Route::post('templates/{template}', [CpMailingController::class, 'saveTemplate'])->name('templates.update');

                \Route::get('smtp', [CpMailingController::class, 'smtp'])->name('smtp');
                \Route::get('smtp/{setting}', [CpMailingController::class, 'editSmtp'])->name('smtp.edit');
                \Route::post('smtp', [CpMailingController::class, 'saveSmtp'])->name('smtp.store');
                \Route::post('smtp/{setting}', [CpMailingController::class, 'saveSmtp'])->name('smtp.update');

                \Route::get('automations', [CpMailingController::class, 'automations'])->name('automations');
                \Route::get('automations/{rule}', [CpMailingController::class, 'editAutomation'])->name('automations.edit');
                \Route::post('automations', [CpMailingController::class, 'saveAutomation'])->name('automations.store');
                \Route::post('automations/{rule}', [CpMailingController::class, 'saveAutomation'])->name('automations.update');

                \Route::get('logs', [CpMailingController::class, 'logs'])->name('logs');
            });
        });

        Utility::register('mailing-templates')
            ->action([CpMailingController::class, 'templates'])
            ->title('E-posta Şablonları')
            ->navTitle('E-posta Şablonları')
            ->icon('email-utility')
            ->description('Mail şablonlarını CP içinden yönetin.');

        Utility::register('mailing-smtp')
            ->action([CpMailingController::class, 'smtp'])
            ->title('SMTP Ayarları')
            ->navTitle('SMTP Ayarları')
            ->icon('settings-slider')
            ->description('SMTP ve gönderen ayarlarını yönetin.');

        Utility::register('mailing-automations')
            ->action([CpMailingController::class, 'automations'])
            ->title('Mail Otomasyonları')
            ->navTitle('Mail Otomasyonları')
            ->icon('loading-bar')
            ->description('Otomasyon kurallarını ve akışlarını yönetin.');

        Utility::register('mailing-logs')
            ->action([CpMailingController::class, 'logs'])
            ->title('Mail Kayıtları')
            ->navTitle('Mail Kayıtları')
            ->icon('search-utility')
            ->description('Gönderim, açılma ve tıklama kayıtlarını inceleyin.');
    }
}
