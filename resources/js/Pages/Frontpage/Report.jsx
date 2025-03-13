import React from 'react';
import Layout from '../../Layouts/Layout';
import { Calendar, FileSpreadsheet, Search, User } from 'lucide-react';
import { Head } from '@inertiajs/react';

const Report = () => {
  return (
    <div>
      <Head title="Report" />
      <Layout header="Report">
        <div className="p-4 space-y-4">
          {/* Time Span Section */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="font-semibold text-lg flex items-center">
              <Search className="mr-2" /> Time Span
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nama Perangkat"
                className="border p-2 rounded w-full"
              />
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                />
                <Calendar className="text-gray-500" />
              </div>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                />
                <Calendar className="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg flex items-center">
                <FileSpreadsheet className="mr-2" /> Result
              </h2>
              <button className="bg-green-500 text-white px-3 py-1 rounded">Excel</button>
            </div>
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">No</th>
                    <th className="border p-2">Parameter 1</th>
                    <th className="border p-2">Parameter 2</th>
                    <th className="border p-2">Parameter 3</th>
                    <th className="border p-2">Parameter 4</th>
                    <th className="border p-2">Keterangan</th>
                    <th className="border p-2">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <tr key={num} className="text-center">
                      <td className="border p-2">{num}</td>
                      <td className="border p-2">1.0</td>
                      <td className="border p-2">1.0</td>
                      <td className="border p-2">1.0</td>
                      <td className="border p-2">1.0</td>
                      <td className="border p-2">Keterangan</td>
                      <td className="border p-2">Waktu</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-2 flex justify-between">
              <p>Showing 1 to 8 of 4,000 entries</p>
              <div className="space-x-2">
                <button className="px-2 py-1 border rounded">Previous</button>
                <button className="px-2 py-1 border rounded">1</button>
                <button className="px-2 py-1 border rounded">2</button>
                <button className="px-2 py-1 border rounded">3</button>
                <button className="px-2 py-1 border rounded">Next</button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Report;
