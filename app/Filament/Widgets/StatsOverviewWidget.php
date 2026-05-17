<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\MailLog;
use App\Models\AutomationRule;
use App\Models\Lead;
use App\Models\Assessment;
use App\Models\Appointment;

class StatsOverviewWidget extends \Filament\Widgets\StatsOverviewWidget
{
    protected function getStats(): array
    {
        $today = now()->startOfDay();
        $weekAgo = now()->subDays(7);

        return [
            Stat::make('Bugünkü Lead', Lead::whereDate('created_at', $today)->count())
                ->description('Bu hafta: ' . Lead::recent(7)->count())
                ->icon('heroicon-o-user-group')
                ->color('primary'),

            Stat::make('CRM Bekleyen', Lead::pendingCrm()->count())
                ->icon('heroicon-o-clock')
                ->color('warning'),

            Stat::make('Bu Ay Analiz', Assessment::whereMonth('created_at', now()->month)->count())
                ->icon('heroicon-o-clipboard-document-check')
                ->color('info'),

            Stat::make('Yaklaşan Randevu', Appointment::upcoming()->count())
                ->icon('heroicon-o-calendar')
                ->color('success'),

            Stat::make('Gönderilen E-posta', MailLog::query()->where('status', MailLog::STATUS_SENT)->count())
                ->description('Hatalı: ' . MailLog::query()->where('status', MailLog::STATUS_FAILED)->count())
                ->icon('heroicon-o-envelope')
                ->color('info'),

            Stat::make('Aktif Otomasyon', AutomationRule::query()->where('is_active', true)->count())
                ->description('Toplam kural: ' . AutomationRule::query()->count())
                ->icon('heroicon-o-bolt')
                ->color('warning'),
        ];
    }
}
