<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransaksiRequest extends FormRequest
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
            'barang_id' => 'required|exists:barangs,code',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:1',
            'type' => 'required|in:Penjualan,Pembelian',
        ];
    }

    public function messages(): array
    {
        return [
            'barang_id.required' => 'Barang wajib dipilih.',
            'barang_id.exists' => 'Barang yang dipilih tidak ditemukan.',
            'quantity.required' => 'Jumlah barang wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka bulat.',
            'quantity.min' => 'Jumlah minimal 1.',
            'unit_price.required' => 'Harga satuan wajib diisi.',
            'unit_price.numeric' => 'Harga satuan harus berupa angka.',
        ];
    }
}
