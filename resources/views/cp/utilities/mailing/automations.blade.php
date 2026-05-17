@php
    $rules = \App\Models\AutomationRule::query()->with('template')->orderByDesc('priority')->get();
@endphp

<div class="card p-0">
    <div class="flex items-center justify-between px-6 py-4 border-b">
        <div>
            <h1 class="text-lg font-bold">Mail Otomasyonları</h1>
            <p class="text-sm text-gray-600">Tetikleyici, hedefleme ve aktif kuralları izleyin.</p>
        </div>
        <a href="{{ url('/admin/automation-rules') }}" class="btn-primary">Otomasyon Yönetimini Aç</a>
    </div>

    <div class="p-6">
        <table class="data-table w-full">
            <thead>
                <tr>
                    <th>Kural</th>
                    <th>Tetikleyici</th>
                    <th>Form</th>
                    <th>Şablon</th>
                    <th>Öncelik</th>
                    <th>Durum</th>
                </tr>
            </thead>
            <tbody>
                @forelse($rules as $rule)
                    <tr>
                        <td>{{ $rule->name }}</td>
                        <td>{{ $rule->trigger }}</td>
                        <td>{{ $rule->form_handle ?: '-' }}</td>
                        <td>{{ $rule->template?->name ?: '-' }}</td>
                        <td>{{ $rule->priority }}</td>
                        <td>{{ $rule->is_active ? 'Aktif' : 'Pasif' }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6">Otomasyon bulunamadı.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>
</div>
