<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBarangRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:barangs,name'],
            'kategori_barang_id' => ['required', 'exists:kategori_barangs,id'],
            'unit' => ['required', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'name.unique' => 'Nama produk tidak boleh duplikat',
            'kategori_barang_id.required' => 'Kategori produk wajib diisi.',
            'kategori_barang_id.exists' => 'Kategori tidak ditemukan.',
            'unit.required' => 'Satuan produk wajib diisi.',
        ];
    }
}
