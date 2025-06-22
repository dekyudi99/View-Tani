import React from 'react';
import { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Head title="Log in" />

            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">
                {/* Left - Form */}
                <div className="p-10 bg-white">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-blue-700">Masuk ke Akun Anda</h1>
                        <p className="text-gray-500 mt-2">Pantau suhu dan kelembapan secara real-time.</p>
                    </div>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
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
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Lupa Password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton className="w-full justify-center" disabled={processing}>
                            Masuk
                        </PrimaryButton>

                        <p className="text-center text-sm mt-6 text-gray-600">
                            Belum punya akun?{' '}
                            <Link href={route('register')} className="text-blue-600 hover:underline">
                                Daftar sekarang
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Right - Image / Illustration */}
                <div className="hidden md:flex items-center justify-center bg-blue-50">
                    <img
                        src="/images/ilustrasiLogin.png"
                        alt="Login Illustration"
                        className="w-3/4 h-auto"
                    />
                </div>
            </div>
        </div>
    );
}