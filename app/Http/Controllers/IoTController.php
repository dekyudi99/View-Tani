<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Carbon\Carbon;

class IoTController extends Controller
{
    public string $username;
    public string $aioKey;

    public function __construct()
    {
        $this->username = env('ADAFRUIT_IO_USERNAME');
        $this->aioKey = env('ADAFRUIT_IO_KEY');
    }

    public function dashboard()
    {
        $headers = $this->getHeaders();

        $suhuData = array_reverse(Http::withHeaders($headers)
            ->get("https://io.adafruit.com/api/v2/{$this->username}/feeds/suhu/data?limit=7")
            ->json());

        $kelembapanData = array_reverse(Http::withHeaders($headers)
            ->get("https://io.adafruit.com/api/v2/{$this->username}/feeds/kelembapan/data?limit=7")
            ->json());

        $latestSuhu = end($suhuData)['value'] ?? null;
        $latestKelembapan = end($kelembapanData)['value'] ?? null;

        $labels = array_map(fn($d) =>
            Carbon::parse($d['created_at'])
                ->setTimezone('Asia/Makassar')
                ->format('H:i'),
            $suhuData
        );

        $suhu = array_map(fn($d) => (float) $d['value'], $suhuData);
        $kelembapan = array_map(fn($d) => (float) $d['value'], $kelembapanData);

        return Inertia::render('Frontpage/Dashboard', [
            'latest' => [
                'suhu' => $latestSuhu,
                'kelembapan' => $latestKelembapan,
            ],
            'chart' => [
                'labels' => $labels,
                'suhu' => $suhu,
                'kelembapan' => $kelembapan,
            ],
        ]);
    }

    public function toggle(Request $request)
    {
        $lampu = $request->lampu;
        $status = $request->status ? '1' : '0';

        $feedName = match ($lampu) {
            'merah' => 'led-merah',
            'kuning' => 'led-kuning',
            'hijau' => 'led-hijau',
            default => null
        };

        if (!$feedName) {
            return response()->json(['error' => 'Lampu tidak valid'], 400);
        }

        $this->sendToFeed($feedName, $status);
        return response()->json(['success' => true]);
    }

    public function sendRestart()
    {
        $this->sendToFeed('restart', '1');
        return response()->json(['message' => 'Restart command sent']);
    }

    private function sendToFeed(string $feedName, string $value)
    {
        Http::withHeaders($this->getHeaders(true))
            ->post("https://io.adafruit.com/api/v2/{$this->username}/feeds/{$feedName}/data", [
                'value' => $value,
            ]);
    }

    private function getHeaders(bool $json = false): array
    {
        $headers = ['X-AIO-Key' => $this->aioKey];
        if ($json) {
            $headers['Content-Type'] = 'application/json';
        }
        return $headers;
    }
}