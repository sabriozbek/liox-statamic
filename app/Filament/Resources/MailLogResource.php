<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MailLogResource\Pages;
use App\Models\MailLog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class MailLogResource extends Resource
{
    protected static ?string $model = MailLog::class;

    protected static ?string $navigationIcon = 'heroicon-o-chart-bar-square';

    protected static ?string $navigationLabel = 'Mail Kayıtları';

    protected static ?string $modelLabel = 'Mail Kaydı';

    protected static ?string $pluralModelLabel = 'Mail Kayıtları';

    protected static ?string $navigationGroup = 'Mailing';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form->schema([]);
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Section::make('Gönderim Özeti')
                ->schema([
                    TextEntry::make('recipient_email')->label('Alıcı'),
                    TextEntry::make('recipient_name')->label('Alıcı Adı'),
                    TextEntry::make('subject')->label('Konu'),
                    TextEntry::make('status')->label('Durum'),
                    TextEntry::make('trigger')->label('Tetikleyici'),
                    TextEntry::make('provider')->label('Sağlayıcı'),
                    TextEntry::make('message_id')->label('Mesaj ID'),
                    TextEntry::make('sent_at')->label('Gönderildi')->dateTime('d.m.Y H:i:s'),
                    TextEntry::make('last_opened_at')->label('Son Açılma')->dateTime('d.m.Y H:i:s'),
                    TextEntry::make('last_clicked_at')->label('Son Tıklama')->dateTime('d.m.Y H:i:s'),
                ])->columns(2),
            Section::make('Analitik')
                ->schema([
                    TextEntry::make('opens_count')->label('Açılma Sayısı'),
                    TextEntry::make('clicks_count')->label('Tıklama Sayısı'),
                    TextEntry::make('error_message')->label('Hata')->placeholder('-')->columnSpanFull(),
                    KeyValueEntry::make('payload')->label('Payload'),
                    KeyValueEntry::make('meta')->label('Meta'),
                ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('created_at')->dateTime('d.m.Y H:i')->label('Tarih')->sortable(),
                Tables\Columns\TextColumn::make('recipient_email')->label('Alıcı')->searchable()->copyable(),
                Tables\Columns\TextColumn::make('recipient_name')->label('Ad')->toggleable(),
                Tables\Columns\TextColumn::make('subject')->label('Konu')->limit(40),
                Tables\Columns\TextColumn::make('trigger')->label('Tetikleyici')->toggleable(),
                Tables\Columns\TextColumn::make('template.name')->label('Şablon')->toggleable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'success' => MailLog::STATUS_SENT,
                        'danger' => MailLog::STATUS_FAILED,
                        'warning' => MailLog::STATUS_PENDING,
                        'gray' => MailLog::STATUS_SKIPPED,
                    ]),
                Tables\Columns\TextColumn::make('opens_count')->label('Açılma')->sortable(),
                Tables\Columns\TextColumn::make('clicks_count')->label('Tıklama')->sortable(),
                Tables\Columns\TextColumn::make('sent_at')->dateTime('d.m.Y H:i')->label('Gönderildi')->toggleable(),
            ])
            ->filters([
                SelectFilter::make('status')->options([
                    MailLog::STATUS_PENDING => 'Bekliyor',
                    MailLog::STATUS_SENT => 'Gönderildi',
                    MailLog::STATUS_FAILED => 'Hatalı',
                    MailLog::STATUS_SKIPPED => 'Atlandı',
                ]),
                SelectFilter::make('trigger')->options([
                    'form_submitted' => 'Form gönderildi',
                    'event_registration_created' => 'Etkinlik kaydı',
                    'event_registration_reminder' => 'Etkinlik hatırlatma',
                    'appointment_created' => 'Randevu',
                    'assessment_created' => 'Analiz',
                    'lead_created' => 'Lead',
                ]),
                Filter::make('opened')
                    ->label('Açılanlar')
                    ->query(fn (Builder $query) => $query->where('opens_count', '>', 0)),
                Filter::make('clicked')
                    ->label('Tıklananlar')
                    ->query(fn (Builder $query) => $query->where('clicks_count', '>', 0)),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
            ]);
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMailLogs::route('/'),
            'view' => Pages\ViewMailLog::route('/{record}'),
        ];
    }
}
