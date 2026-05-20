<?php

namespace App\Providers;

use Filament\Filament;
use Filament\Panel;
use Filament\PanelProvider;
use App\Filament\Resources\LeadResource;
use App\Filament\Resources\AssessmentResource;
use App\Filament\Resources\AppointmentResource;
use App\Filament\Resources\MailSettingResource;
use App\Filament\Resources\AutomationRuleResource;
use App\Filament\Resources\MailLogResource;
use App\Filament\Resources\MailTemplateResource;
use App\Filament\Pages\Dashboard;
use App\Filament\Widgets\StatsOverviewWidget;
use App\Filament\Widgets\RecentLeadsWidget;
use App\Filament\Widgets\CrmSyncStatusWidget;

class FilamentServiceProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->brandLogo(asset('images/logo.svg'))
            ->resources([
                LeadResource::class,
                AssessmentResource::class,
                AppointmentResource::class,
                MailSettingResource::class,
                AutomationRuleResource::class,
                MailLogResource::class,
                MailTemplateResource::class,
            ])
            ->pages([
                Dashboard::class,
                \App\Filament\Pages\Analytics::class,
            ])
            ->widgets([
                StatsOverviewWidget::class,
                RecentLeadsWidget::class,
                CrmSyncStatusWidget::class,
                \Filament\Widgets\AccountWidget::class,
                \Filament\Widgets\FilamentInfoWidget::class,
            ])
            ->middleware([
                \Illuminate\Cookie\Middleware\EncryptCookies::class,
                \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
                \Illuminate\Session\Middleware\StartSession::class,
                \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            ])
            ->authMiddleware([
                \Filament\Http\Middleware\Authenticate::class,
            ])
            ->databaseNotifications();
    }
}
