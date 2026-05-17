<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MailSettingResource\Pages;
use App\Models\MailSetting;
use App\Services\DynamicMailConfigService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Mail;

class MailSettingResource extends Resource
{
    protected static ?string $model = MailSetting::class;

    protected static ?string $navigationIcon = 'heroicon-o-server-stack';

    protected static ?string $navigationLabel = 'SMTP Ayarları';

    protected static ?string $modelLabel = 'SMTP Ayarı';

    protected static ?string $pluralModelLabel = 'SMTP Ayarları';

    protected static ?string $navigationGroup = 'Mailing';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Genel')
                ->schema([
                    Forms\Components\TextInput::make('name')->required(),
                    Forms\Components\Toggle::make('is_enabled')->label('Aktif')->default(true),
                    Forms\Components\Select::make('mailer')
                        ->options(['smtp' => 'SMTP'])
                        ->default('smtp')
                        ->required(),
                ])->columns(3),
            Forms\Components\Section::make('Sunucu')
                ->schema([
                    Forms\Components\TextInput::make('host')->required(),
                    Forms\Components\TextInput::make('port')->numeric()->default(587)->required(),
                    Forms\Components\Select::make('encryption')
                        ->options(['tls' => 'TLS', 'ssl' => 'SSL', '' => 'Yok'])
                        ->default('tls'),
                    Forms\Components\TextInput::make('username'),
                    Forms\Components\TextInput::make('password')->password()->revealable(),
                ])->columns(2),
            Forms\Components\Section::make('Gönderen')
                ->schema([
                    Forms\Components\TextInput::make('from_address')->email()->required(),
                    Forms\Components\TextInput::make('from_name')->required(),
                    Forms\Components\TextInput::make('reply_to_address')->email(),
                    Forms\Components\TextInput::make('reply_to_name'),
                ])->columns(2),
            Forms\Components\Section::make('İzleme ve Limit')
                ->schema([
                    Forms\Components\Toggle::make('track_opens')->label('Açılma takibi')->default(true),
                    Forms\Components\Toggle::make('track_clicks')->label('Tıklama takibi')->default(true),
                    Forms\Components\TextInput::make('daily_quota')->numeric(),
                    Forms\Components\KeyValue::make('metadata')->label('Ek Ayarlar'),
                ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('host')->searchable(),
                Tables\Columns\TextColumn::make('from_address')->label('Gönderen')->copyable(),
                Tables\Columns\IconColumn::make('is_enabled')->boolean()->label('Aktif'),
                Tables\Columns\IconColumn::make('track_opens')->boolean()->label('Open'),
                Tables\Columns\IconColumn::make('track_clicks')->boolean()->label('Click'),
                Tables\Columns\TextColumn::make('updated_at')->dateTime('d.m.Y H:i')->label('Güncellendi'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('test_connection')
                    ->label('Test Maili')
                    ->icon('heroicon-o-paper-airplane')
                    ->form([
                        Forms\Components\TextInput::make('email')
                            ->label('Test Alıcı E-postası')
                            ->email()
                            ->required(),
                    ])
                    ->action(function (MailSetting $record, array $data) {
                        app(DynamicMailConfigService::class)->apply();

                        Mail::html('<h2>SMTP Test Başarılı</h2><p>Bu e-posta kontrol panelinden gönderildi.</p>', function ($message) use ($data) {
                            $message->to($data['email'])->subject('LioX SMTP Test');
                        });

                        Notification::make()->title('Test e-postası gönderildi')->success()->send();
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMailSettings::route('/'),
            'create' => Pages\CreateMailSetting::route('/create'),
            'edit' => Pages\EditMailSetting::route('/{record}/edit'),
        ];
    }
}
