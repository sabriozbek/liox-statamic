<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AutomationRuleResource\Pages;
use App\Models\AutomationRule;
use App\Models\MailTemplate;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AutomationRuleResource extends Resource
{
    protected static ?string $model = AutomationRule::class;

    protected static ?string $navigationIcon = 'heroicon-o-bolt';

    protected static ?string $navigationLabel = 'Otomasyon Kuralları';

    protected static ?string $modelLabel = 'Otomasyon Kuralı';

    protected static ?string $pluralModelLabel = 'Otomasyon Kuralları';

    protected static ?string $navigationGroup = 'Mailing';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Kural')
                ->schema([
                    Forms\Components\TextInput::make('name')->required(),
                    Forms\Components\Textarea::make('description'),
                    Forms\Components\Select::make('trigger')
                        ->options([
                            AutomationRule::TRIGGER_FORM_SUBMITTED => 'Form gönderildi',
                            AutomationRule::TRIGGER_EVENT_REGISTRATION_CREATED => 'Etkinlik kaydı geldi',
                            AutomationRule::TRIGGER_APPOINTMENT_CREATED => 'Randevu oluşturuldu',
                            AutomationRule::TRIGGER_ASSESSMENT_CREATED => 'İhtiyaç analizi oluşturuldu',
                            AutomationRule::TRIGGER_LEAD_CREATED => 'Lead oluşturuldu',
                        ])->required(),
                    Forms\Components\TextInput::make('form_handle')->label('Form Handle'),
                    Forms\Components\Select::make('template_id')
                        ->label('Mail Şablonu')
                        ->options(MailTemplate::query()->pluck('name', 'id'))
                        ->searchable()
                        ->required(),
                    Forms\Components\Toggle::make('is_active')->label('Aktif')->default(true),
                ])->columns(2),
            Forms\Components\Section::make('Alıcı ve Koşullar')
                ->schema([
                    Forms\Components\Select::make('send_to')
                        ->options([
                            'submitter' => 'Formu gönderen',
                            'field' => 'Belirli alan',
                            'custom' => 'Sabit adres',
                        ])->default('submitter')->required(),
                    Forms\Components\TextInput::make('recipient_field')->default('email'),
                    Forms\Components\TextInput::make('cc'),
                    Forms\Components\TextInput::make('bcc'),
                    Forms\Components\TextInput::make('delay_minutes')->numeric()->default(0),
                    Forms\Components\TextInput::make('priority')->numeric()->default(100),
                    Forms\Components\Toggle::make('stop_on_match')->default(false),
                    Forms\Components\KeyValue::make('settings')->label('İleri Ayarlar')->helperText('custom_recipient, custom_name, campaign_tag, reminder_hours gibi değerler eklenebilir.'),
                    Forms\Components\Repeater::make('conditions')
                        ->schema([
                            Forms\Components\TextInput::make('field')->required(),
                            Forms\Components\Select::make('operator')
                                ->options([
                                    'equals' => 'Eşittir',
                                    'not_equals' => 'Eşit değil',
                                    'contains' => 'İçerir',
                                    'in' => 'Listede var',
                                ])->default('equals')->required(),
                            Forms\Components\TextInput::make('value')->required(),
                        ])->columns(3),
                ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('priority', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')->searchable(),
                Tables\Columns\TextColumn::make('trigger')->label('Tetikleyici'),
                Tables\Columns\TextColumn::make('form_handle')->label('Form')->placeholder('-'),
                Tables\Columns\TextColumn::make('template.name')->label('Şablon')->placeholder('-'),
                Tables\Columns\TextColumn::make('priority')->sortable(),
                Tables\Columns\IconColumn::make('is_active')->boolean()->label('Aktif'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('toggle')
                    ->label(fn (AutomationRule $record) => $record->is_active ? 'Pasifleştir' : 'Aktifleştir')
                    ->icon('heroicon-o-power')
                    ->action(function (AutomationRule $record) {
                        $record->update(['is_active' => ! $record->is_active]);
                        Notification::make()->title('Kural durumu güncellendi')->success()->send();
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAutomationRules::route('/'),
            'create' => Pages\CreateAutomationRule::route('/create'),
            'edit' => Pages\EditAutomationRule::route('/{record}/edit'),
        ];
    }
}
