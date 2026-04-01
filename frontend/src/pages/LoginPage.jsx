import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import api from '../services/api';
import useStore from '../store/useStore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validateForm = () => {
    const nextErrors = {};
    const normalizedEmail = form.email.trim().toLowerCase();
    const password = form.password;

    if (!normalizedEmail) {
      nextErrors.email = 'Email is required.';
    } else if (!emailRegex.test(normalizedEmail)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    return { nextErrors, normalizedEmail, password };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nextErrors, normalizedEmail, password } = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError('');
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/login', {
        email: normalizedEmail,
        password,
      });
      setAuth({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fafaf9_0%,#ffffff_46%,#fffaf5_100%)] lg:grid lg:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-zinc-200 bg-[linear-gradient(180deg,#ffffff,#fcfcfb)] p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-100 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-zinc-100 blur-3xl" />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white shadow-sm ring-2 ring-orange-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-semibold tracking-tight text-zinc-950">TaskManager</span>
        </div>

        <div className="relative z-10 max-w-lg">
          <Badge variant="outline" className="mb-6 border-orange-200 bg-orange-50 text-orange-700">
            Professional View
          </Badge>
          <h1 className="max-w-md text-4xl font-semibold tracking-tight text-zinc-950">
            Access your team workspace .
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">
            Review records, update profiles, and keep your directory in sync from a calmer, focused interface.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
              <p className="text-sm font-medium text-zinc-950">Secure access</p>
              <p className="mt-1 text-sm text-zinc-600">Sign in and continue from exactly where you left off.</p>
            </div>
          </div>

        </div>

        <p className="relative text-xs text-zinc-500">© 2026 TaskManager. All rights reserved.</p>
      </div>

      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-950 text-white ring-2 ring-orange-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold tracking-tight text-zinc-950">TaskManager</span>
          </div>

          <Card className="border-zinc-200 bg-[linear-gradient(180deg,#ffffff,#fffaf5)] shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8">
                <Badge variant="outline" className="mb-4 border-orange-200 bg-orange-50 text-orange-700">
                  Sign In
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Welcome back</h2>
                <p className="mt-2 text-sm text-zinc-600">Sign in to continue managing your team directory.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="border-zinc-200 bg-white"
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                  />
                  {fieldErrors.email && <p className="text-sm text-red-700">{fieldErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-700">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="border-zinc-200 bg-white"
                    autoComplete="current-password"
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                  {fieldErrors.password && <p className="text-sm text-red-700">{fieldErrors.password}</p>}
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full bg-zinc-950 text-white hover:bg-zinc-800">
                  {loading ? 'Signing in...' : 'Sign in'}
                  {!loading && <ArrowRight className="size-4" />}
                </Button>
              </form>

              {/* <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-4 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-zinc-950">Demo access</p>
                    <p className="mt-1 text-sm text-zinc-600">
                      <span className="font-medium text-zinc-950">demo@example.com</span>
                      {' / '}
                      <span className="font-medium text-zinc-950">demo1234</span>
                    </p>
                  </div>
                </div>
              </div> */}

              <p className="mt-6 text-center text-sm text-zinc-600">
                Don&apos;t have an account?{' '}
                <Link to="/register" className="font-medium text-orange-700 transition-colors hover:text-orange-800">
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

