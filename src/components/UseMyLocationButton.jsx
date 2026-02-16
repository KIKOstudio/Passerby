import { useState } from "react";

function UseMyLocationButton({ setLocation, fetchPrayerTimes, selectedMethod, selectedSchool }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUseLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by this browser.");
            return;
        }

        setError("");
        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;

                    const geoRes = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                    );
                    const geoData = await geoRes.json();

                    const city =
                        geoData.address.city ||
                        geoData.address.town ||
                        geoData.address.village ||
                        "Unknown";

                    const countryName = geoData.address.country || "Unknown";
                    const countryCode = geoData.address.country_code?.toUpperCase() || "";

                    const newLocation = {
                        city,
                        country: countryCode,
                        countryName,
                        flag: "/pinpoint.png"
                    };

                    setLocation(newLocation);
                    localStorage.setItem("prayerLocation", JSON.stringify(newLocation));
                    await fetchPrayerTimes(city, countryCode, selectedMethod, selectedSchool);

                } catch (err) {
                    setError("Unable to detect your location.");
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError("Location access must be granted to detect your position.");
                setLoading(false);
            }
        );
    };

    return (
        <div className="w-full">
            <button
                onClick={handleUseLocation}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition disabled:opacity-50"
            >
                {loading ? "Detecting..." : (
                    <span className="flex items-center gap-2">
                        <img src="/pinpoint.png" alt="Location" className="w-5 h-5 object-contain" />
                        Use My Current Location
                    </span>
                )}      </button>

            {error && (
                <p className="text-xs text-red-500 mt-2 text-center">
                    {error}
                </p>
            )}
        </div>
    );
}

export default UseMyLocationButton;
