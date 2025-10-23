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
        Schema::create('barangs', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->foreignId('kategori_barang_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('sales_id')->nullable()->constrained()->nullOnDelete();
            $table->decimal('price', 15, 2)->default(0);
            $table->integer('quantity')->default(0);
            $table->string('unit', 50);
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barangs');
    }
};
