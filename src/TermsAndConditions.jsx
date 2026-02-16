import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

// In the nav:
<Navigation mode="dark" />

function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState(null);

  const sections = [
    {
      id: 1,
      title: "Acceptance of Terms",
      content: "By accessing and using The Passer-by prayer times service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
    },
    {
      id: 2,
      title: "Use of Service",
      content: "Our service provides Islamic prayer times based on geographical location. While we strive for accuracy, prayer times are calculated based on astronomical data and may vary. Users are encouraged to verify times with local mosques and scholars."
    },
    {
      id: 3,
      title: "User Responsibilities",
      content: "Users are responsible for ensuring their device's location settings are accurate. The service is provided as-is, and users should exercise their own judgment in utilizing the prayer time information provided."
    },
    {
      id: 4,
      title: "Privacy & Data",
      content: "We collect minimal data necessary to provide accurate prayer times. Location data is used only to calculate prayer times and is not stored by us. However, because Google Analytics is enabled, your information may be processed according to Google’s policies. Please refer to our Privacy Policy for detailed information."
    },
    {
      id: 5,
      title: "Modifications to Service",
      content: "The Passer-by reserves the right to modify or discontinue the service at any time without prior notice. We may also update these terms periodically, and continued use constitutes acceptance of updated terms."
    },
    {
      id: 6,
      title: "Limitation of Liability",
      content: "The Passer-by and its operators shall not be liable for any damages arising from the use or inability to use this service. This includes but is not limited to direct, indirect, incidental, or consequential damages."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative bg-white">
      {/* Top Left Gradient */}
      <img
        src="/customGradient.png"
        alt="Top Left"
        className="absolute top-0 left-0 h-120 w-auto z-0 pointer-events-none"
      />

      {/* Navigation */}
      <Navigation mode="dark" />


      {/* Main Content */}
      <main className="flex-1 z-10 px-8 py-12 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-black">Terms & </span>
            <span className="bg-gradient-to-r from-[#0C225B] to-[#4DACD2] bg-clip-text text-transparent">Conditions</span>
          </h1>
          <p className="text-gray-600 text-lg mt-4">Last updated: February 15, 2026</p>
        </div>

        {/* Introduction Card */}
        <div className="bg-gradient-to-r from-[#3d4b63] to-[#487d91] rounded-2xl p-8 mb-12 text-white">
          <h2 className="text-2xl text-center font-bold mb-4">بسم الله الرحمن الرحيم</h2>
          <p className="text-lg leading-relaxed">
            These terms and conditions outline the rules and regulations for the use of The Passer-by's prayer times service.
            By accessing this service, we assume you accept these terms and conditions in full. Please read them carefully.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-[#D5D5D5] rounded-2xl border-4 border-white overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-[#C5C5C5] transition-colors"
              >
                <h3 className="text-2xl font-bold text-gray-900 text-left">
                  {section.id}. {section.title}
                </h3>
                <svg
                  className={`w-6 h-6 text-gray-900 transition-transform duration-300 ${activeSection === section.id ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${activeSection === section.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="px-8 pb-6 pt-2">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl border-4 border-[#D5D5D5] p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Terms?</h3>
            <p className="text-gray-600 text-lg mb-6">
              If you have any questions about these Terms and Conditions, please contact us.
            </p>
            <button className="bg-gradient-to-r from-[#0C225B] to-[#4DACD2] text-white px-8 py-3 rounded-lg text-lg font-medium hover:opacity-90 transition-opacity">
              Contact Us
            </button>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="relative mt-20 h-40 overflow-hidden rounded-2xl">
          <img
            src="/test.png"
            alt="Decorative"
            className="h-full w-full object-cover opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/caligraphy.png"
              alt="Calligraphy"
              className="h-200 w-auto animate-scroll opacity-60"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="w-full h-px bg-gray-300 z-10"></div>
      <Footer />
    </div>
  );
}

export default TermsAndConditions;