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
        $rules = [
            'barang_id' => 'required|exists:barangs,id',
            'quantity' => 'required|integer|min:1',
            'type' => 'required|in:Penjualan,Pembelian',
            'date_transaction' => 'required|date|after_or_equal:2000-01-01'
        ];

        // Jika type = Pembelian, maka salesman_id wajib dan harus valid
        if ($this->input('type') === 'Pembelian') {
            $rules['unit_price'] = 'required|numeric|min:1';
            $rules['salesman'] = 'required|exists:sales,id';
        }

        return $rules;
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
            'type.required' => 'Tipe transaksi wajib dipilih.',
            'type.in' => 'Tipe transaksi harus berupa Penjualan atau Pembelian.',
            'salesman_id.required' => 'Salesman wajib dipilih untuk pembelian.',
            'salesman_id.exists' => 'Salesman yang dipilih tidak ditemukan.',
            'date_transaction.required' => 'Tanggal ' . $this->input('type') . ' wajib diisi.',
            'date_transaction.after_or_equal' => 'Tanggal ' . $this->input('type') . ' tidak boleh sebelum tahun 2000.',
        ];
    }
}
