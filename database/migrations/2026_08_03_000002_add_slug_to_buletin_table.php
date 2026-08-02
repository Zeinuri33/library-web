<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('buletin', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('edisi');
        });

        // Backfill slug dari kolom edisi (dipastikan unik)
        $used = [];

        foreach (DB::table('buletin')->orderBy('id')->get() as $row) {
            $base = Str::slug($row->edisi) ?: 'buletin-'.$row->id;
            $slug = $base;
            $i = 2;

            while (isset($used[$slug]) || DB::table('buletin')->where('slug', $slug)->exists()) {
                $slug = $base.'-'.$i++;
            }

            $used[$slug] = true;

            DB::table('buletin')
                ->where('id', $row->id)
                ->update(['slug' => $slug]);
        }

        Schema::table('buletin', function (Blueprint $table) {
            $table->unique('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('buletin', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn('slug');
        });
    }
};
