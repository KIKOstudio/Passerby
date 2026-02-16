import { Link } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';

function PrivacyPolicy() {
    const sections = [
        {
            id: 1,
            title: "Information We Collect",
            content: "Users may manually select a location or choose to allow browser-based geolocation access. If geolocation is enabled, your browser may provide approximate geographic coordinates. This information is used solely to calculate accurate prayer times and is not stored on our servers. We use browser local storage to remember your selected location, calculation method, and school of thought preferences. This information remains on your device, is not transmitted to us and can be cleared at any time through your browser settings."
        },
        {
            id: 2,
            title: "Analytics and Third-Party Services",
            content: "We use services provided by Google: Google Analytics and Google Search Console. These services help us understand website traffic and improve user experience. Google may collect: IP address, browser and device information, cookies and usage data. Google processes data according to its own Privacy Policy: \nhttps://policies.google.com/privacy\n We do not control how Google processes this information."
        },
        {
            id: 3,
            title: "Cookies",
            content: "Our website uses cookies through Google Analytics to analyze website usage. You may disable cookies through your browser settings."
        },
        {
            id: 4,
            title: "Contact & Feedback Forms",
            content: "If you voluntarily submit information through our forms, we collect the information you provide, including your name, email address, and message content. This information is used solely to respond to your inquiry or feedback. We do not sell personal information nor do we share personal information for advertising"
        },
        {
            id: 5,
            title: "Data Retention",
            content: "Contact form submissions are retained only as long as necessary to respond to your inquiry or maintain reasonable records. Analytics data retention is managed by Google according to their policies."
        },
        {
            id: 6,
            title: "Your Rights and Choices",
            content: "You have the right to control your personal information. You can disable location services at any time through your device settings. You may also clear your browser's local storage to remove any saved preferences. If you have concerns about how your data is handled, you have the right to request information about data processing activities related to your use of our service."
        },
        {
            id: 7,
            title: "Changes to This Policy",
            content: "We may update this Privacy Policy from time to time. Updates should be reflected on this page with a revised effective date."
        },
        {
            id: 8,
            title: "Contact Information",
            content: "If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please feel free to contact us and we will address your privacy concerns and ensuring your information is handled with the utmost care and respect."
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
                        <span className="text-black">Privacy </span>
                        <span className="bg-gradient-to-r from-[#0C225B] to-[#4DACD2] bg-clip-text text-transparent">Policy</span>
                    </h1>
                    <p className="text-gray-600 text-lg mt-4">Last updated: February 15, 2026</p>
                </div>

                {/* Introduction Card */}
                <div className="bg-gradient-to-r  from-[#3d4b63] to-[#487d91] rounded-2xl p-8 mb-12 text-white">
                    <h2 className="text-2xl text-center font-bold mb-4">بسم الله الرحمن الرحيم</h2>
                    <p className="text-lg leading-relaxed">
                        The Passer-by (عابر سبيل) is a web-based service that provides prayer times based on your selected or detected location if granted permission.
                        Protecting your privacy is a top priority.
                        This Privacy Policy explains how we collect, use, and safeguard your information when you use the prayer times service.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-8">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-[#D5D5D5] rounded-2xl border-4 border-white p-8"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {section.id}. {section.title}
                            </h3>
                            <p className="text-gray-800 text-lg leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Important Notice */}
                <div className="mt-16 bg-white rounded-2xl border-4 border-[#D5D5D5] p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Trust is Important to Us</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        We are dedicated to maintaining the highest standards of privacy and data protection.
                        By using The Passer-by, you acknowledge that you have read and understood this Privacy Policy.
                        Your continued use of our service constitutes acceptance of these practices.
                    </p>
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
            <Footer/>
        </div>
    );
}

export default PrivacyPolicy;