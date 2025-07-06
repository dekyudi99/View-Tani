<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use InfluxDB2\Client;
use PhpMqtt\Client\MqttClient;

class IoTController extends Controller
{
    public function index(Request $request)
    {
        // 1. Validasi input & Konfigurasi InfluxDB (tetap sama)
        $allowedChartTypes = ['temperature', 'humidity', 'soil_moisture'];
        $chartType = $request->input('chart', 'temperature');
        if (!in_array($chartType, $allowedChartTypes)) {
            $chartType = 'temperature';
        }
        $config = [
            "url" => env('INFLUXDB_URL'),
            "token" => env('INFLUXDB_TOKEN'),
            "bucket" => env('INFLUXDB_BUCKET'),
            "org" => env('INFLUXDB_ORG'),
        ];
        $client = new Client($config);
        $queryApi = $client->createQueryApi();

        // 2. Ambil Statistik Terkini (tetap sama)
        $currentStats = [];
        foreach ($allowedChartTypes as $field) {
            $query = 'from(bucket: "' . env('INFLUXDB_BUCKET') . '") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "mqtt_consumer" and r._field == "' . $field . '") |> last()';
            try {
                $tables = $queryApi->query($query);
                $currentStats[$field] = (isset($tables[0]->records[0])) ? $tables[0]->records[0]->getValue() : null;
            } catch (\Exception $e) {
                $currentStats[$field] = null;
            }
        }

        // --- 3. PERBAIKAN: Ambil Status Indikator Terakhir ---
        try {
            // Ambil Status Solenoid (logika tetap sama)
            $solenoidQuery = 'from(bucket: "' . env('INFLUXDB_BUCKET') . '") |> range(start: -1d) |> filter(fn: (r) => r._measurement == "mqtt_consumer" and r._field == "solenoid_status") |> last()';
            $solenoidTable = $queryApi->query($solenoidQuery);
            $solenoidStatus = (isset($solenoidTable[0]->records[0])) ? $solenoidTable[0]->records[0]->getValue() : false;

            // Ambil Status Lampu Indikator dengan query yang lebih andal
            $lightQuery = 'from(bucket: "' . env('INFLUXDB_BUCKET') . '")
              |> range(start: -1d)
              |> filter(fn: (r) => r._measurement == "mqtt_consumer")
              |> last()'; // Cukup ambil seluruh record terakhir
            
            $lightTable = $queryApi->query($lightQuery);
            $lightStatus = 'unknown'; // Default value
            
            // Cek di PHP apakah record dan kuncinya ada
            if (isset($lightTable[0]->records[0])) {
                $lastRecord = $lightTable[0]->records[0];
                if (isset($lastRecord['indicator_light'])) {
                    $lightStatus = $lastRecord['indicator_light'];
                }
            }
        } catch (\Exception $e) {
            $solenoidStatus = false;
            $lightStatus = 'unknown';
        }
        // --- AKHIR PERBAIKAN ---

        // 4. Ambil Riwayat Data untuk Grafik (tetap sama)
        $historyQuery = 'from(bucket: "' . env('INFLUXDB_BUCKET') . '") |> range(start: -1h) |> filter(fn: (r) => r._measurement == "mqtt_consumer" and r._field == "' . $chartType . '") |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)';
        $chartHistory = [];
        try {
            $tables = $queryApi->query($historyQuery);
            foreach ($tables as $table) {
                foreach ($table->records as $record) {
                    $chartHistory[] = ['time' => $record->getTime(), 'value' => $record->getValue()];
                }
            }
        } catch (\Exception $e) {
            $chartHistory = [];
        }

        // 5. Kirim Semua Data ke Frontend
        return Inertia::render('Frontpage/Dashboard', [
            'currentStats' => $currentStats,
            'chartHistory' => $chartHistory,
            'activeChart' => $chartType,
            'solenoidStatus' => $solenoidStatus,
            'lightStatus' => $lightStatus,
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : (object)[],
        ]);
    }

    /**
     * Send control command to the device via MQTT.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendControl(Request $request)
    {
        $request->validate([
            'command' => 'required|string|in:solenoid',
            'state' => 'required|boolean',
            'device_id' => 'required|string',
        ]);

        try {
            $mqtt = new MqttClient(env('MQTT_HOST'), env('MQTT_PORT'), 'laravel-client-' . uniqid());
            $mqtt->connect();
            $topic = 'esp32/control/' . $request->device_id;
            $payload = json_encode(['command' => $request->command, 'state' => $request->state]);
            $mqtt->publish($topic, $payload, 0);
            $mqtt->disconnect();
            return back(); 
        } catch (\Exception $e) {
            return back()->withErrors(['mqtt_error' => 'Gagal mengirim perintah. Periksa koneksi MQTT.']);
        }
    }

    /**
     * Set the control mode for the IoT device.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function setMode(Request $request)
    {
        // 1. Validasi request dari frontend
        $request->validate([
            'mode' => 'required|string|in:auto,manual',
            'device_id' => 'required|string',
        ]);

        try {
            // 2. Koneksi ke Broker MQTT
            $mqtt = new MqttClient(env('MQTT_HOST'), env('MQTT_PORT'), 'laravel-client-mode-' . uniqid());
            $mqtt->connect();

            // 3. Buat topik dan payload (pesan)
            $topic = 'esp32/control/' . $request->device_id;
            $payload = json_encode([
                'command' => 'mode', 
                'mode' => $request->mode // 'auto' atau 'manual'
            ]);

            // 4. Kirim (publish) pesan ke ESP32
            $mqtt->publish($topic, $payload, 0);
            $mqtt->disconnect();

            // 5. Kembalikan pengguna ke halaman sebelumnya
            return back(303);

        } catch (\Exception $e) {
            return back()->withErrors(['mqtt_error' => 'Gagal mengubah mode perangkat.']);
        }
    }
}