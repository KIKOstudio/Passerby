import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import PrayerCards from "./components/PrayerCards";
import Navigation from "./components/Navigation";
import ButtonGUI from './components/Settings';
import CookieBanner from "./components/CookieBanner";
import UseMyLocationButton from "./components/UseMyLocationButton";

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [prayers, setPrayers] = useState([]);
  const [dateInfo, setDateInfo] = useState(null);
  const [location, setLocation] = useState({ city: 'Dubai', country: 'AE', countryName: 'UAE', flag: '🇦🇪' });
  const backgroundRef = useRef(null);
  const [selectedMethod, setSelectedMethod] = useState(3);
  const [selectedSchool, setSelectedSchool] = useState(0);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [showSchoolModal, setShowSchoolModal] = useState(false);

  const calculationMethods = [
    { id: 1, name: "University of Islamic Sciences, Karachi" },
    { id: 2, name: "Islamic Society of North America" },
    { id: 3, name: "Muslim World League" },
    { id: 4, name: "Umm Al-Qura University, Makkah" },
    { id: 5, name: "Egyptian General Authority of Survey" },
    { id: 8, name: "Gulf Region" },
    { id: 9, name: "Kuwait" },
    { id: 10, name: "Qatar" },
    { id: 11, name: "Majlis Ugama Islam Singapura, Singapore" },
    { id: 12, name: "Union Organization islamic de France" },
    { id: 13, name: "Diyanet İşleri Başkanlığı, Turkey" },
    { id: 14, name: "Spiritual Administration of Muslims of Russia" },
    { id: 15, name: "Moonsighting Committee Worldwide" },
    { id: 16, name: "Dubai (experimental)" },
    { id: 17, name: "Jabatan Kemajuan Islam Malaysia (JAKIM)" },
    { id: 18, name: "Tunisia" },
    { id: 19, name: "Algeria" },
    { id: 20, name: "KEMENAG - Kementerian Agama Republik Indonesia" },
    { id: 21, name: "Morocco" },
    { id: 22, name: "Comunidade Islamica de Lisboa" },
    { id: 23, name: "Ministry of Awqaf, Islamic Affairs and Holy Places, Jordan" }
  ];

  // Load saved location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('prayerLocation');
    if (savedLocation) {
      setLocation(JSON.parse(savedLocation));
    }
  }, []);

  // Mouse move effect
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      if (backgroundRef.current) {
        const rect = backgroundRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Fetch prayer times function
  const fetchPrayerTimes = async (city, country, method = 3, school = 0) => {
    try {
      const today = new Date();
      const date = today.toLocaleDateString("en-GB").split("/").join("-");
      const url = `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(city)}&country=${country}&method=${method}&school=${school}`;
      const res = await fetch(url);
      const json = await res.json();
      handleResponse(json);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResponse = (json) => {
    if (!json.data || !json.data.timings) return;
    const t = json.data.timings;
    setPrayers([
      { name: "Fajr", time: t.Fajr },
      { name: "Dhuhr", time: t.Dhuhr },
      { name: "Asr", time: t.Asr },
      { name: "Maghrib", time: t.Maghrib },
      { name: "Isha", time: t.Isha },
    ]);
    const { gregorian, hijri } = json.data.date;
    setDateInfo({
      gregorian: `${gregorian.day} ${gregorian.month.en}, ${gregorian.year}`,
      hijri: `${hijri.day} ${hijri.month.en}, ${hijri.year}`
    });
  };

  // Initial load - NO GEOLOCATION, only saved location or default to Dubai
  useEffect(() => {
    const loadInitialData = async () => {
      const savedLocation = localStorage.getItem("prayerLocation");

      if (savedLocation) {
        const { city, country } = JSON.parse(savedLocation);
        setLocation(JSON.parse(savedLocation));
        await fetchPrayerTimes(city, country, selectedMethod, selectedSchool);
      } else {
        // Default to Dubai, no geolocation request
        await fetchPrayerTimes('Dubai', 'AE', selectedMethod, selectedSchool);
      }
    };

    loadInitialData();
  }, []); // Run once on mount

  // Re-fetch when method or school changes (if we have location)
  useEffect(() => {
    if (location.city && location.country) {
      fetchPrayerTimes(location.city, location.country, selectedMethod, selectedSchool);
    }
  }, [selectedMethod, selectedSchool]);

  // Refresh prayer times every minute
  useEffect(() => {
    const i = setInterval(() => {
      setPrayers(p => [...p]);
    }, 60000);
    return () => clearInterval(i);
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedLocation = localStorage.getItem('prayerLocation');
      if (savedLocation) {
        const parsed = JSON.parse(savedLocation);
        setLocation(parsed);
        fetchPrayerTimes(parsed.city, parsed.country, selectedMethod, selectedSchool);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [selectedMethod, selectedSchool]);

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Top Left Image */}
      <img
        src="/customGradient.png"
        alt="Top Left"
        className="absolute top-0 left-0 h-110 w-auto z-11 pointer-events-none"
      />

      {/* Navigation */}
      <Navigation mode="dark" />

      {/* Main Content */}
      <main className="z-10 flex-2 pt-12">
        {/* Header */}

        <div className="flex items-center justify-center gap-4 mt-10 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            <span className="text-black font-poppins">Prayer Times in </span>
            <span className="bg-gradient-to-r from-[#0C225B] to-[#4DACD2] bg-clip-text text-transparent">
              {location.city}, {location.countryName}
            </span>
          </h1>

          <ButtonGUI iconSrc={"/settings.svg"}>
            <h2 className="text-lg font-semibold mb-4">Settings</h2>

            {/* Location Button */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Location</p>
              <Link
                to="/findtimes"
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-[#D5D5D5] transition-colors w-full"
              >
                <img src={'/location.png'} alt="Location" className="w-5 h-5 object-contain" />
                <span>{location.city}, {location.countryName}</span>
              </Link>
              <div className="mt-2">
                <UseMyLocationButton
                  setLocation={setLocation}
                  fetchPrayerTimes={fetchPrayerTimes}
                  selectedMethod={selectedMethod}
                  selectedSchool={selectedSchool}
                />
              </div>
            </div>

            {/* Calculation Method Button */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Calculation Method</p>
              <button
                onClick={() => setShowMethodModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-[#D5D5D5] transition-colors w-full text-left"
              >
                <img
                  src="/calculation.png"
                  alt="Calculation Method"
                  className="w-5 h-5 object-contain"
                />
                <span className="truncate">{calculationMethods.find(m => m.id === selectedMethod)?.name || 'Muslim World League'}</span>
              </button>
            </div>

            {/* School of Thought Button */}
            <div className="mb-2">
              <p className="text-sm text-gray-600 mb-2">School of Thought</p>
              <button
                onClick={() => setShowSchoolModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-[#D5D5D5] transition-colors w-full text-left"
              >
                <img
                  src={selectedSchool === 0 ? "/shafi.png" : "/hanafi.png"}
                  alt={selectedSchool === 0 ? "Shafi" : "Hanafi"}
                  className="w-5 h-5 object-contain"
                />
                <span>{selectedSchool === 0 ? 'Shafi' : 'Hanafi'}</span>
              </button>
            </div>
          </ButtonGUI>
        </div>

        {/* Prayer Cards */}
        <PrayerCards prayers={prayers} dateInfo={dateInfo} />

        {/* Background Image with Overlay */}
        <div
          ref={backgroundRef}
          className="relative h-60 w-full z-[-2] overflow-hidden mt-[-10rem]"
        >
          <div
            className="absolute pointer-events-none z-10"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              width: '300px',
              height: '300px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(111,98,63,0.6) 0%, rgba(255,150,0,0) 70%)',
              filter: 'blur(70px)',
            }}
          />

          <img
            src="/test.png"
            alt="The Passer-by"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex">
            <img
              src="/caligraphy.png"
              alt="Scrolling overlay"
              className="h-300 w-auto flex-shrink-0 animate-scroll"
            />
            <img
              src="/caligraphy.png"
              alt="Scrolling overlay"
              className="h-300 w-auto flex-shrink-0 animate-scroll"
            />
          </div>
        </div>
      </main>
      <CookieBanner />

      {/* Footer */}
      <div className="w-full h-px bg-gray-300 z-2"></div>
      <footer className="bg-white px-8 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <img
            src="/footerlogo.png"
            alt="The Passer-by"
            className="h-20 w-auto object-contain bottom-4 ml-20 mt-2"
          />

          <div className="flex items-center gap-30">
            <Link to="/privacy" className="text-gray-600 hover:text-gray-800 text-md">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-800 text-md">Terms & Conditions</Link>
          </div>
        </div>
      </footer>

      {/* Calculation Method Modal */}
      {showMethodModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Select Calculation Method</h3>
            <div className="space-y-2">
              {calculationMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    setShowMethodModal(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedMethod === method.id
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-400'
                    : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                  <span className="font-medium text-sm">{method.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMethodModal(false)}
              className="mt-4 w-full py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* School of Thought Modal */}
      {showSchoolModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Select School of Thought</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setSelectedSchool(0);
                  setShowSchoolModal(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedSchool === 0
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-400'
                  : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                <span className="font-medium">Shafi (Standard)</span>
                <p className="text-sm text-gray-600 mt-1">Asr time starts when shadow equals object height</p>
              </button>
              <button
                onClick={() => {
                  setSelectedSchool(1);
                  setShowSchoolModal(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${selectedSchool === 1
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-400'
                  : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                <span className="font-medium">Hanafi</span>
                <p className="text-sm text-gray-600 mt-1">Asr time starts when shadow equals twice object height</p>
              </button>
            </div>
            <button
              onClick={() => setShowSchoolModal(false)}
              className="mt-4 w-full py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;