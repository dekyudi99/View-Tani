<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use InfluxDB2\Client;
use PhpMqtt\Client\MqttClient;

class IoTController extends Controller
{
    public function index()
    {
        $config = [
            "url" => env('INFLUXDB_URL'),
            "token" => env('INFLUXDB_TOKEN'),
            "bucket" => env('INFLUXDB_BUCKET'),
            "org" => env('INFLUXDB_ORG'),
        ];
        $client = new Client($config);
        $queryApi = $client->createQueryApi();

        $currentStats = [];
        $fields = ['temperature', 'humidity', 'soil_moisture'];

        // Ambil NILAI TERAKHIR dari setiap field
        foreach ($fields as $field) {
            $fluxQuery = 'from(bucket: "' . env('INFLUXDB_BUCKET') . '")
              |> range(start: -1d) // Cari dalam 1 hari terakhir
              |> filter(fn: (r) => r._measurement == "mqtt_consumer" and r._field == "' . $field . '")
              |> last()'; // Ambil yang paling akhir
            
            $tables = $queryApi->query($fluxQuery);
            $currentStats[$field] = count($tables) > 0 ? $tables[0]->records[0]->getValue() : 0;
        }

        // Ambil RIWAYAT DATA SUHU untuk chart
        $tempHistoryQuery = 'from(bucket: "' . env('INFLUXDB_BUCKET') . '")
          |> range(start: -1h)
          |> filter(fn: (r) => r._measurement == "mqtt_consumer" and r._field == "temperature")
          |> aggregateWindow(every: 1m, fn: mean, createEmpty: false)
          |> yield(name: "mean")';
        
        $tables = $queryApi->query($tempHistoryQuery);
        $temperatureHistory = [];
        foreach ($tables as $table) {
            foreach ($table->records as $record) {
                $temperatureHistory[] = [
                    'time' => $record->getTime(),
                    'value' => $record->getValue(),
                ];
            }
        }

        return Inertia::render('Frontpage/Dashboard', [
            'currentStats' => $currentStats,
            'temperatureHistory' => $temperatureHistory,
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : (object)[],
        ]);
    }

    public function sendControl(Request $request)
    {
        // (Fungsi sendControl tetap sama seperti sebelumnya)
        $request->validate([
            'led' => 'required|string|in:merah,kuning,hijau',
            'state' => 'required|boolean',
            'device_id' => 'required|string',
        ]);

        try {
            $mqtt = new MqttClient(env('MQTT_HOST'), env('MQTT_PORT'), 'laravel-client-' . uniqid());
            $mqtt->connect();
            $topic = 'esp32/control/' . $request->device_id;
            $payload = json_encode(['led' => $request->led, 'state' => $request->state]);
            $mqtt->publish($topic, $payload, 0);
            $mqtt->disconnect();
            return back(); 
        } catch (\Exception $e) {
            return back()->withErrors(['mqtt_error' => 'Gagal mengirim perintah. Periksa koneksi MQTT.']);
        }
    }
}