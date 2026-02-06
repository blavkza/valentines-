"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Heart, Sparkles, MailOpen } from "lucide-react";

export default function ValentinePage() {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
  });
  const [noCount, setNoCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [isSparkling, setIsSparkling] = useState(false);

  const noButtonRef = useRef<HTMLButtonElement>(null);

  const phrases = [
    "No",
    "Are you sure?",
    "Really sure??",
    "Think again!",
    "Last chance!",
    "Surely not?",
    "You might regret this!",
    "Give it another thought!",
    "Are you absolutely sure?",
    "This could be a mistake!",
    "Have a heart!",
    "Don't be so cold!",
    "Change of heart?",
    "Wouldn't you reconsider?",
    "Is that your final answer?",
    "You're breaking my heart ;(",
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleYes = () => {
    setHasAccepted(true);
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
      colors: ["#ff4d6d", "#ff758f", "#ff8fa3", "#ffb3c1", "#ffffff"],
    });
    setIsSparkling(true);
  };

  const moveNoButton = useCallback(() => {
    const nextCount = noCount + 1;

    if (nextCount >= 10) {
      // Hide under Yes button and disable interactions
      const isMobile = window.innerWidth <= 480;
      setNoButtonPos({
        x: isMobile ? 0 : -140,
        y: isMobile ? -90 : 0,
        opacity: 0,
        scale: 0.5,
      });
      setNoCount(nextCount);
      return;
    }

    const buttonWidth = 100;
    const buttonHeight = 50;
    const isMobile = window.innerWidth <= 480;

    let newX, newY;

    // Calculate a tighter position so it stays within the card/viewport
    if (isMobile) {
      // Mobile: Keep it within a smaller box to avoid going off-screen
      newX = (Math.random() - 0.5) * (window.innerWidth * 0.5);
      newY = Math.random() * 80 + 20; // Maximum 100px down from Yes button
    } else {
      // Desktop: Keep it within a safe horizontal/vertical range
      newX = Math.random() * 150 + 50; // Between 50px and 200px to the right
      newY = (Math.random() - 0.5) * 100; // Between -50px and 50px vertically
    }

    setNoButtonPos({ x: newX, y: newY, opacity: 1, scale: 1 });
    setNoCount(nextCount);

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [noCount]);

  const getNoButtonText = () => {
    const phrases = [
      "No",
      "Are you sure?",
      "Really??",
      "Think again!",
      "Last chance!",
      "You can't say No! ❤️",
    ];
    return phrases[Math.min(noCount, phrases.length - 1)];
  };

  if (!mounted) return null;

  return (
    <main className="container">
      {isSparkling && <SparkleOverlay />}

      <div className="heart-rain-container">
        {[...Array(15)].map((_, i) => (
          <HeartBackground key={i} delay={i * 2.5} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!hasAccepted ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="card"
          >
            <div className="image-wrapper">
              <motion.img
                src="/valentine.png"
                alt="Valentine"
                className="lucia-image"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="heart-mini">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart size={40} fill="currentColor" />
              </motion.div>
            </div>

            <h1>Lucia, will you be my Valentine?</h1>

            <div className="btn-container">
              <motion.button
                className="btn btn-yes"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleYes}
                style={{ fontSize: 1.1 + noCount * 0.05 + "rem" }}
              >
                Yes
              </motion.button>

              <motion.button
                ref={noButtonRef}
                className="btn btn-no"
                animate={{
                  x: noButtonPos.x,
                  y: noButtonPos.y,
                  opacity: noButtonPos.opacity,
                  scale: noButtonPos.scale,
                  pointerEvents: noButtonPos.opacity === 0 ? "none" : "auto",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
              >
                {getNoButtonText()}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="accepted"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
          >
            <AnimatePresence mode="wait">
              {!showLetter ? (
                <motion.div
                  key="celebration"
                  exit={{ opacity: 0, y: -20 }}
                  className="love-letter-container"
                >
                  <img
                    src="/bears.png"
                    alt="Happy Bears"
                    className="bears-img"
                  />

                  <div className="celebration-content">
                    <h1>Yaaaaay! ❤️</h1>
                    <p className="celebration-text">
                      I knew you'd say yes, Lucia!
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowLetter(true)}
                    className="envelope-trigger"
                  >
                    <img
                      src="/letter.png"
                      alt="Love Letter"
                      className="envelope-img"
                    />
                    <span className="envelope-text">
                      A secret message for you... (Click)
                    </span>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="letter-content"
                >
                  <div className="letter-header">
                    <MailOpen color="#ff4d6d" size={28} />
                    <button
                      className="close-btn"
                      onClick={() => setShowLetter(false)}
                    >
                      Close
                    </button>
                  </div>

                  <h2 className="letter-salutation">Dearest Lucia,</h2>

                  <div className="letter-body">
                    <p>
                      From the moment I met you, my world became so much
                      brighter. Your smile is my favorite thing, and your heart
                      is the most beautiful part of you.
                    </p>
                    <p style={{ marginTop: "1rem" }}>
                      Thank you for saying Yes! I promise to make this
                      Valentine's Day as special and wonderful as you are.
                    </p>
                  </div>

                  <div className="letter-signature">Forever Yours ❤️</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .celebration-content {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </main>
  );
}

function SparkleOverlay() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="sparkle"
          initial={{
            x: Math.random() * 100 + "vw",
            y: Math.random() * 100 + "vh",
            scale: 0,
            opacity: 0,
          }}
          animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: Math.random() * 2 + 1.5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          style={{
            width: Math.random() * 3 + 2 + "px",
            height: Math.random() * 3 + 2 + "px",
          }}
        />
      ))}
    </div>
  );
}

function HeartBackground({ delay }: { delay: number }) {
  const [left, setLeft] = useState(0);
  const [size, setSize] = useState(20);

  useEffect(() => {
    setLeft(Math.random() * 100);
    setSize(Math.random() * 15 + 15);
  }, []);

  return (
    <motion.div
      className="heart-particle"
      initial={{ y: "110vh", x: `${left}vw`, opacity: 0 }}
      animate={{
        y: "-10vh",
        opacity: [0, 0.4, 0.4, 0],
        rotate: 360,
      }}
      transition={{ duration: 12, repeat: Infinity, delay, ease: "linear" }}
    >
      <Heart size={size} fill="currentColor" />
    </motion.div>
  );
}
