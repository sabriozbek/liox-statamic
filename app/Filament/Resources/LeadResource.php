<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LeadResource\Pages;
use App\Models\Lead;
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
use Filament\Tables\Actions\ActionGroup;
use Filament\Tables\Enums\ActionsPosition;
use Illuminate\Database\Eloquent\Builder;

class LeadResource extends Resource
{
    protected static ?string $model = Lead::class;
    protected static ?string $navigationIcon = 'heroicon-o-user-group';
    protected static ?string $navigationLabel = 'Leadler';
    protected static ?string $modelLabel = 'Lead';
    protected static ?string $pluralModelLabel = 'Leadler';
    protected static ?string $navigationGroup = 'CRM';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Kişisel Bilgiler')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Ad Soyad')
                            ->required(),
                        Forms\Components\TextInput::make('email')
                            ->label('E-posta')
                            ->email()
                            ->required(),
                        Forms\Components\TextInput::make('tel')
                            ->label('Telefon'),
                        Forms\Components\TextInput::make('company')
                            ->label('Firma'),
                        Forms\Components\TextInput::make('employee_count')
                            ->label('Çalışan Sayısı'),
                    ])->columns(2),

                Forms\Components\Section::make('Kaynak Bilgileri')
                    ->schema([
                        Forms\Components\TextInput::make('path')
                            ->label('Sayfa'),
                        Forms\Components\TextInput::make('variant_id')
                            ->label('A/B Test Variant'),
                        Forms\Components\KeyValue::make('utm')
                            ->label('UTM Parametreleri'),
                        Forms\Components\KeyValue::make('meta')
                            ->label('Ek Bilgiler'),
                    ]),

                Forms\Components\Section::make('CRM Durumu')
                    ->schema([
                        Forms\Components\Select::make('crm_status')
                            ->label('CRM Durumu')
                            ->options([
                                'pending' => 'Bekliyor',
                                'synced' => 'Gönderildi',
                                'error' => 'Hata',
                                'skipped' => 'Atlandı',
                            ]),
                        Forms\Components\Textarea::make('crm_message')
                            ->label('CRM Mesajı'),
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
                    ->toggleable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Ad Soyad')
                    ->toggleable()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('company')
                    ->label('Firma')
                    ->toggleable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('employee_count')
                    ->label('Çalışan')
                    ->toggleable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('E-posta')
                    ->toggleable()
                    ->searchable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('tel')
                    ->label('Telefon')
                    ->toggleable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('variant_id')
                    ->label('Variant')
                    ->toggleable()
                    ->placeholder('-'),
                Tables\Columns\BadgeColumn::make('crm_status')
                    ->label('CRM Durumu')
                    ->toggleable()
                    ->colors([
                        'success' => 'synced',
                        'warning' => 'pending',
                        'danger' => 'error',
                        'gray' => 'skipped',
                    ])
                    ->formatStateUsing(fn (string $state): string => [
                        'pending' => 'Bekliyor',
                        'synced' => 'Gönderildi',
                        'error' => 'Hata',
                        'skipped' => 'Atlandı',
                    ][$state] ?? $state),
                Tables\Columns\IconColumn::make('crm_success_icon')
                    ->label('CRM OK')
                    ->state(fn (Lead $record): bool => $record->crm_status === Lead::CRM_STATUS_SYNCED)
                    ->boolean()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('crm_message')
                    ->label('CRM Mesajı')
                    ->toggleable()
                    ->wrap()
                    ->limit(90)
                    ->tooltip(fn (Lead $record): ?string => $record->crm_message),
                Tables\Columns\TextColumn::make('crm_status_code')
                    ->label('CRM HTTP')
                    ->state(function (Lead $record): string {
                        if (! $record->crm_message) {
                            return '-';
                        }

                        if (preg_match('/HTTP\s+(\d{3})/', $record->crm_message, $matches)) {
                            return $matches[1];
                        }

                        return '-';
                    })
                    ->toggleable(),
                Tables\Columns\TextColumn::make('utm_source')
                    ->label('UTM Source')
                    ->toggleable()
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('utm_medium')
                    ->label('UTM Medium')
                    ->toggleable()
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('utm_campaign')
                    ->label('UTM Campaign')
                    ->toggleable()
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('utm_term')
                    ->label('UTM Term')
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('utm_content')
                    ->label('UTM Content')
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('gclid')
                    ->label('GCLID')
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('fbclid')
                    ->label('FBCLID')
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->placeholder('-'),
                Tables\Columns\TextColumn::make('path')
                    ->label('Kaynak')
                    ->toggleable()
                    ->limit(30),
            ])
            ->filters([
                SelectFilter::make('crm_status')
                    ->label('CRM Durumu')
                    ->options([
                        'pending' => 'Bekliyor',
                        'synced' => 'Gönderildi',
                        'error' => 'Hata',
                    ]),
                Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('from'),
                        Forms\Components\DatePicker::make('to'),
                    ])
                    ->query(function (Builder $query, array $data) {
                        if ($data['from']) {
                            $query->whereDate('created_at', '>=', $data['from']);
                        }
                        if ($data['to']) {
                            $query->whereDate('created_at', '<=', $data['to']);
                        }
                    })
                    ->indicateUsing(function (array $data): ?string {
                        if ($data['from'] || $data['to']) {
                            return 'Tarih aralığı filtrelendi';
                        }
                        return null;
                    }),
            ])
            ->actions([
                Action::make('resync_inline')
                    ->label('CRM Gönder')
                    ->icon('heroicon-m-arrow-path')
                    ->color('warning')
                    ->requiresConfirmation()
                    ->action(function (Lead $record) {
                        $record->update([
                            'crm_status' => 'pending',
                            'crm_message' => null,
                        ]);

                        \App\Jobs\SyncLeadToCrm::dispatch($record->id);

                        \Filament\Notifications\Notification::make()
                            ->title('Lead tekrar CRM kuyruğuna eklendi')
                            ->success()
                            ->send();
                    })
                    ->iconButton(),
                ActionGroup::make([
                    Action::make('resync')
                        ->label('Tekrar CRM Gönder')
                        ->icon('heroicon-m-arrow-path')
                        ->color('warning')
                        ->requiresConfirmation()
                        ->action(function (Lead $record) {
                            $record->update([
                                'crm_status' => 'pending',
                                'crm_message' => null,
                            ]);

                            \App\Jobs\SyncLeadToCrm::dispatch($record->id);

                            \Filament\Notifications\Notification::make()
                                ->title('Lead tekrar CRM kuyruğuna eklendi')
                                ->success()
                                ->send();
                        }),
                    Tables\Actions\ViewAction::make(),
                    Tables\Actions\EditAction::make(),
                ])
                    ->label('İşlemler')
                    ->tooltip('İşlemler')
                    ->icon('heroicon-m-ellipsis-horizontal')
                    ->iconButton(),
            ])
            ->actionsPosition(ActionsPosition::BeforeCells)
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\ExportBulkAction::make(),
                    Action::make('bulk_resync')
                        ->label('Seçili Olanları CRM\'e Gönder')
                        ->action(function (\Illuminate\Database\Eloquent\Collection $records) {
                            foreach ($records as $record) {
                                $record->update(['crm_status' => 'pending']);
                                \App\Jobs\SyncLeadToCrm::dispatch($record->id);
                            }
                            filament()->notify('Seçili leadler CRM sırasına eklendi.', 'success');
                        }),
                ]),
            ])
            ->emptyStateIcon('heroicon-o-user-group')
            ->emptyStateDescription('Henüz lead bulunmuyor.')
            ->emptyStateActions([
                Tables\Actions\Action::make('create')
                    ->label('Yeni Lead Ekle')
                    ->url(route('filament.admin.resources.leads.create'))
                    ->icon('heroicon-m-plus'),
            ]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Section::make('Kişisel Bilgiler')
                    ->schema([
                        TextEntry::make('name'),
                        TextEntry::make('email'),
                        TextEntry::make('tel'),
                        TextEntry::make('company'),
                        TextEntry::make('employee_count'),
                    ])->columns(2),

                Section::make('Kaynak Bilgileri')
                    ->schema([
                        TextEntry::make('path'),
                        TextEntry::make('variant_id'),
                        TextEntry::make('utm')->json(),
                        TextEntry::make('created_at')->dateTime(),
                    ]),

                Section::make('CRM Durumu')
                    ->schema([
                        TextEntry::make('crm_status')
                            ->badge()
                            ->color(fn (string $state): string => [
                                'synced' => 'success',
                                'pending' => 'warning',
                                'error' => 'danger',
                            ][$state] ?? 'gray'),
                        TextEntry::make('crm_status_code')
                            ->label('CRM HTTP')
                            ->state(function (Lead $record): string {
                                if (! $record->crm_message) {
                                    return '-';
                                }

                                if (preg_match('/HTTP\s+(\d{3})/', $record->crm_message, $matches)) {
                                    return $matches[1];
                                }

                                return '-';
                            }),
                        TextEntry::make('crm_message'),
                    ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListLeads::route('/'),
            'create' => Pages\CreateLead::route('/create'),
            'view' => Pages\ViewLead::route('/{record}'),
            'edit' => Pages\EditLead::route('/{record}/edit'),
        ];
    }
}
