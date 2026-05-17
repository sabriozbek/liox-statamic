<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Widgets\FilamentInfoWidget;
use Filament\Widgets\AccountWidget;
use App\Filament\Widgets\StatsOverviewWidget;
use App\Filament\Widgets\RecentLeadsWidget;
use App\Filament\Widgets\CrmSyncStatusWidget;

class Dashboard extends BaseDashboard
{
    protected function getHeaderWidgets(): array
    {
        return [
            StatsOverviewWidget::class,
        ];
    }

    protected function getFooterWidgets(): array
    {
        return [
            RecentLeadsWidget::class,
            CrmSyncStatusWidget::class,
        ];
    }

    public function getTitle(): string
    {
        return 'LioXERP Yönetim Paneli';
    }
}