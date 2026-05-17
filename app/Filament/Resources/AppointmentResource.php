<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AppointmentResource\Pages;
use App\Models\Appointment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Infolists;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Actions\Action;
use Illuminate\Database\Eloquent\Builder;

class AppointmentResource extends Resource
{
    protected static ?string $model = Appointment::class;
    protected static ?string $navigationIcon = 'heroicon-o-calendar';
    protected static ?string $navigationLabel = 'Randevular';
    protected static ?string $modelLabel = 'Randevu';
    protected static ?string $pluralModelLabel = 'Randevular';
    protected static ?string $navigationGroup = 'CRM';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Kişisel Bilgiler')
                    ->schema([
                        Forms\Components\TextInput::make('name')->label('Ad Soyad')->required(),
                        Forms\Components\TextInput::make('email')->label('E-posta')->email()->required(),
                        Forms\Components\TextInput::make('tel')->label('Telefon'),
                        Forms\Components\TextInput::make('company')->label('Firma'),
                    ])->columns(2),

                Forms\Components\Section::make('Randevu Bilgileri')
                    ->schema([
                        Forms\Components\DatePicker::make('preferred_date')
                            ->label('Tercih Edilen Tarih')
                            ->required(),
                        Forms\Components\TextInput::make('preferred_time')
                            ->label('Tercih Edilen Saat'),
                        Forms\Components\TextInput::make('sector')->label('Sektör'),
                        Forms\Components\Select::make('status')
                            ->label('Durum')
                            ->options([
                                'pending' => 'Bekliyor',
                                'confirmed' => 'Onaylandı',
                                'completed' => 'Tamamlandı',
                                'cancelled' => 'İptal Edildi',
                            ])
                            ->default('pending'),
                    ])->columns(2),

                Forms\Components\Section::make('Notlar')
                    ->schema([
                        Forms\Components\Textarea::make('notes')
                            ->label('Notlar')
                            ->rows(3),
                    ]),

                Forms\Components\Section::make('Kaynak Bilgileri')
                    ->schema([
                        Forms\Components\TextInput::make('path')->label('Sayfa'),
                        Forms\Components\KeyValue::make('utm')->label('UTM Parametreleri'),
                    ]),

                Forms\Components\Section::make('CRM Durumu')
                    ->schema([
                        Forms\Components\Select::make('crm_status')
                            ->label('CRM Durumu')
                            ->options([
                                'pending' => 'Bekliyor',
                                'synced' => 'Gönderildi',
                                'error' => 'Hata',
                            ]),
                        Forms\Components\Textarea::make('crm_message')->label('CRM Mesajı'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('preferred_date', 'asc')
            ->columns([
                Tables\Columns\TextColumn::make('preferred_date')
                    ->label('Tarih')
                    ->date('d.m.Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('preferred_time')
                    ->label('Saat'),
                Tables\Columns\TextColumn::make('name')
                    ->label('Ad Soyad')
                    ->searchable(),
                Tables\Columns\TextColumn::make('company')
                    ->label('Firma')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('E-posta'),
                Tables\Columns\TextColumn::make('tel')
                    ->label('Telefon'),
                Tables\Columns\TextColumn::make('sector')
                    ->label('Sektör'),
                Tables\Columns\BadgeColumn::make('status')
                    ->label('Durum')
                    ->colors([
                        'success' => 'completed',
                        'info' => 'confirmed',
                        'warning' => 'pending',
                        'danger' => 'cancelled',
                    ])
                    ->formatStateUsing(fn (string $state): string => [
                        'pending' => 'Bekliyor',
                        'confirmed' => 'Onaylandı',
                        'completed' => 'Tamamlandı',
                        'cancelled' => 'İptal',
                    ][$state] ?? $state),
                Tables\Columns\BadgeColumn::make('crm_status')
                    ->label('CRM')
                    ->colors([
                        'success' => 'synced',
                        'warning' => 'pending',
                        'danger' => 'error',
                    ]),
            ])
            ->filters([
                SelectFilter::make('status')->label('Durum'),
                SelectFilter::make('sector')->label('Sektör'),
                Filter::make('preferred_date')
                    ->form([
                        Forms\Components\DatePicker::make('from'),
                        Forms\Components\DatePicker::make('to'),
                    ])
                    ->query(function (Builder $query, array $data) {
                        if ($data['from']) $query->whereDate('preferred_date', '>=', $data['from']);
                        if ($data['to']) $query->whereDate('preferred_date', '<=', $data['to']);
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Action::make('confirm')
                    ->label('Onayla')
                    ->icon('heroicon-m-check')
                    ->color('success')
                    ->action(function (Appointment $record) {
                        $record->confirm();
                        filament()->notify('Randevu onaylandı.', 'success');
                    })
                    ->visible(fn (Appointment $record) => $record->status === 'pending'),
                Action::make('cancel')
                    ->label('İptal Et')
                    ->icon('heroicon-m-x-mark')
                    ->color('danger')
                    ->action(function (Appointment $record) {
                        $record->cancel();
                        filament()->notify('Randevu iptal edildi.', 'warning');
                    })
                    ->visible(fn (Appointment $record) => $record->status !== 'cancelled'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAppointments::route('/'),
            'view' => Pages\ViewAppointment::route('/{record}'),
        ];
    }
}
