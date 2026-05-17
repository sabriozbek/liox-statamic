<?php

namespace App\Filament\Resources\MailTemplateResource\Pages;

use App\Filament\Resources\MailTemplateResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Artisan;

class ListMailTemplates extends ListRecords
{
    protected static string $resource = MailTemplateResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
            Actions\Action::make('install_defaults')
                ->label('Varsayılanları Yükle')
                ->icon('heroicon-o-arrow-down-tray')
                ->action(function () {
                    Artisan::call('mailing:seed-defaults');

                    Notification::make()
                        ->title('Varsayılan şablonlar ve mailing verileri yüklendi')
                        ->success()
                        ->send();
                }),
        ];
    }
}
