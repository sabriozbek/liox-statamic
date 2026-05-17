@php
    $logs = \App\Models\MailLog::query()->with('template')->latest()->limit(100)->get();
@endphp

<div class="card p-0">
    <div class="flex items-center justify-between px-6 py-4 border-b">
        <div>
            <h1 class="text-lg font-bold">Mail Kayıtları</h1>
            <p class="text-sm text-gray-600">Kime ne gittiğini, açılma ve tıklanma durumlarını izleyin.</p>
        </div>
        <a href="{{ url('/admin/mail-logs') }}" class="btn-primary">Detaylı Log Yönetimini Aç</a>
    </div>

    <div class="p-6">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th>Tarih</th>
                    <th>Alıcı</th>
                    <th>Konu</th>
                    <th>Şablon</th>
                    <th>Durum</th>
                    <th>Açılma</th>
                    <th>Tıklama</th>
                </tr>
            </thead>
            <tbody>
                @forelse($logs as $log)
                    <tr>
                        <td>{{ optional($log->created_at)->format('d.m.Y H:i') }}</td>
                        <td>{{ $log->recipient_email }}</td>
                        <td>{{ $log->subject }}</td>
                        <td>{{ $log->template?->name ?: '-' }}</td>
                        <td>{{ $log->status }}</td>
                        <td>{{ $log->opens_count }}</td>
                        <td>{{ $log->clicks_count }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7">Mail kaydı bulunamadı.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
