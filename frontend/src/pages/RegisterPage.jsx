import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus } from 'lucide-react';

import api from '../services/api';
import useStore from '../store/useStore';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
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
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const confirm = form.confirm;

    if (!name) {
      nextErrors.name = 'Full name is required.';
    } else if (name.length < 2) {
      nextErrors.name = 'Full name must be at least 2 characters.';
    }

    if (!email) {
      nextErrors.email = 'Email is required.';
    } else if (!emailRegex.test(email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    } else if (!passwordRegex.test(password)) {
      nextErrors.password = 'Password must be at least 6 characters and include at least one letter and one number.';
    }

    if (!confirm) {
      nextErrors.confirm = 'Please confirm your password.';
    } else if (password && confirm !== password) {
      nextErrors.confirm = 'Passwords do not match.';
    }

    return { nextErrors, name, email, password };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nextErrors, name, email, password } = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError('');
      return;
    }

    setFieldErrors({});
    setLoading(true);
    try {
      const { data } = await api.post('/api/auth/register', {
        name,
        email,
        password,
      });
      setAuth({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            Workspace Access
          </Badge>
          <h1 className="max-w-md text-4xl font-semibold tracking-tight text-zinc-950">
            Create your account .
          </h1>
          <p className="mt-4 max-w-md text-base leading-7 text-zinc-600">
            Join the team directory with a cleaner onboarding flow built around the dashboard&apos;s visual system.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { title: 'Centralized profiles', desc: 'Keep all team member records in one organized workspace.' },

            ].map(({ title, desc }) => (
              <div key={title} className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-700 ring-1 ring-orange-200">
                  <UserPlus className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-950">{title}</p>
                  <p className="mt-1 text-sm text-zinc-600">{desc}</p>
                </div>
              </div>
            ))}
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
                  Register
                </Badge>
                <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Create an account</h2>
                <p className="mt-2 text-sm text-zinc-600">Get started with the same dashboard-inspired workspace theme.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-700">Full name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Bandana Bhatta"
                    className="border-zinc-200 bg-white"
                    autoComplete="name"
                    aria-invalid={Boolean(fieldErrors.name)}
                  />
                  {fieldErrors.name && <p className="text-sm text-red-700">{fieldErrors.name}</p>}
                </div>

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
                    placeholder="Min. 6 characters"
                    className="border-zinc-200 bg-white"
                    autoComplete="new-password"
                    aria-invalid={Boolean(fieldErrors.password)}
                  />
                  {fieldErrors.password && <p className="text-sm text-red-700">{fieldErrors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm" className="text-zinc-700">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="border-zinc-200 bg-white"
                    autoComplete="new-password"
                    aria-invalid={Boolean(fieldErrors.confirm)}
                  />
                  {fieldErrors.confirm && <p className="text-sm text-red-700">{fieldErrors.confirm}</p>}
                </div>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full bg-zinc-950 text-white hover:bg-zinc-800">
                  {loading ? 'Creating account...' : 'Create account'}
                  {!loading && <ArrowRight className="size-4" />}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-zinc-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-orange-700 transition-colors hover:text-orange-800">
                  Sign in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

