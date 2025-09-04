import { useState } from "react";
import Home from "./pages/Home";
import QueryPanel from "./components/QueryPanel";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function App() {
  const [showRight, setShowRight] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex relative overflow-hidden">
      {/* Left panel */}
      <motion.div
        className="border-r border-gray-300 p-4 overflow-y-auto h-screen"
        animate={{ width: showRight ? "60%" : "100%" }}
        transition={{ duration: 0.5 }}
      >
        <Home />
      </motion.div>

      {/* Right panel */}
      <motion.div
        className="p-4 overflow-y-auto h-screen border-l border-gray-300"
        animate={{ width: showRight ? "40%" : "0%" }}
        transition={{ duration: 0.5 }}
      >
        {showRight && <QueryPanel />}
      </motion.div>

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
