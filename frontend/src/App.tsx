import { useState, useEffect } from "react";
import Home from "./pages/Home";
import QueryPanel from "./components/QueryPanel";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function App() {
  const [showRight, setShowRight] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768); // breakpoint for tablets/small devices
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const leftWidth = showRight
    ? isSmallScreen
      ? "0%"      // left hidden on small screen when right shown
      : "60%"     // left panel width on larger screen
    : "100%";     // left full width when right hidden

  const rightWidth = showRight
    ? isSmallScreen
      ? "100%"    // right full width on small screen
      : "40%"     // right panel width on larger screen
    : "0%";       // right hidden when not shown

  return (
    <div className="min-h-screen bg-gray-100 flex relative overflow-hidden">
      {/* Left panel */}
      <motion.div
        className="border-r border-gray-300 p-4 overflow-y-auto h-screen"
        animate={{ width: leftWidth }}
        transition={{ duration: 0.5 }}
      >
        <Home />
      </motion.div>

      {/* Right panel */}
      <motion.div
        className="p-4 overflow-y-auto h-screen border-l border-gray-300"
        animate={{ width: rightWidth }}
        transition={{ duration: 0.5 }}
      >
        {showRight && <QueryPanel />}
      </motion.div>

      {/* Toggle Button */}
      <button
        onClick={() => setShowRight(!showRight)}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-blue-500 text-white p-3 rounded-l-full shadow-lg hover:bg-blue-600 transition z-50"
      >
        {showRight ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </button>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
