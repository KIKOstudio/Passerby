import { useEffect, useState } from "react";

const GA_ID = "G-6VN1P5S2PN";

export default function CookieBanner() {
    const [visible, setVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            setTimeout(() => setVisible(true), 1000);
        } else if (consent === "accepted") {
            loadAnalytics();
        }
    }, []);

    const loadAnalytics = () => {
        if (window.gtag) return;
        const script = document.createElement("script");
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        script.async = true;
        document.head.appendChild(script);
        window.dataLayer = window.dataLayer || [];
        function gtag() { window.dataLayer.push(arguments); }
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", GA_ID, { anonymize_ip: true });
    };

    const handleAccept = () => {
        localStorage.setItem("cookie_consent", "accepted");
        loadAnalytics();
        closeBanner();
    };

    const handleDecline = () => {
        localStorage.setItem("cookie_consent", "declined");
        closeBanner();
    };

    const closeBanner = () => {
        setIsLeaving(true);
        setTimeout(() => setVisible(false), 300);
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300">
            <div
                className={`fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[420px] z-50 transition-all duration-300 ease-out ${isLeaving ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
                    }`}
            >
                <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1">Cookie Settings</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                We use cookies to improve your experience and analyze site traffic.
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 bg-[#0C225B] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a3a7a] transition-colors"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={handleDecline}
                                    className="px-4 py-2.5 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}