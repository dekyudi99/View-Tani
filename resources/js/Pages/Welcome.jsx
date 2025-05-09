// resources/js/Pages/Landing.jsx (Laravel + Inertia setup)
import React from "react";
import { Link } from "@inertiajs/react";
import Topbar from "../Components/Topbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Topbar>
        <a href="#tentang" className="text-gray-700 hover:text-blue-700 font-medium">
            Tentang
        </a>
        <a href="#kontak" className="text-gray-700 hover:text-blue-700 font-medium">
            Kontak
        </a>
      </Topbar>

      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16">
        {/* Left Side */}
        <div className="max-w-xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
            Pantau Suhu & Kelembapan <br /> secara <span className="text-blue-600">Real-time</span>
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            Monitor kondisi suhu dan kelembapan lingkungan Anda dengan mudah dan cepat.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md"
          >
            Mulai
          </Link>
        </div>

        {/* Right Side (Placeholder image) */}
        <div className="mt-10 md:mt-0">
          {/* Ganti src di bawah ini dengan gambar ilustrasi kamu */}
          <img
            src="/images/suhu.png"
            alt="Ilustrasi sensor"
            className="w-full max-w-sm mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Landing;