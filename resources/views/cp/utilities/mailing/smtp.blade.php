@php
    $settings = \App\Models\MailSetting::query()->orderByDesc('id')->get();
@endphp

<div class="card p-0">
    <div class="flex items-center justify-between px-6 py-4 border-b">
        <div>
            <h1 class="text-lg font-bold">SMTP Ayarları</h1>
            <p class="text-sm text-gray-600">SMTP profillerini yönetin ve aktif profili kontrol edin.</p>
        </div>
        <a href="{{ url('/admin/mail-settings') }}" class="btn-primary">SMTP Yönetimine Git</a>
    </div>

    <div class="p-6">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th>Profil</th>
                    <th>Host</th>
                    <th>Gönderen</th>
                    <th>Tracking</th>
                    <th>Durum</th>
                </tr>
            </thead>
            <tbody>
                @forelse($settings as $setting)
                    <tr>
                        <td>{{ $setting->name }}</td>
                        <td>{{ $setting->host ?: '-' }}</td>
                        <td>{{ $setting->from_address ?: '-' }}</td>
                        <td>{{ $setting->track_opens ? 'Open' : '-' }} {{ $setting->track_clicks ? '/ Click' : '' }}</td>
                        <td>{{ $setting->is_enabled ? 'Aktif' : 'Pasif' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">SMTP profili bulunamadı.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
