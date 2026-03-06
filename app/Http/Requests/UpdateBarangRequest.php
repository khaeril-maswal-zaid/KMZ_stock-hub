<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBarangRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('barangs', 'name')->ignore($this->barang)
            ],
            'kategori_barang_id' => ['required', 'exists:kategori_barangs,id'],
            'unit' => ['required', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'kategori_barang_id.required' => 'Kategori produk wajib diisi.',
            'kategori_barang_id.exists' => 'Kategori tidak ditemukan.',
            'name.unique' => 'Nama produk tidak boleh duplikat',
            'unit.required' => 'Satuan produk wajib diisi.',
        ];
    }
}
