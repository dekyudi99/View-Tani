<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Frontpage/Dashboard');
    }
    public function device()
    {
        return Inertia::render('Frontpage/Device');
    }
    public function history()
    {
        return Inertia::render('Frontpage/History');
    }
    public function report()
    {
        return Inertia::render('Frontpage/Report');
    }
}
