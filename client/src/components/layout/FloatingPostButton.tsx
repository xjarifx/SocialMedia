import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingPostButton() {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate("/post")}
        className="md:hidden fixed bottom-20 right-4 w-14 h-14 bg-primary-500 hover:bg-primary-600 rounded-full shadow-lg flex items-center justify-center z-40 transition-colors"
        aria-label="Create post"
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </motion.button>
    </AnimatePresence>
  );
}
