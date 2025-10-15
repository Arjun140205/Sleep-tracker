import { motion } from "framer-motion";
import "./spotlight.css";

// Individual Spotlight element
const Spotlight = ({ className, ...props }) => {
  return (
    <motion.div
      className={`spotlight ${className}`}
      {...props}
    />
  );
};

// SpotlightBackground container
const SpotlightBackground = ({ children }) => {
  const ANIMATION_DURATION = 180; // Same duration for all circles
  
  return (
    <div className="spotlight-container">
      <div className="spotlight-overlay">
        {/* Circle 1: Diagonal sweeps (NW-SE pattern) */}
        <Spotlight
          animate={{
            x: [
              "-25%", "45%", "115%", "25%", "-15%", "85%", "135%", "15%", "-30%", "75%",
              "125%", "35%", "-20%", "95%", "140%", "5%", "-35%", "65%", "130%", "45%",
              "-10%", "105%", "145%", "-5%", "-25%", "55%", "120%", "25%", "-40%", "85%"
            ],
            y: [
              "135%", "15%", "-25%", "95%", "125%", "-15%", "45%", "115%", "-35%", "75%",
              "140%", "-5%", "65%", "130%", "-20%", "85%", "145%", "-10%", "55%", "120%",
              "-30%", "105%", "150%", "25%", "-40%", "95%", "135%", "-25%", "75%", "140%"
            ]
          }}
          transition={{
            duration: ANIMATION_DURATION,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="spotlight-1"
        />
        
        {/* Circle 2: Circular/orbital motion (clockwise) */}
        <Spotlight
          animate={{
            x: [
              "50%", "85%", "115%", "135%", "125%", "95%", "45%", "-15%", "-25%", "-20%",
              "15%", "65%", "105%", "140%", "130%", "85%", "25%", "-25%", "-35%", "-15%",
              "35%", "75%", "120%", "145%", "135%", "75%", "5%", "-35%", "-30%", "-5%"
            ],
            y: [
              "-30%", "-15%", "25%", "75%", "125%", "145%", "135%", "105%", "45%", "-5%",
              "-35%", "-25%", "15%", "65%", "115%", "150%", "140%", "95%", "35%", "-15%",
              "-40%", "-20%", "35%", "85%", "135%", "155%", "125%", "75%", "15%", "-25%"
            ]
          }}
          transition={{
            duration: ANIMATION_DURATION,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: 60, // 1/3 of duration for phase offset
          }}
          className="spotlight-2"
        />
        
        {/* Circle 3: Zigzag pattern (NE-SW dominant) */}
        <Spotlight
          animate={{
            x: [
              "125%", "85%", "15%", "-20%", "45%", "105%", "140%", "75%", "-5%", "-30%",
              "65%", "135%", "95%", "25%", "-25%", "55%", "125%", "145%", "35%", "-15%",
              "85%", "155%", "115%", "5%", "-35%", "75%", "140%", "105%", "15%", "-20%"
            ],
            y: [
              "-20%", "35%", "105%", "140%", "95%", "15%", "-30%", "65%", "135%", "155%",
              "85%", "-5%", "45%", "125%", "150%", "75%", "-25%", "55%", "145%", "165%",
              "95%", "-15%", "25%", "115%", "160%", "65%", "-35%", "85%", "135%", "175%"
            ]
          }}
          transition={{
            duration: ANIMATION_DURATION,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: 120, // 2/3 of duration for phase offset
          }}
          className="spotlight-3"
        />
      </div>
      <div className="spotlight-content">
        {children}
      </div>
    </div>
  );
};

export default SpotlightBackground;