<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transaksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barang_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->enum('type', ['Pembelian', 'Penjualan']);
            $table->foreignId('sales_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('unit_price', 15, 2)->nullable();
            $table->integer('total_price')->nullable();
            $table->date('date_transaction');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksis');
    }
};
