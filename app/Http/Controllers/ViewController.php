<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewController extends Controller
{
    public function index()
    {
        return Inertia::render('frontpage/Ujicoba');
    }
}
