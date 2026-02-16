import { Link } from 'react-router-dom';
export default function Footer() {
    return (
        <div className="relative z-10">
            {/* Thin Line Above Footer */}
            <div className="w-full h-px bg-gray-300 z-2"></div>
            <footer className="bg-white px-8 py-4">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    {/* Bottom Left Logo */}
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
        </div>
    );
}
