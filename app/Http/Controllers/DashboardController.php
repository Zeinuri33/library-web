<?php

namespace App\Http\Controllers;

use App\Models\Tentang;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalUsers' => User::count(),
        ];

        return Inertia::render('dashboard', $stats);
    }

    public function welcome()
    {
        $tentangs = Tentang::select('nama', 'slug')->get();

        return Inertia::render('welcome', [
            'tentangs' => $tentangs,
        ]);
    }
}
