<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AssessmentResource\Pages;
use App\Models\Assessment;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Infolist;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Components\Section;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Actions\Action;
use Illuminate\Database\Eloquent\Builder;

class AssessmentResource extends Resource
{
    protected static ?string $model = Assessment::class;
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';
    protected static ?string $navigationLabel = 'Analizler';
    protected static ?string $modelLabel = 'İhtiyaç Analizi';
    protected static ?string $pluralModelLabel = 'İhtiyaç Analizleri';
    protected static ?string $navigationGroup = 'CRM';
    protected static ?int $navigationSort = 2;

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
                        Forms\Components\TextInput::make('employee_count')->label('Çalışan Sayısı'),
                    ])->columns(2),

                Forms\Components\Section::make('İşletme Bilgileri')
                    ->schema([
                        Forms\Components\TextInput::make('sector')->label('Sektör'),
                        Forms\Components\TextInput::make('current_erp')->label('Mevcut ERP'),
                        Forms\Components\Select::make('budget_range')
                            ->label('Bütçe Aralığı')
                            ->options([
                                '0-50k' => '0 - 50.000 TL',
                                '50k-100k' => '50.000 - 100.000 TL',
                                '100k-250k' => '100.000 - 250.000 TL',
                                '250k-500k' => '250.000 - 500.000 TL',
                                '500k+' => '500.000 TL üzeri',
                            ]),
                        Forms\Components\Select::make('timeline')
                            ->label('Zamanlama')
                            ->options([
                                'hemen' => 'Hemen başlamak istiyorum',
                                '1-3ay' => '1-3 ay içinde',
                                '3-6ay' => '3-6 ay içinde',
                                '6ay+'=> '6 aydan uzun',
                            ]),
                    ])->columns(2),

                Forms\Components\Section::make('Detaylı Bilgiler')
                    ->schema([
                        Forms\Components\Textarea::make('current_challenges')
                            ->label('Mevcut Zorluklar')
                            ->rows(3),
                        Forms\Components\Textarea::make('goals')
                            ->label('Hedefler')
                            ->rows(3),
                    ]),

                Forms\Components\Section::make('Kaynak Bilgileri')
                    ->schema([
                        Forms\Components\TextInput::make('path')->label('Sayfa'),
                        Forms\Components\TextInput::make('variant_id')->label('A/B Test Variant'),
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
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Tarih')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Ad Soyad')
                    ->searchable(),
                Tables\Columns\TextColumn::make('company')
                    ->label('Firma')
                    ->searchable(),
                Tables\Columns\TextColumn::make('sector')
                    ->label('Sektör')
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('E-posta')
                    ->searchable(),
                Tables\Columns\TextColumn::make('employee_count')
                    ->label('Çalışan'),
                Tables\Columns\BadgeColumn::make('crm_status')
                    ->label('CRM')
                    ->colors([
                        'success' => 'synced',
                        'warning' => 'pending',
                        'danger' => 'error',
                    ]),
                Tables\Columns\TextColumn::make('budget_range')
                    ->label('Bütçe'),
            ])
            ->filters([
                SelectFilter::make('sector')->label('Sektör'),
                SelectFilter::make('crm_status')->label('CRM Durumu'),
                Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('from'),
                        Forms\Components\DatePicker::make('to'),
                    ])
                    ->query(function (Builder $query, array $data) {
                        if ($data['from']) $query->whereDate('created_at', '>=', $data['from']);
                        if ($data['to']) $query->whereDate('created_at', '<=', $data['to']);
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Action::make('resync')
                    ->label('CRM\'e Gönder')
                    ->icon('heroicon-m-arrow-path')
                    ->color('warning')
                    ->action(function (Assessment $record) {
                        $record->update(['crm_status' => 'pending']);
                        \App\Jobs\SyncAssessmentToCrm::dispatch($record->id);
                        filament()->notify('Analiz CRM sırasına eklendi.', 'success');
                    })
                    ->visible(fn (Assessment $record) => $record->crm_status !== 'synced'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAssessments::route('/'),
            'view' => Pages\ViewAssessment::route('/{record}'),
        ];
    }
}
