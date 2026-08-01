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
        Schema::create('lokasis', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->string('alamat');
            $table->string('telepon')->nullable();
            $table->string('email')->nullable();
            $table->text('deskripsi')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamps();
        });

        Schema::create('jam_buka', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lokasi_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('hari');
            $table->enum('shif', ['pagi', 'siang', 'malam']);
            $table->enum('mode', ['custom', 'closed'])->default('custom');
            $table->time('jam_buka')->nullable();
            $table->time('jam_tutup')->nullable();
            $table->timestamps();

            $table->unique(['lokasi_id', 'hari', 'shif']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jam_buka');
        Schema::dropIfExists('lokasis');
    }
};
