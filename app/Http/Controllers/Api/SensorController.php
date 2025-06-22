<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sensor;

class SensorController extends Controller
{
    public function index()
    {
        return Sensor::latest()->take(10)->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'temperature' => 'required|numeric',
            'humidity' => 'required|numeric'
        ]);

        $sensor = Sensor::create($data);
        return response()->json(['message' => 'Data berhasil disimpan', 'data' => $sensor], 201);
    }
}