import { useState, useEffect } from "react";

export default function ButtonGUI({ children }) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Delay rendering modal for smooth fade
  useEffect(() => {
    if (open) {
      const timeout = setTimeout(() => setShowModal(true), 10); // tiny delay
      return () => clearTimeout(timeout);
    } else {
      setShowModal(false);
    }
  }, [open]);

  return (
    <div className="z-20">
      {/* Gear Button */}
      <button
        onClick={() => setOpen(true)}
        className="
          group w-10 h-10 flex items-center justify-center
          rounded-xl
          transition-transform duration-200
          hover:scale-110 active:scale-95
        "
      >
        <svg viewBox="0 0 24 24" className="w-16 h-16">
          <defs>
            <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0C225B" />
              <stop offset="100%" stopColor="#4DACD2" />
            </linearGradient>
          </defs>

          {/* Base dark gray gear */}
          <path
            d="M19.43 12.98c.04-.32.07-.66.07-1s-.03-.68-.07-1l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.03 7.03 0 0 0-1.73-1l-.38-2.65A.5.5 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65a7.03 7.03 0 0 0-1.73 1l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.66-.07 1s.03.68.07 1l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.12.22.38.3.61.22l2.49-1c.52.38 1.09.7 1.73 1l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.64-.3 1.21-.62 1.73-1l2.49 1c.23.09.49 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
            fill="#4B5563"
          />

          {/* Gradient overlay on hover */}
          <path
            d="M19.43 12.98c.04-.32.07-.66.07-1s-.03-.68-.07-1l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.03 7.03 0 0 0-1.73-1l-.38-2.65A.5.5 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65a7.03 7.03 0 0 0-1.73 1l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46c-.12.22-.07.49.12.64l2.11 1.65c-.04.32-.07.66-.07 1s.03.68.07 1l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.12.22.38.3.61.22l2.49-1c.52.38 1.09.7 1.73 1l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.64-.3 1.21-.62 1.73-1l2.49 1c.23.09.49 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
            fill="url(#iconGrad)"
            className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </svg>
      </button>

      {/* Modal with smooth fade */}
      {open && (
        <div className="fixed inset-0 flex items-center justify-center">
          {/* Dark overlay with blur and fade */}
          <div
            className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
              showModal ? "opacity-100" : "opacity-0"
            }`}
          ></div>

          {/* Modal content */}
          <div
            className={`relative bg-white p-6 rounded-2xl shadow-xl w-80 z-10 transition-opacity duration-300 ${
              showModal ? "opacity-100" : "opacity-0"
            }`}
          >
            {children}

            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
