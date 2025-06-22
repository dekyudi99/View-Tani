import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    return () => {
      reset('password', 'password_confirmation');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('register'));
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Head title="Register" />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">
        {/* Left - Form */}
        <div className="p-10 bg-white">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-700">Daftar Akun</h1>
            <p className="text-gray-500 mt-2">Silakan isi form untuk membuat akun baru.</p>
          </div>

          <form onSubmit={submit}>
            <div className="mb-4">
              <InputLabel htmlFor="name" value="Nama" />
              <TextInput
                id="name"
                name="name"
                value={data.name}
                className="mt-1 block w-full"
                autoComplete="name"
                isFocused={true}
                onChange={(e) => setData('name', e.target.value)}
                required
              />
              <InputError message={errors.name} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="email" value="Email" />
              <TextInput
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="mt-1 block w-full"
                autoComplete="username"
                onChange={(e) => setData('email', e.target.value)}
                required
              />
              <InputError message={errors.email} className="mt-2" />
            </div>

            <div className="mb-4">
              <InputLabel htmlFor="password" value="Password" />
              <TextInput
                id="password"
                type="password"
                name="password"
                value={data.password}
                className="mt-1 block w-full"
                autoComplete="new-password"
                onChange={(e) => setData('password', e.target.value)}
                required
              />
              <InputError message={errors.password} className="mt-2" />
            </div>

            <div className="mb-6">
              <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
              <TextInput
                id="password_confirmation"
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                className="mt-1 block w-full"
                autoComplete="new-password"
                onChange={(e) => setData('password_confirmation', e.target.value)}
                required
              />
              <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            <PrimaryButton className="w-full justify-center" disabled={processing}>
              Daftar
            </PrimaryButton>

            <p className="text-center text-sm mt-6 text-gray-600">
              Sudah punya akun?{' '}
              <Link href={route('login')} className="text-blue-600 hover:underline">
                Masuk
              </Link>
            </p>
          </form>
        </div>

        {/* Right - Ilustrasi */}
        <div className="hidden md:flex items-center justify-center bg-blue-50">
          <img
            src="/images/register.jpeg"
            alt="Register Illustration"
            className="w-3/4 h-auto"
          />
        </div>
      </div>
    </div>
  );
}