import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">🛌 Sleep Tracker</h1>
      <p className="text-lg mb-6 max-w-xl text-center">
        Struggling with irregular sleep? Track your bedtime, wake-up time, and duration easily with our visual dashboard and insights.
      </p>
      <div className="space-x-4">
        <Link to="/login">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700">Login</button>
        </Link>
        <Link to="/signup">
          <button className="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-full shadow hover:bg-blue-100">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;