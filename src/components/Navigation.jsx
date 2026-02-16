export default function Navigation({ mode = "light" }) {
  // Pick the logo based on mode
  const logoSrc = mode === "dark" ? "/logo-dark.png" : "/logo-light.png";

  return (
    <nav className="flex py-10 items-center justify-center relative z-10">
      {/* Top Right Logo */}
      <img
        src={logoSrc}
        alt="The Passer-by"
        className="h-37 w-auto object-contain absolute right-1 top-4 mr-20 mt-2"
      />

      <div className="flex items-center gap-38">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <a href="/home" className="text-gray-900 font-light text-xl font-poppins">Home</a>
      </div>
    </nav>
  );
}
