@php
    $templates = \App\Models\MailTemplate::query()->orderBy('name')->get();
@endphp

<div class="card p-0">
    <div class="flex items-center justify-between px-6 py-4 border-b">
        <div>
            <h1 class="text-lg font-bold">E-posta Şablonları</h1>
            <p class="text-sm text-gray-600">Şablon yönetimi için Filament ekranına hızlı erişim.</p>
        </div>
        <a href="{{ url('/admin/mail-templates') }}" class="btn-primary">Yönetim Ekranını Aç</a>
    </div>

    <div class="p-6">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th>Ad</th>
                    <th>Slug</th>
                    <th>Tür</th>
                    <th>Durum</th>
                </tr>
            </thead>
            <tbody>
                @forelse($templates as $template)
                    <tr>
                        <td>{{ $template->name }}</td>
                        <td>{{ $template->slug }}</td>
                        <td>{{ $template->type }}</td>
                        <td>{{ $template->is_active ? 'Aktif' : 'Pasif' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4">Şablon bulunamadı. <a href="{{ url('/admin/mail-templates') }}">Şablon oluştur</a></td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
