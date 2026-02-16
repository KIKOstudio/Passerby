import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

const getPrayerTimes = async (city, country, date = null) => {
  const today = date || new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');
  const url = `https://api.aladhan.com/v1/timingsByCity/${today}?city=${encodeURIComponent(city)}&country=${country}&method=3`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.code === 200) return data.data;
    throw new Error(data.status);
  } catch (error) {
    console.error('Prayer API Error:', error);
    throw error;
  }
};

const citiesByCountry = {
  AE: ["Dubai", "Abu Dhabi", "Sharjah"],
  SA: ["Mecca", "Medina", "Riyadh", "Jeddah"],
  KW: ["Kuwait City", "Al Ahmadi"],
  QA: ["Doha", "Al Rayyan"],
  BH: ["Manama", "Riffa"],
  OM: ["Muscat", "Salalah"],
  JO: ["Amman", "Aqaba"],
  IQ: ["Baghdad", "Basra"],
  SY: ["Damascus", "Aleppo"],
  LB: ["Beirut", "Tripoli"],
  PS: ["Gaza", "Ramallah"],
  YE: ["Sanaa", "Aden"],
  US: ["New York", "Los Angeles", "Chicago"],
  CA: ["Toronto", "Vancouver", "Montreal"],
  GB: ["London", "Manchester", "Birmingham"],
  FR: ["Paris", "Marseille"],
  DE: ["Berlin", "Munich"],
  IT: ["Rome", "Milan"],
  ES: ["Madrid", "Barcelona"],
  TR: ["Istanbul", "Ankara"],
  PK: ["Karachi", "Lahore", "Islamabad"],
  IN: ["Mumbai", "Delhi", "Bangalore"],
  BD: ["Dhaka", "Chittagong"],
  ID: ["Jakarta", "Surabaya"],
  MY: ["Kuala Lumpur", "George Town"],
  EG: ["Cairo", "Alexandria"],
  MA: ["Casablanca", "Rabat"],
  AU: ["Sydney", "Melbourne"]
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const glassVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 30
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 20,
      duration: 0.8
    }
  }
};

const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

