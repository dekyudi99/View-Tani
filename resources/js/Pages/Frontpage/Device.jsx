import React from 'react';
import Layouut from '../../Layouts/Layout';
import TopContainer from '@/Components/TopContainer';
import BottomContainer from '@/Components/BottomContainer';
import { Head } from '@inertiajs/react';
import { Plus, Edit, Trash2, List } from 'lucide-react';

const Device = () => {
  const devices = [
    { name: 'Perangkat 1', status: 'Aktif' },
    { name: 'Perangkat 2', status: 'Aktif' },
    { name: 'Perangkat 3', status: 'Dalam Perbaikan' },
    { name: 'Perangkat 4', status: 'Belum Aktif' },
  ];

  return (
    <div>
      <Head title="Device" />
      <Layouut header="Device">
        {/* Form Tambah Perangkat */}
        <TopContainer icon={Plus} title="Add Device">
          <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-bold">Nama Perangkat</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                placeholder="Perangkat 1"
              />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-bold">Status</label>
              <select className="w-full p-2 border rounded-lg">
                <option>Aktif</option>
                <option>Dalam Perbaikan</option>
                <option>Belum Aktif</option>
              </select>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-gray-700 rounded-lg">
              <Plus size={16} /> Add
            </button>
          </div>
        </TopContainer>

        {/* Daftar Perangkat */}
        <BottomContainer icon={List} title="List Device">
          <div className="p-4 bg-white rounded-lg shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Nama Perangkat</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{device.name}</td>
                    <td className="p-2">{device.status}</td>
                    <td className="p-2 flex gap-2">
                      <button className="px-3 py-1 text-white bg-green-500 rounded-lg flex items-center gap-1">
                        <Edit size={14} /> Edit
                      </button>
                      <button className="px-3 py-1 text-white bg-red-500 rounded-lg flex items-center gap-1">
                        <Trash2 size={14} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </BottomContainer>
      </Layouut>
    </div>
  );
};

export default Device;
