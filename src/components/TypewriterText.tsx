import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TypewriterTextProps {
  texts: string[];
  className?: string;
}

export const TypewriterText = ({ texts, className = "" }: TypewriterTextProps) => {
  const [index, setIndex]       = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordKey, setWordKey]   = useState(0); // only changes when WORD changes → drives the 3D flip

  useEffect(() => {
    const full = texts[index];

    if (!isDeleting) {
      if (displayed.length < full.length) {
        // Still typing
        const t = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 80);
        return () => clearTimeout(t);
      } else {
        // Finished typing — wait 2 s then start deleting
        const t = setTimeout(() => setIsDeleting(true), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        // Deleting
        const t = setTimeout(() => setDisplayed(full.slice(0, displayed.length - 1)), 45);
        return () => clearTimeout(t);
      } else {
        // Done deleting — advance to next word and trigger 3D flip
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % texts.length);
        setWordKey((prev) => prev + 1); // flip!
      }
    }
  }, [displayed, isDeleting, index, texts]);

  return (
    <span
      className={className}
      style={{ display: "inline-block", perspective: "600px", minHeight: "1.2em" }}
    >
      {/* key = wordKey so the flip only triggers on word change, NOT on each letter */}
      <AnimatePresence mode="wait">
        <motion.span
          key={wordKey}
          style={{ display: "inline-block", transformOrigin: "center center" }}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0,  opacity: 1 }}
          exit={{   rotateY: -90, opacity: 0 }}
          transition={{
            rotateY: { type: "spring", stiffness: 220, damping: 24 },
            opacity: { duration: 0.15 },
          }}
        >
          {displayed}
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.85 }}
            className="ml-0.5"
          >
            |
          </motion.span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
