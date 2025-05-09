<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Carbon\Carbon;

class IoTController extends Controller
{
    public string $username;
    public string $aioKey;

    public function __construct()
    {
        $this->username = env('ADAFRUIT_IO_USERNAME', 'dekyudi99');
        $this->aioKey = env('ADAFRUIT_IO_KEY', 'default_key');
    }

    /**
     * Dashboard utama
     */
    public function dashboard()
    {
        $headers = $this->getHeaders();

        // Ambil 7 data terakhir (terbaru di awal array)
        $suhuData = array_reverse(Http::withHeaders($headers)
            ->get("https://io.adafruit.com/api/v2/{$this->username}/feeds/suhu/data?limit=7")
            ->json());

        $kelembapanData = array_reverse(Http::withHeaders($headers)
            ->get("https://io.adafruit.com/api/v2/{$this->username}/feeds/kelembapan/data?limit=7")
            ->json());

        // Ambil data terakhir
        $latestSuhu = end($suhuData)['value'] ?? null;
        $latestKelembapan = end($kelembapanData)['value'] ?? null;

        // Format label chart berdasarkan waktu data
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

    /**
     * Endpoint polling data terbaru (dipakai oleh polling React)
     */
    public function getLatest()
    {
        $headers = $this->getHeaders();

        $suhu = Http::withHeaders($headers)
            ->get("https://io.adafruit.com/api/v2/{$this->username}/feeds/suhu/data?limit=1")
            ->json()[0]['value'] ?? null;

        $kelembapan = Http::withHeaders($headers)
            ->get("https://io.adafruit.com/api/v2/{$this->username}/feeds/kelembapan/data?limit=1")
            ->json()[0]['value'] ?? null;

        return response()->json([
            'suhu' => $suhu,
            'kelembapan' => $kelembapan,
        ]);
    }

    /**
     * Kontrol lampu hijau
     */
    public function lampuHijau()
    {
        $this->matiSemuaLampu();
        $this->sendToFeed('led-hijau', '1');
    }

    /**
     * Kontrol lampu kuning
     */
    public function lampuKuning()
    {
        $this->matiSemuaLampu();
        $this->sendToFeed('led-kuning', '1');
    }

    /**
     * Kontrol lampu merah
     */
    public function lampuMerah()
    {
        $this->matiSemuaLampu();
        $this->sendToFeed('led-merah', '1');
    }

    /**
     * Matikan semua lampu
     */
    public function matiSemuaLampu()
    {
        $this->sendToFeed('led-hijau', '0');
        $this->sendToFeed('led-kuning', '0');
        $this->sendToFeed('led-merah', '0');
    }

    /**
     * Kirim sinyal restart ke ESP32
     */
    public function sendRestart()
    {
        $this->sendToFeed('restart', '1');
    }

    /**
     * Kirim data ke feed tertentu
     */
    private function sendToFeed(string $feedName, string $value)
    {
        Http::withHeaders($this->getHeaders(true))
            ->post("https://io.adafruit.com/api/v2/{$this->username}/feeds/{$feedName}/data", [
                'value' => $value,
            ]);
    }

    /**
     * Header API Adafruit
     */
    private function getHeaders(bool $json = false): array
    {
        $headers = ['X-AIO-Key' => $this->aioKey];

        if ($json) {
            $headers['Content-Type'] = 'application/json';
        }

        return $headers;
    }
}