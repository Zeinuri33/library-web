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
        Schema::table('layanan', function (Blueprint $table) {
            $table->unsignedBigInteger('jenis_layanan_id')
                ->nullable()
                ->after('deskripsi');

            $table->foreign('jenis_layanan_id', 'layanan_jenis_layanan_fk')
                ->references('id')
                ->on('jenis_layanan')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('layanan', function (Blueprint $table) {
            $table->dropForeign('layanan_jenis_layanan_fk');
            $table->dropColumn('jenis_layanan_id');
        });
    }
};
