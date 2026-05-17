<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'tel' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'preferred_date' => 'required|date|after_or_equal:today',
            'preferred_time' => 'nullable|string|max:50',
            'sector' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:2000',
            'path' => 'nullable|string|max:500',
            'variant_id' => 'nullable|string|max:100',
            'utm_source' => 'nullable|string|max:255',
            'utm_medium' => 'nullable|string|max:255',
            'utm_campaign' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Ad Soyad alanı zorunludur.',
            'email.required' => 'E-posta adresi zorunludur.',
            'email.email' => 'Geçerli bir e-posta adresi giriniz.',
            'preferred_date.required' => 'Tercih ettiğiniz tarih zorunludur.',
            'preferred_date.after_or_equal' => 'Lütfen bugünün tarihinden ileri bir tarih seçiniz.',
        ];
    }
}
