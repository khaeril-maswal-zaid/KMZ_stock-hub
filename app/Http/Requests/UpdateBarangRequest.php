<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBarangRequest extends FormRequest
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
            // 'code' => ['required', 'string', 'max:50', 'unique:barangs,code'],
            'name' => ['required', 'string', 'max:255'],
            'kategori_barang_id' => ['required', 'exists:kategori_barangs,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            // 'code.required' => 'Kode produk wajib diisi.',
            // 'code.unique' => 'Kode produk sudah digunakan.',
            'name.required' => 'Nama produk wajib diisi.',
            'kategori_barang_id.required' => 'Kategori produk wajib diisi.',
            'kategori_barang_id.exists' => 'Kategori tidak ditemukan.',
            'price.numeric' => 'Harga harus berupa angka.',
            'unit.required' => 'Satuan produk wajib diisi.',
        ];
    }
}
