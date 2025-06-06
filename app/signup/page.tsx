'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with Firebase/Auth backend
    alert(`Welcome, ${formData.name}! Signup submitted.`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full bg-[#111] p-8 rounded-2xl shadow-xl border border-[#00ffe0]">
        <h1 className="text-3xl font-extrabold mb-4 text-[#00ffe0] tracking-wide">Create Account</h1>
        <p className="text-gray-400 mb-6 text-sm">Sign up to start using SmartBuy Advisor</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm mb-1 text-[#00ffe0]">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#00ffe0] text-white focus:outline-none focus:ring-2 focus:ring-[#00ffe0]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm mb-1 text-[#00ffe0]">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#00ffe0] text-white focus:outline-none focus:ring-2 focus:ring-[#00ffe0]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1 text-[#00ffe0]">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg bg-[#1a1a1a] border border-[#00ffe0] text-white focus:outline-none focus:ring-2 focus:ring-[#00ffe0]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#00ffe0] text-black font-semibold rounded-lg hover:bg-[#00cbbf] transition-all duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-[#00ffe0] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
