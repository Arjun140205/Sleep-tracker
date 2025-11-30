import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiArrowRight, HiChartBar, HiShieldCheck, HiMoon } from "react-icons/hi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlackHoleScene } from "../components/ui/black-hole-vortex-animation";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-desc", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      });

      gsap.from(".hero-btn", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.8,
        stagger: 0.2,
        ease: "back.out(1.5)",
      });

      // Feature items scroll animation
      gsap.utils.toArray(".feature-item").forEach((item, i) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 60,
          duration: 1,
          delay: i * 0.2,
          ease: "power3.out",
        });
      });

      // Stats animation
      gsap.from(".stat-number", {
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 85%",
        },
        scale: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "back.out(2)",
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Black Hole Hero Section */}
      <section className="relative">
        <BlackHoleScene title="Dream Deep" />
        
        {/* Navigation overlay */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-8 py-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-white">🌙 Sleep Tracker</div>
            <div className="flex gap-4">
              <Link to="/login">
                <button className="px-6 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-6 py-2 text-sm font-semibold bg-white text-black rounded-lg hover:bg-zinc-100 transition-all">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Content overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-40">
          <div className="max-w-4xl mx-auto text-center px-8">
            {/* Description */}
            <p className="hero-desc text-xl md:text-2xl text-zinc-300 mb-16 max-w-3xl mx-auto leading-relaxed">
              Dive into the depths of better sleep. AI-powered insights and personalized coaching to transform your nights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="/signup">
                <button className="hero-btn group px-12 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-zinc-100 transition-all hover:scale-105 shadow-2xl">
                  <span className="flex items-center gap-2">
                    Start Your Journey
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <Link to="/login">
                <button className="hero-btn px-12 py-4 bg-zinc-900/50 backdrop-blur-sm text-white rounded-lg font-semibold text-lg border border-zinc-600 hover:border-zinc-500 transition-all hover:scale-105">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Dark theme to match */}
      <section className="relative z-10 py-32 px-8 bg-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-20 tracking-tight">
            Features
          </h2>

          <div className="space-y-16">
            {[
              {
                icon: HiChartBar,
                title: "Smart Analytics",
                desc: "Advanced insights into your sleep patterns with AI-driven recommendations.",
              },
              {
                icon: HiShieldCheck,
                title: "Privacy First",
                desc: "Your sleep data stays private and secure, encrypted end-to-end.",
              },
              {
                icon: HiMoon,
                title: "Sleep Optimization",
                desc: "Personalized coaching to improve your sleep quality and duration.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="feature-item group flex flex-col md:flex-row gap-8 items-start hover:scale-[1.02] transition-all duration-500"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl flex items-center justify-center group-hover:border-zinc-700 group-hover:scale-110 transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-zinc-100 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section - Clean Numbers */}
      <section className="stats-container relative z-10 py-32 px-8 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            {[
              { value: "10,000+", label: "Active Users" },
              { value: "50M+", label: "Hours Tracked" },
              { value: "98%", label: "Satisfaction" },
            ].map((stat, index) => (
              <div key={index} className="stat-number">
                <div className="text-6xl md:text-7xl font-bold text-white mb-4">
                  {stat.value}
                </div>
                <div className="text-lg text-zinc-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-32 px-8 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to transform your sleep?
          </h2>
          <p className="text-xl text-zinc-300 mb-12 max-w-2xl mx-auto">
            Join thousands of users who've improved their sleep quality with our AI-powered insights.
          </p>
          <Link to="/signup">
            <button className="px-12 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-zinc-100 transition-all hover:scale-105 shadow-2xl">
              Get Started Free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 py-12 px-8 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-zinc-500 text-sm">
            © 2024 Sleep Tracker
          </div>
          <div className="flex gap-8 text-sm text-zinc-500">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;