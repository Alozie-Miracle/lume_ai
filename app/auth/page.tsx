"use client";

import { useRouter } from "next/navigation";
import type React from "react";

import { useEffect, useState } from "react";

export default function AuthPage() {
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsLoading(false);
    console.log(isLogin ? "Login" : "Sign up", formData);
    router.push("/dashboard/" + 1234567890);
  };

  return (
    <div className="min-h-screen relative p-5 overflow-hidden bg-gradient-to-br from-rose-100 via-teal-50 to-violet-100 flex items-center justify-center">
      {/* Floating Orbs Background */}
      <div className="absolute inset-0">
        {mounted &&
          [...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-20 animate-float"
              style={{
                width: `${60 + Math.random() * 120}px`,
                height: `${60 + Math.random() * 120}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(135deg, 
                ${
                  ["#ff9a9e", "#a8edea", "#d299c2", "#fad0c4", "#a8e6cf"][
                    Math.floor(Math.random() * 5)
                  ]
                }, 
                ${
                  ["#fecfef", "#fbc2eb", "#a6c1ee", "#ffecd2", "#fcb69f"][
                    Math.floor(Math.random() * 5)
                  ]
                })`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
      </div>

      {/* Main Auth Container */}
      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Logo Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <h1 className="text-2xl font-light text-gray-800 tracking-wide">
              Lume AI
            </h1>
          </div>
          <p className="text-gray-600 font-light">
            {isLogin
              ? "Welcome back to your AI assistant"
              : "Join the future of document interaction"}
          </p>
        </div>

        {/* Auth Card */}
        <div className="relative backdrop-blur-2xl bg-white/40 border border-white/30 rounded-3xl p-8 shadow-2xl animate-scale-in">
          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-300/50 via-violet-300/50 to-teal-300/50 p-[1px]">
            <div className="w-full h-full rounded-3xl bg-white/30 backdrop-blur-xl" />
          </div>

          <div className="relative z-10">
            {/* Toggle Buttons */}
            <div className="flex bg-white/30 rounded-2xl p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  isLogin
                    ? "bg-gradient-to-r from-pink-400 to-violet-400 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  !isLogin
                    ? "bg-gradient-to-r from-violet-400 to-teal-400 text-white shadow-lg"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="animate-slide-down">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 text-black bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {!isLogin && (
                <div className="animate-slide-down">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                    placeholder="Confirm your password"
                    required={!isLogin}
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-violet-400 bg-white/50 border-white/30 rounded focus:ring-violet-400/50"
                    />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <button
                    type="button"
                    className="text-violet-500 hover:text-violet-600 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 via-violet-500 to-teal-500 text-white py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </span>
                  </div>
                ) : (
                  <span>{isLogin ? "Sign In" : "Create Account"}</span>
                )}
              </button>
            </form>

            {/* Terms */}
            {!isLogin && (
              <p className="text-xs text-gray-500 text-center mt-4 animate-fade-in">
                By creating an account, you agree to our{" "}
                <button className="text-violet-500 hover:text-violet-600 font-medium">
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="text-violet-500 hover:text-violet-600 font-medium">
                  Privacy Policy
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 animate-fade-in-up">
          <p className="text-gray-500 text-sm">
            {isLogin ? "New to Lume AI?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-violet-500 hover:text-violet-600 font-medium"
            >
              {isLogin ? "Create an account" : "Sign in instead"}
            </button>
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
