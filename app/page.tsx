"use client";

import { useEffect, useState } from "react";

export default function LumeAILanding() {
  const [mounted, setMounted] = useState(false);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Auto-rotate cards
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: "🎧",
      title: "Voice Reading",
      description:
        "Natural voice narration of your PDFs with adjustable speed and tone",
    },
    {
      icon: "✨",
      title: "Smart Summaries",
      description: "AI-powered summaries that capture key insights in seconds",
    },
    {
      icon: "💬",
      title: "Interactive Q&A",
      description: "Ask questions about your documents and get instant answers",
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-100 via-teal-50 to-violet-100">
      {/* Floating Orbs Background */}
      <div className="absolute inset-0">
        {mounted &&
          [...Array(20)].map((_, i) => (
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

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Navigation */}
        <div className="absolute top-8 right-8 z-20 animate-fade-in-up hidden lg:flex">
          <div className="flex items-center space-x-4">
            <a
              href="/auth"
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
            >
              Sign In
            </a>
            <a
              href="/auth"
              className="bg-gradient-to-r from-pink-400 to-violet-400 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Started
            </a>
          </div>
        </div>
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <h1 className="text-3xl font-light text-gray-800 tracking-wide">
              Lume AI
            </h1>
          </div>

          <h2 className="text-5xl md:text-7xl font-extralight text-gray-900 leading-tight mb-6">
            Your Personal
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-teal-500 bg-clip-text text-transparent font-light">
              Document Assistant
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
            Experience the future of document interaction with our elegant
            voice-powered device
          </p>

          <div className="flex items-center justify-center mt-4 animate-fade-in-up lg:hidden">
            <div className="flex items-center space-x-4">
              <a
                href="/auth"
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300"
              >
                Sign In
              </a>
              <a
                href="/auth"
                className="bg-gradient-to-r from-pink-400 to-violet-400 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Floating Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative transform transition-all duration-700 hover:scale-105 ${
                activeCard === index ? "scale-105" : ""
              }`}
              style={{
                animationDelay: `${index * 200}ms`,
              }}
            >
              {/* Glass Card */}
              <div className="relative backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                {/* Gradient Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-300/50 via-violet-300/50 to-teal-300/50 p-[1px]">
                  <div className="w-full h-full rounded-3xl bg-white/20 backdrop-blur-xl" />
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-medium text-gray-800 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-400/20 via-violet-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Demo Section */}
        <div className="w-full max-w-4xl mx-auto mb-16">
          <div className="relative backdrop-blur-2xl bg-white/40 border border-white/30 rounded-3xl p-12 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-light text-gray-800 mb-4">
                Try Voice Command
              </h3>
              <p className="text-gray-600">
                Speak naturally to interact with your documents
              </p>
            </div>

            {/* Voice Visualizer */}
            <div className="flex items-center justify-center space-x-2 mb-8">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-t from-pink-400 to-violet-500 rounded-full"
                  style={{
                    width: "4px",
                    height: `${20 + Math.sin(Date.now() / 200 + i) * 15}px`,
                    animation: `wave ${
                      0.8 + i * 0.1
                    }s ease-in-out infinite alternate`,
                  }}
                />
              ))}
            </div>

            {/* Sample Commands */}
            <div className="grid md:grid-cols-2 gap-6">
              {[
                '"Summarize chapter 3 for me"',
                '"What are the key findings?"',
                '"Read the conclusion aloud"',
                '"Explain this concept simply"',
              ].map((command, index) => (
                <div
                  key={index}
                  className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/30 hover:bg-white/60 transition-all duration-300 cursor-pointer"
                >
                  <p className="text-gray-700 text-center font-medium">
                    {command}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="w-full max-w-7xl mx-auto mb-16">
          <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-4xl md:text-5xl font-extralight text-gray-900 mb-4">
              Choose Your
              <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-teal-500 bg-clip-text text-transparent font-light">
                {" "}
                Experience
              </span>
            </h3>
            <p className="text-xl text-gray-600 font-light">
              Flexible plans for every need
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="group relative transform transition-all duration-700 hover:scale-105">
              <div className="relative backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-300/30 via-rose-300/30 to-pink-300/30 p-[1px]">
                  <div className="w-full h-full rounded-3xl bg-white/20 backdrop-blur-xl" />
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🌱</div>
                    <h4 className="text-2xl font-medium text-gray-800 mb-2">
                      Starter
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Perfect for individuals
                    </p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="text-5xl font-light text-gray-900 mb-2">
                      $29
                      <span className="text-lg text-gray-500 font-normal">
                        /month
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {[
                      "5 PDFs per month",
                      "Basic voice commands",
                      "Standard summaries",
                      "Email support",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a href="/auth">
                    <button className="w-full bg-gradient-to-r from-pink-400 to-rose-400 text-white py-3 rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      Get Started
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Pro Plan - Featured */}
            <div className="group relative transform transition-all duration-700 hover:scale-105 md:scale-105">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                  Most Popular
                </div>
              </div>

              <div className="relative backdrop-blur-xl bg-white/40 border-2 border-violet-300/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-violet-300/40 via-purple-300/40 to-violet-300/40 p-[1px]">
                  <div className="w-full h-full rounded-3xl bg-white/30 backdrop-blur-xl" />
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🚀</div>
                    <h4 className="text-2xl font-medium text-gray-800 mb-2">
                      Pro
                    </h4>
                    <p className="text-gray-600 text-sm">For power users</p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="text-5xl font-light text-gray-900 mb-2">
                      $79
                      <span className="text-lg text-gray-500 font-normal">
                        /month
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {[
                      "50 PDFs per month",
                      "Advanced voice AI",
                      "Smart summaries",
                      "Priority support",
                      "Custom voice settings",
                      "API access",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-violet-400 to-purple-400 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a href="/auth">
                    <button className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-3 rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      Start Pro Trial
                    </button>
                  </a>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="group relative transform transition-all duration-700 hover:scale-105">
              <div className="relative backdrop-blur-xl bg-white/30 border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-teal-300/30 via-cyan-300/30 to-teal-300/30 p-[1px]">
                  <div className="w-full h-full rounded-3xl bg-white/20 backdrop-blur-xl" />
                </div>

                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="text-4xl mb-4">🏢</div>
                    <h4 className="text-2xl font-medium text-gray-800 mb-2">
                      Enterprise
                    </h4>
                    <p className="text-gray-600 text-sm">
                      For teams & organizations
                    </p>
                  </div>

                  <div className="text-center mb-8">
                    <div className="text-5xl font-light text-gray-900 mb-2">
                      Custom
                      <span className="text-lg text-gray-500 font-normal block">
                        pricing
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {[
                      "Unlimited PDFs",
                      "Team collaboration",
                      "Custom integrations",
                      "24/7 dedicated support",
                      "On-premise deployment",
                      "Advanced analytics",
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a href="/auth">
                    <button className="w-full bg-gradient-to-r from-teal-400 to-cyan-400 text-white py-3 rounded-2xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                      Contact Sales
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Footer */}
          <div className="text-center mt-12">
            <p className="text-gray-500 text-sm mb-4">
              All plans include 14-day free trial • No setup fees • Cancel
              anytime
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <span>🔒</span>
                <span>Secure & Private</span>
              </span>
              <span className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Instant Setup</span>
              </span>
              <span className="flex items-center space-x-2">
                <span>💝</span>
                <span>Money-back Guarantee</span>
              </span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in-up">
          <a href="/auth">
            <button className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 via-violet-500 to-teal-500 text-white px-12 py-4 rounded-full text-lg font-medium shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300">
              <span>Get Early Access</span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                <span className="text-sm">→</span>
              </div>
            </button>
          </a>

          <p className="text-gray-500 mt-4 text-sm">
            Join 10,000+ users in the waitlist
          </p>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <a href="/auth">
          <button className="w-16 h-16 bg-gradient-to-br from-pink-400 to-violet-500 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center">
            <span className="text-white text-2xl">💬</span>
          </button>
        </a>
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

        @keyframes wave {
          0% {
            transform: scaleY(1);
          }
          100% {
            transform: scaleY(1.5);
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

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
