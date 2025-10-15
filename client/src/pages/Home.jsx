import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiChartBar, HiUserGroup, HiClock } from "react-icons/hi2";
import SpotlightBackground from "../components/ui/spotlight-background";

const Home = () => {
  return (
    <SpotlightBackground>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="flex flex-col items-center justify-center min-h-screen px-8 py-12"
      >
        {/* Hero Section */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight px-4"
          >
            Master Your
            <span className="block text-white mt-2">
              Sleep Patterns
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg md:text-xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed px-6"
          >
            Transform your sleep quality with AI-powered insights, personalized coaching,
            and comprehensive tracking. Wake up refreshed, every single day.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-black rounded-lg font-semibold text-lg hover:bg-zinc-100 transition-all duration-300"
              >
                Start Tracking Free
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-zinc-800 text-white rounded-lg font-semibold text-lg hover:bg-zinc-700 transition-all duration-300 border border-zinc-800"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {[
              {
                icon: HiChartBar,
                title: "Smart Analytics",
                description: "Advanced sleep pattern analysis with personalized insights and recommendations."
              },
              {
                icon: HiUserGroup,
                title: "Sleep Coach",
                description: "AI-powered coaching with personalized tips to improve your sleep quality."
              },
              {
                icon: HiClock,
                title: "Smart Reminders",
                description: "Intelligent notifications to help you maintain consistent sleep schedules."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.2, duration: 0.6 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-6 hover:bg-zinc-900/70 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-8 mt-16 pt-8 border-t border-zinc-800"
          >
            {[
              { value: "10k+", label: "Better Nights" },
              { value: "95%", label: "Improved Sleep" },
              { value: "4.9★", label: "User Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.3 + index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-zinc-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </SpotlightBackground>
  );
};

export default Home;