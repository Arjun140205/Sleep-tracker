import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HiChartBar, HiUserGroup, HiClock, HiArrowRight } from "react-icons/hi2";
import AnimatedBackground from "../components/ui/animated-background";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text reveal
      gsap.from(".hero-word", {
        y: 120,
        opacity: 0,
        rotationX: -90,
        duration: 1.2,
        stagger: 0.08,
        ease: "power4.out",
      });

      gsap.from(".hero-desc", {
        y: 40,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: "power3.out",
      });

      gsap.from(".hero-btn", {
        y: 30,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        delay: 0.9,
        stagger: 0.1,
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
          x: i % 2 === 0 ? -100 : 100,
          opacity: 0,
          duration: 1.2,
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
    <AnimatedBackground>
      <div ref={containerRef} className="relative min-h-screen">
        {/* Minimal Navigation */}
        <nav className="relative z-50 px-8 py-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-white">Sleep Tracker</div>
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

        {/* Hero Section - Clean & Minimal */}
        <section className="relative z-10 min-h-screen flex items-center justify-center px-8 py-20">
          <div className="max-w-5xl mx-auto text-center">
            {/* Main Headline */}
            <div className="mb-12 overflow-hidden">
              <h1 className="text-[clamp(3rem,15vw,9rem)] font-bold leading-[0.85] tracking-tighter">
                <div className="mb-2">
                  <span className="hero-word inline-block text-white">Transform</span>
                </div>
                <div>
                  <span className="hero-word inline-block text-zinc-500">Your</span>{" "}
                  <span className="hero-word inline-block text-zinc-500">Sleep</span>
                </div>
              </h1>
            </div>

            {/* Description */}
            <p className="hero-desc text-xl md:text-2xl text-zinc-400 mb-16 max-w-2xl mx-auto leading-relaxed">
              AI-powered insights and personalized coaching to help you sleep better every night
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <button className="hero-btn group px-10 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-zinc-100 transition-all hover:scale-105">
                  <span className="flex items-center gap-2">
                    Start Free Trial
                    <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
              <Link to="/login">
                <button className="hero-btn px-10 py-4 bg-zinc-900/50 backdrop-blur-sm text-white rounded-lg font-semibold text-lg border border-zinc-800 hover:border-zinc-700 transition-all hover:scale-105">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section - Minimal List Style */}
        <section className="relative z-10 py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-20 tracking-tight">
              Features
            </h2>

            <div className="space-y-16">
              {[
                {
                  icon: HiChartBar,
                  title: "Smart Analytics",
                  description: "Visualize your sleep patterns with beautiful charts and get AI-powered insights.",
                },
                {
                  icon: HiUserGroup,
                  title: "AI Sleep Coach",
                  description: "Get personalized recommendations based on your unique sleep data and habits.",
                },
                {
                  icon: HiClock,
                  title: "Smart Reminders",
                  description: "Intelligent notifications that adapt to your schedule and maintain consistency.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="feature-item group flex items-start gap-8 pb-16 border-b border-zinc-800 last:border-0 cursor-pointer"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl flex items-center justify-center group-hover:border-zinc-700 group-hover:scale-110 transition-all duration-500">
                    <feature.icon className="text-3xl text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-zinc-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-lg text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Clean Numbers */}
        <section className="stats-container relative z-10 py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-16 text-center">
              {[
                { value: "10,000+", label: "Active Users" },
                { value: "95%", label: "Better Sleep" },
                { value: "4.9/5", label: "User Rating" },
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

        {/* Final CTA - Minimal */}
        <section className="relative z-10 py-32 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-12 tracking-tight leading-tight">
              Ready to sleep better?
            </h2>
            <Link to="/signup">
              <button className="group px-12 py-5 bg-white text-black rounded-lg font-bold text-xl hover:bg-zinc-100 transition-all hover:scale-110">
                <span className="flex items-center gap-3">
                  Get Started Free
                  <HiArrowRight className="group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-zinc-900 py-12 px-8">
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
    </AnimatedBackground>
  );
};

export default Home;
