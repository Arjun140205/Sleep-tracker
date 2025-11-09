import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { setToken } from "../utils/auth";
import GridBackground from "../components/ui/grid-background";
import { HiArrowRight } from "react-icons/hi2";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      console.log("🔐 Starting signup request...");
      const startTime = Date.now();
      
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      const duration = Date.now() - startTime;
      console.log(`📡 Signup request completed in ${duration}ms`);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setToken(data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GridBackground>
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link to="/" className="text-3xl font-bold text-white tracking-tight">
            Sleep
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
                Get Started
              </h1>
              <p className="text-zinc-400 text-lg">
                Create your account to begin
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 text-white placeholder-zinc-500 transition-all text-base"
                  placeholder="Full name"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 text-white placeholder-zinc-500 transition-all text-base"
                  placeholder="Email address"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 text-white placeholder-zinc-500 transition-all text-base"
                  placeholder="Password"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700 rounded-xl focus:outline-none focus:border-zinc-500 focus:bg-zinc-800 text-white placeholder-zinc-500 transition-all text-base"
                  placeholder="Confirm password"
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-zinc-800 border border-zinc-700 rounded-xl"
                >
                  <p className="text-sm text-zinc-300 text-center">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full px-5 py-4 bg-white text-black rounded-xl font-bold text-base hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-6"
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && (
                  <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
              <p className="text-zinc-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white font-semibold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Link
              to="/"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </GridBackground>
  );
};

export default Signup;
