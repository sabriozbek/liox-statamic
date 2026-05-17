<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MailTemplateResource\Pages;
use App\Models\MailTemplate;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Actions\Action;
use Filament\Notifications\Notification;

class MailTemplateResource extends Resource
{
    protected static ?string $model = MailTemplate::class;
    protected static ?string $navigationIcon = 'heroicon-o-envelope';
    protected static ?string $navigationLabel = 'E-posta Şablonları';
    protected static ?string $modelLabel = 'E-posta Şablonu';
    protected static ?string $pluralModelLabel = 'E-posta Şablonları';
    protected static ?string $navigationGroup = 'Mailing';
    protected static ?int $navigationSort = 4;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Temel Bilgiler')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Şablon Adı')
                            ->required(),
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug')
                            ->unique('mail_templates', 'slug', ignoreRecord: true)
                            ->required(),
                        Forms\Components\Select::make('type')
                            ->label('Tür')
                            ->options([
                                'lead' => 'Lead',
                                'assessment' => 'İhtiyaç Analizi',
                                'appointment' => 'Randevu',
                                'event' => 'Etkinlik',
                                'event_reminder' => 'Etkinlik Hatırlatma',
                                'event_registration' => 'Etkinlik Kayıt',
                                'popup' => 'Popup',
                                'newsletter' => 'Bülten',
                                'welcome' => 'Hoşgeldin',
                                'followup' => 'Takip',
                            ])
                            ->required(),
                        Forms\Components\Toggle::make('is_active')
                            ->label('Aktif')
                            ->default(true),
                    ])->columns(2),

                Forms\Components\Section::make('E-posta İçeriği')
                    ->schema([
                        Forms\Components\TextInput::make('subject')
                            ->label('Konu')
                            ->required(),
                        Forms\Components\Textarea::make('content')
                            ->label('İçerik (HTML)')
                            ->rows(15)
                            ->required(),
                        Forms\Components\TextInput::make('metadata.preview_text')
                            ->label('Preview Text'),
                        Forms\Components\TextInput::make('metadata.category')
                            ->label('Kategori'),
                        Forms\Components\KeyValue::make('metadata')
                            ->label('Şablon Ayarları')
                            ->helperText('preview_text, category, tags gibi ek alanlar eklenebilir.'),
                    ]),

                Forms\Components\Section::make('Değişkenler')
                    ->description('Kullanılabilir değişkenler: {{ name }}, {{ company }}, {{ email }}, {{ preferred_date }}, {{ event_title }}, {{ event_slug }}, {{ tel }}, {{ notes }}')
                    ->schema([
                        Forms\Components\TagsInput::make('variables')
                            ->label('Değişkenler')
                            ->helperText('Her değişkeni Enter ile ekleyin'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->defaultSort('name')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Ad')
                    ->searchable(),
                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug'),
                Tables\Columns\TextColumn::make('subject')
                    ->label('Konu')
                    ->limit(50),
                Tables\Columns\BadgeColumn::make('type')
                    ->label('Tür')
                    ->colors(['info']),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Aktif')
                    ->boolean(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Güncellendi')
                    ->dateTime('d.m.Y'),
            ])
            ->filters([
                SelectFilter::make('type')->label('Tür'),
                SelectFilter::make('is_active')->label('Durum'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Action::make('preview')
                    ->label('Önizle')
                    ->icon('heroicon-m-eye')
                    ->action(function (MailTemplate $record) {
                        Notification::make()
                            ->title('HTML içeriği kayıt üzerinde düzenlenebilir. Gerekirse özel preview sayfası eklenebilir.')
                            ->info()
                            ->send();
                    }),
            ])
            ->headerActions([
                Action::make('create_default')
                    ->label('Varsayılan Şablon Oluştur')
                    ->action(function () {
                        $templates = [
                            [
                                'name' => 'Hoşgeldin Lead',
                                'slug' => 'welcome-lead',
                                'subject' => 'LioXERP\'e Hoşgeldiniz, {{ name }}',
                                'content' => '<h1>Merhaba {{ name }}</h1><p>LioXERP ailesine hoş geldiniz. Ekibimiz kısa süre içinde sizinle iletişime geçecektir.</p>',
                                'type' => 'welcome',
                                'variables' => ['name', 'company', 'email'],
                            ],
                            [
                                'name' => 'Etkinlik Kayıt Onayı',
                                'slug' => 'event-registration-welcome',
                                'subject' => '{{ event_title }} kaydınız alındı',
                                'content' => '<h1>Merhaba {{ name }}</h1><p>{{ event_title }} etkinliği için kaydınız başarıyla alındı.</p>',
                                'type' => 'event_registration',
                                'variables' => ['name', 'email', 'event_title', 'event_slug', 'company'],
                            ],
                            [
                                'name' => 'Etkinlik Hatırlatma',
                                'slug' => 'event-reminder',
                                'subject' => 'Hatırlatma: {{ event_title }}',
                                'content' => '<h1>{{ event_title }}</h1><p>Merhaba {{ name }}, etkinlik başlangıcı yaklaşmaktadır.</p>',
                                'type' => 'event_reminder',
                                'variables' => ['name', 'email', 'event_title', 'event_slug'],
                            ],
                            [
                                'name' => 'Randevu Onayı',
                                'slug' => 'appointment-confirmation',
                                'subject' => 'Randevu talebiniz alındı',
                                'content' => '<p>Merhaba {{ name }}, {{ preferred_date }} {{ preferred_time }} için talebiniz alındı.</p>',
                                'type' => 'appointment',
                                'variables' => ['name', 'email', 'preferred_date', 'preferred_time'],
                            ],
                            [
                                'name' => 'İhtiyaç Analizi Onayı',
                                'slug' => 'assessment-confirmation',
                                'subject' => 'İhtiyaç analizi formunuz alındı',
                                'content' => '<p>Merhaba {{ name }}, ihtiyaç analizi formunuz için teşekkür ederiz.</p>',
                                'type' => 'assessment',
                                'variables' => ['name', 'email', 'company'],
                            ],
                        ];

                        foreach ($templates as $template) {
                            \App\Models\MailTemplate::query()->updateOrCreate(
                                ['slug' => $template['slug']],
                                array_merge($template, ['is_active' => true])
                            );
                        }

                        Notification::make()->title('Varsayılan şablonlar oluşturuldu')->success()->send();
                    }),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMailTemplates::route('/'),
            'create' => Pages\CreateMailTemplate::route('/create'),
            'edit' => Pages\EditMailTemplate::route('/{record}/edit'),
        ];
    }
}
