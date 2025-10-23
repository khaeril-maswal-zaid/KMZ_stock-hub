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
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:50', 'unique:products,code'],
            'name' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'uuid', 'exists:categories,id'],
            'salesman_id' => ['nullable', 'uuid', 'exists:salesmen,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode produk wajib diisi.',
            'code.unique' => 'Kode produk sudah digunakan.',
            'name.required' => 'Nama produk wajib diisi.',
            'category_id.required' => 'Kategori produk wajib diisi.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
            'salesman_id.exists' => 'Salesman tidak ditemukan.',
            'price.numeric' => 'Harga harus berupa angka.',
            'quantity.integer' => 'Jumlah harus berupa angka bulat.',
            'unit.required' => 'Satuan produk wajib diisi.',
        ];
    }
}
