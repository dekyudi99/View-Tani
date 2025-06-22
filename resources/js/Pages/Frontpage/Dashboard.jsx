import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';
import StatsGrid from '../../Components/StatsGrid';
import ControlPanel from '../../Components/ControlPanel';
import TemperatureChart from '../../Components/TemperatureChart';

export default function Dashboard({ currentStats, temperatureHistory, errors }) {
  const deviceId = 'perangkat_1';
  // Fungsi untuk mengontrol LED tetap di sini karena ia berinteraksi dengan router
  const toggleLed = (led, state) => {
      router.post('/dashboard/control', { led, state, device_id: deviceId }, {
          preserveState: true,
          preserveScroll: true,
      });
  };
  // Fungsi untuk auto-refresh data tetap di sini karena ia me-refresh data untuk seluruh halaman
  useEffect(() => {
      const interval = setInterval(() => {
          router.reload({ only: ['currentStats', 'temperatureHistory'] });
      }, 5000);
      return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-row justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard ViewTani</h1>
           <div className="flex justify-end text-sm text-gray-600 space-x-4">
            <a href={route("profile.edit")} className="hover:text-blue-600">Profil</a>
            <span className="text-gray-400">|</span>
            <form method="POST" action={route('logout')}>
              <input type="hidden" name="_token" value={window.csrf_token} />
              <button type="submit" className="hover:text-blue-600">Logout</button>
            </form>
          </div>
        </div>
          
          {/* Menampilkan komponen StatsGrid */}
          <StatsGrid stats={currentStats} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Menampilkan komponen ControlPanel */}
              <ControlPanel onToggleLed={toggleLed} />
              {/* Menampilkan komponen TemperatureChart */}
              <TemperatureChart history={temperatureHistory} />
          </div>
      </div>
    </div>
  );
}