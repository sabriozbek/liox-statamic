<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\Lead;
use App\Models\Assessment;
use App\Models\Appointment;
use Filament\Widgets\StatsOverviewWidget\Stat;

class Analytics extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';
    protected static ?string $navigationLabel = 'Analitik';
    protected static string $view = 'filament.pages.analytics';

    public function getTitle(): string
    {
        return 'Site Analitik';
    }

    public static function shouldRegisterNavigation(): bool
    {
        return true;
    }

    public function mount(): void
    {
        // Mount logic if needed
    }

    protected function getStats(): array
    {
        $today = now()->startOfDay();
        $weekAgo = now()->subDays(7);

        return [
            Stat::make('Bu Ay Lead', Lead::whereMonth('created_at', now()->month)->count())
                ->description('Geçen ay: ' . Lead::whereMonth('created_at', now()->subMonth()->month)->count())
                ->descriptionIcon('heroicon-m-arrow-trend-up')
                ->color('success'),

            Stat::make('Bekleyen CRM', Lead::pendingCrm()->count())
                ->description('Toplam lead: ' . Lead::count())
                ->color('warning'),

            Stat::make('Bu Hafta Analiz', Assessment::recent(7)->count())
                ->color('info'),

            Stat::make('Yaklaşan Randevular', Appointment::upcoming()->count())
                ->color('primary'),
        ];
    }
}