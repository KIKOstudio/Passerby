import { useState, useEffect } from 'react';

const convertTo12Hour = (time24) => {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const getCurrentPrayerState = (prayers) => {
  if (!prayers || prayers.length === 0) return null;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;

  // Sort prayers by time to ensure correct order
  const sortedPrayers = [...prayers].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

  for (let i = 0; i < sortedPrayers.length; i++) {
    const current = sortedPrayers[i];
    const next = sortedPrayers[i + 1] || sortedPrayers[0];
    const currentMinutes = timeToMinutes(current.time);
    const nextMinutes = timeToMinutes(next.time);

    // Handle day wrap for next prayer
    const adjustedNextMinutes = nextMinutes > currentMinutes ? nextMinutes : nextMinutes + 24 * 60;
    const adjustedNow = nowMinutes >= currentMinutes ? nowMinutes : nowMinutes + 24 * 60;

    // Check if we're within 20 minutes of current prayer start
    if (adjustedNow >= currentMinutes && adjustedNow < currentMinutes + 20) {
      return {
        type: 'grace',
        currentPrayer: current,
        nextPrayer: next,
        displayPrayer: current
      };
    }

    // Check if we're between this prayer's grace period and next prayer
    if (adjustedNow >= currentMinutes + 20 && adjustedNow < adjustedNextMinutes) {
      return {
        type: 'countdown',
        currentPrayer: current,
        nextPrayer: next,
        displayPrayer: next,
        timeUntilNext: adjustedNextMinutes - adjustedNow
      };
    }
  }

  // Default: show first prayer (before Fajr)
  return {
    type: 'countdown',
    currentPrayer: sortedPrayers[sortedPrayers.length - 1],
    nextPrayer: sortedPrayers[0],
    displayPrayer: sortedPrayers[0],
    timeUntilNext: timeToMinutes(sortedPrayers[0].time) - nowMinutes + (nowMinutes > timeToMinutes(sortedPrayers[0].time) ? 24 * 60 : 0)
  };
};

const formatTime = (hours, minutes, seconds) => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const PrayerCard = ({ name, time }) => (
  <div className="bg-[#D5D5D5] rounded-2xl relative bottom-13 px-8 py-10 text-center min-w-[201px] min-h-[146px] border-6 border-white">
    <div className="font-bold text-[#2C2C2C] mb-1 text-2xl">{name}</div>
    <div className="text-gray-900 text-xl">{convertTo12Hour(time)}</div>
  </div>
);

const UpcomingPrayerCard = ({ prayers, dateInfo }) => {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isGrace: false,
    prayerName: '',
    prayerTime: ''
  });

  useEffect(() => {
    if (!prayers || prayers.length === 0) return;

    const updateCountdown = () => {
      const state = getCurrentPrayerState(prayers);

      if (!state) return;

      if (state.type === 'grace') {
        setCountdown({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isGrace: true,
          prayerName: state.displayPrayer.name,
          prayerTime: state.displayPrayer.time
        });
      } else {
        const totalSeconds = Math.floor(state.timeUntilNext * 60);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setCountdown({
          hours,
          minutes,
          seconds,
          isGrace: false,
          prayerName: state.displayPrayer.name,
          prayerTime: state.displayPrayer.time
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [prayers]);

  if (!prayers || prayers.length === 0) return null;

  return (
    <div className="relative ml-10">
      <div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-[-1]"
        style={{
          width: '0',
          height: '0',
          borderLeft: '360px solid transparent',
          borderRight: '360px solid transparent',
          borderTop: '500px solid white',
        }}
      />

      <div className="relative bg-[#D5D5D5] rounded-2xl top-8 px-9 py-4 text-center min-w-[313px] min-h-[216px] border-6 border-white z-10">
        <div className='text-xl font-light'>
          {countdown.isGrace ? 'Current Prayer' : 'Upcoming Prayer'}
        </div>
        <div className="text-2xl font-bold text-[#2C2C2C] mb-2">
          {countdown.prayerName}
        </div>

        <div className={`font-bold text-4xl m-3 ${countdown.isGrace ? 'text-gray-500' : 'text-gray-700'}`}>
          {formatTime(countdown.hours, countdown.minutes, countdown.seconds)}
        </div>

        <div className="text-[#2C2C2C] text-xl py-3 font-bold">
          {
            convertTo12Hour(countdown.prayerTime)
          }
        </div>
      </div>

      <div className="text-center pt-20 text-[#2C2C2C]">
        <div className="text-lg font-extralight">{dateInfo?.gregorian || ''}</div>
        <div className="font-bold text-lg">{dateInfo?.hijri || ''}</div>
      </div>
    </div>
  );
};



const PrayerCards = ({ prayers, dateInfo }) => {
  if (!prayers || prayers.length === 0) return null;

  const state = getCurrentPrayerState(prayers);
  const highlightedName = state?.displayPrayer?.name || prayers[0]?.name;

  return (
    <div className="flex flex-wrap justify-center items-end gap-10 max-w-10xl mx-auto">
      {prayers.map(prayer => {
        if (!prayer) return null;
        return prayer.name === highlightedName ? (
          <UpcomingPrayerCard
            key={prayer.name}
            prayers={prayers}
            dateInfo={dateInfo}
          />
        ) : (
          <PrayerCard
            key={prayer.name}
            name={prayer.name}
            time={prayer.time}
          />
        );
      })}
    </div>
  );
};

export default PrayerCards;