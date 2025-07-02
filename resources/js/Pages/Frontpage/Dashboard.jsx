import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';
import StatsGrid from '../../Components/StatsGrid';
import ControlPanel from '../../Components/ControlPanel';
import TemperatureChart from '../../Components/TemperatureChart';
import Dropdown from '@/Components/Dropdown';
import { Link } from '@inertiajs/react';

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
        
        <div className="flex flex-row justify-between items-baseline">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard ViewTani</h1>
           <div className="flex flex-row text-sm text-gray-600 space-x-4">
            <Link href={route("profile.edit")} className="hover:text-blue-600">Profil</Link>
            <span className="text-gray-400">|</span>
            <Dropdown.Link href={route('logout')} method="post" as="button">
              Log Out
            </Dropdown.Link>
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