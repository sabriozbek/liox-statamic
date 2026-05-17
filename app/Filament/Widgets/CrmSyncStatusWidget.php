<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use App\Models\Assessment;
use App\Models\Appointment;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CrmSyncStatusWidget extends \Filament\Widgets\StatsOverviewWidget
{
    protected function getStats(): array
    {
        $totalLeads = Lead::count();
        $syncedLeads = Lead::crmSynced()->count();
        $pendingLeads = Lead::pendingCrm()->count();
        $errorLeads = Lead::where('crm_status', 'error')->count();

        $totalAssessments = Assessment::count();
        $syncedAssessments = Assessment::where('crm_status', 'synced')->count();
        $pendingAssessments = Assessment::pendingCrm()->count();

        $totalAppointments = Appointment::count();
        $syncedAppointments = Appointment::where('crm_status', 'synced')->count();
        $pendingAppointments = Appointment::pendingCrm()->count();

        return [
            Stat::make('Lead CRM', "{$syncedLeads}/{$totalLeads}")
                ->description("{$pendingLeads} bekliyor, {$errorLeads} hata")
                ->color($pendingLeads > 0 ? 'warning' : 'success'),

            Stat::make('Analiz CRM', "{$syncedAssessments}/{$totalAssessments}")
                ->description("{$pendingAssessments} bekliyor")
                ->color($pendingAssessments > 0 ? 'warning' : 'success'),

            Stat::make('Randevu CRM', "{$syncedAppointments}/{$totalAppointments}")
                ->description("{$pendingAppointments} bekliyor")
                ->color($pendingAppointments > 0 ? 'warning' : 'success'),
        ];
    }
}