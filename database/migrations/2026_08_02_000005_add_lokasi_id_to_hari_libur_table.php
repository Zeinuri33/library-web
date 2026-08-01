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
        Schema::table('hari_libur', function (Blueprint $table) {
            $table->foreignId('lokasi_id')
                ->nullable()
                ->after('tanggal')
                ->constrained('lokasis')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hari_libur', function (Blueprint $table) {
            $table->dropConstrainedForeignId('lokasi_id');
        });
    }
};
