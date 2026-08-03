<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lokasis', function (Blueprint $table) {
            $table->boolean('is_utama')->default(false)->after('deskripsi');
        });

        // Pertahankan perilaku lama: lokasi pertama (diinput paling awal) menjadi lokasi utama.
        $pertama = DB::table('lokasis')->orderBy('created_at')->orderBy('id')->first();

        if ($pertama) {
            DB::table('lokasis')->where('id', $pertama->id)->update(['is_utama' => true]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lokasis', function (Blueprint $table) {
            $table->dropColumn('is_utama');
        });
    }
};
