<?php

namespace App\Filament\Widgets;

use App\Models\Lead;
use Filament\Widgets\TableWidget;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;

class RecentLeadsWidget extends TableWidget
{
    protected int $pagination = 5;
    protected function getTableQuery(): \Illuminate\Database\Eloquent\Builder
    {
        return Lead::query()->latest()->limit(5);
    }

    protected function getTableColumns(): array
    {
        return [
            TextColumn::make('name')->label('Ad'),
            TextColumn::make('email')->label('E-posta')->limit(20),
            BadgeColumn::make('crm_status')
                ->label('CRM')
                ->colors(['success' => 'synced', 'warning' => 'pending', 'danger' => 'error']),
            TextColumn::make('created_at')->label('Tarih')->dateTime('H:i'),
        ];
    }

    protected function getHeading(): string
    {
        return 'Son Leadler';
    }
}