function FindPrayerTimes() {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    setIsReady(true);
  }, []);

  const regions = [
    {
      name: "Middle East",
      countries: [
        { name: "United Arab Emirates", code: "AE" },
        { name: "Saudi Arabia", code: "SA" },
        { name: "Kuwait", code: "KW" },
        { name: "Qatar", code: "QA" },
        { name: "Bahrain", code: "BH" },
        { name: "Oman", code: "OM" },
        { name: "Jordan", code: "JO" },
        { name: "Iraq", code: "IQ" },
        { name: "Syria", code: "SY" },
        { name: "Lebanon", code: "LB" },
        { name: "Palestine", code: "PS" },
        { name: "Yemen", code: "YE" }
      ]
    },
    {
      name: "North America",
      countries: [
        { name: "United States", code: "US" },
        { name: "Canada", code: "CA" }
      ]
    },
    {
      name: "Europe",
      countries: [
        { name: "United Kingdom", code: "GB" },
        { name: "France", code: "FR" },
        { name: "Germany", code: "DE" },
        { name: "Italy", code: "IT" },
        { name: "Spain", code: "ES" },
        { name: "Turkey", code: "TR" }
      ]
    },
    {
      name: "Asia",
      countries: [
        { name: "Pakistan", code: "PK" },
        { name: "India", code: "IN" },
        { name: "Bangladesh", code: "BD" },
        { name: "Indonesia", code: "ID" },
        { name: "Malaysia", code: "MY" }
      ]
    },
    {
      name: "Africa",
      countries: [
        { name: "Egypt", code: "EG" },
        { name: "Morocco", code: "MA" }
      ]
    },
    {
      name: "Oceania",
      countries: [
        { name: "Australia", code: "AU" }
      ]
    }
  ];

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSearchQuery('');
    setError(null);
  };

  const handleCitySelect = async (city) => {
    setLoading(true);
    setError(null);

    try {
      await getPrayerTimes(city, selectedCountry.code);

      const locationData = {
        city: city,
        country: selectedCountry.code,
        countryName: selectedCountry.name,
        flag: selectedCountry.code
      };
      localStorage.setItem('prayerLocation', JSON.stringify(locationData));
      navigate('/home');
    } catch (err) {
      setError(`Failed to find ${city}. Try another.`);
      setLoading(false);
    }
  };

  const filteredCities = selectedCountry
    ? (citiesByCountry[selectedCountry.code] || []).filter(city =>
      city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  const allCountries = regions.flatMap(r => r.countries);
  const filteredCountries = searchQuery && !selectedCountry
    ? allCountries.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Image with fade in */}
      <motion.div 
        className="fixed inset-0 z-0"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <img
          src="/customBG.png"
          alt="Background"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Top Left Image with slide in */}
      <motion.img
        src="/customGradient.png"
        alt="Top Left"
        className="absolute top-0 left-0 h-[440px] w-auto z-10 pointer-events-none"
        initial={{ opacity: 0, x: -100, y: -50 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
      />

      {/* Navigation */}
      <Navigation mode="light" />

      {/* Main Content */}
      <main className="flex-1 z-10 flex items-center justify-center px-4 py-12">
        {/* Glass Container */}
        <motion.div 
          className="relative w-[900px] h-[600px]"
          variants={glassVariants}
          initial="hidden"
          animate={isReady ? "visible" : "hidden"}
        >
          {/* Glass Background Layer */}
          <motion.div 
            className="absolute inset-0 
              bg-gradient-to-br from-[#2B708E]/20 to-white/20
              backdrop-blur-xl 
              rounded-[32px] 
              border border-white/30 
              shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />

          {/* Gray Content Box */}
          <motion.div 
            className="absolute inset-[24px] bg-[#F0F0F0] rounded-[24px] overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* Header */}
            <motion.div 
              className="flex items-center justify-between px-8 pt-6 pb-4 flex-none"
              variants={containerVariants}
              initial="hidden"
              animate={isReady ? "visible" : "hidden"}
            >
              <motion.h2 
                className="text-2xl font-bold text-gray-800"
                variants={slideInVariants}
              >
                {selectedCountry ? selectedCountry.name : 'Find Prayer Times'}
              </motion.h2>

              {/* Search Bar */}
              <motion.div 
                className="relative w-[200px]"
                variants={itemVariants}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-2 rounded-full bg-white/40 backdrop-blur-sm border border-white/50 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400/50 text-sm transition-all duration-300 focus:scale-105"
                />
                <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.div>

              {/* Info Icon */}
              <motion.div 
                className="relative flex items-center gap-2 text-xs text-gray-600 group"
                variants={itemVariants}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>PRAYER TIMES</span>
                <div className="absolute top-full left-1/2 transform -translate-x-3/4 mt-2 w-max max-w-[12rem] bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-[-4px] z-10">
                  Adjust time method/school in Home Settings.
                  To get accurate times, allow permission to access location or select city manually.
                </div>
              </motion.div>
            </motion.div>

            {/* Back Button */}
            <AnimatePresence mode="wait">
              {selectedCountry && (
                <motion.div 
                  className="px-8 pb-2 flex-none"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    onClick={() => {
                      setSelectedCountry(null);
                      setSearchQuery('');
                      setError(null);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1 transition-colors hover:gap-2"
                  >
                    ← Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="px-8 pb-2 flex-none"
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-3 bg-red-100/80 backdrop-blur-sm text-red-700 rounded-lg text-sm text-center">
                    {error}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading */}
            <AnimatePresence>
              {loading && (
                <motion.div 
                  className="px-8 pb-2 text-center flex-none"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-700"></div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-6">
              <AnimatePresence mode="wait">
                {!selectedCountry ? (
                  <motion.div 
                    key="countries"
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {filteredCountries ? (
                      <motion.div 
                        className="grid grid-cols-3 gap-3"
                        variants={containerVariants}
                      >
                        {filteredCountries.map((country, idx) => (
                          <motion.button
                            key={idx}
                            onClick={() => handleCountrySelect(country)}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all text-left group hover:scale-105 hover:shadow-lg"
                            variants={itemVariants}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span className="text-xs font-bold text-gray-600 bg-white/50 px-2 py-1 rounded">
                              {country.code}
                            </span>
                            <span className="text-gray-800 font-medium text-sm">{country.name}</span>
                          </motion.button>
                        ))}
                      </motion.div>
                    ) : (
                      regions.map((region, idx) => (
                        <motion.div 
                          key={idx}
                          variants={itemVariants}
                        >
                          <h3 className="text-lg font-bold text-gray-800 mb-3">{region.name}</h3>
                          <div className="grid grid-cols-3 gap-3">
                            {region.countries.map((country, cidx) => (
                              <motion.button
                                key={cidx}
                                onClick={() => handleCountrySelect(country)}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all text-left group"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 + cidx * 0.05 }}
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span className="text-xs font-bold text-gray-600 bg-white/50 px-2 py-1 rounded">
                                  {country.code}
                                </span>
                                <span className="text-gray-800 font-medium text-sm">{country.name}</span>
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="cities"
                    className="grid grid-cols-3 gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 20 }}
                  >
                    {filteredCities.map((city, idx) => (
                      <motion.button
                        key={idx}
                        onClick={() => handleCitySelect(city)}
                        disabled={loading}
                        className="p-3 rounded-xl bg-white/30 hover:bg-white/50 transition-all text-left disabled:opacity-50"
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="text-gray-800 font-medium text-sm">{city}</span>
                      </motion.button>
                    ))}
                    {filteredCities.length === 0 && searchQuery && (
                      <motion.button
                        onClick={() => handleCitySelect(searchQuery)}
                        disabled={loading}
                        className="col-span-3 p-3 rounded-xl bg-blue-100/50 hover:bg-blue-200/50 transition-all text-center"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-blue-800 font-medium text-sm">Search for "{searchQuery}"</span>
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <Footer/>
      </motion.div>
    </div>
  );
}

export default FindPrayerTimes;