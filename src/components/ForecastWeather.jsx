export default function ForecastWeather({ forecast }) {
  if (!forecast || !forecast.list) return null;

  // Group by day to get one forecast per day (around noon)
  const dailyForecasts = forecast.list.filter(item => item.dt_txt.includes('12:00:00'));

  // Fallback in case there are no 12:00:00 (e.g. at end of array), we just take every 8th item
  const displayItems = dailyForecasts.length >= 5 
    ? dailyForecasts.slice(0, 5) 
    : forecast.list.filter((_, idx) => idx % 8 === 0).slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      <h3 className="text-xl font-medium text-white/90 mb-4 px-2">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {displayItems.map((item) => {
          const date = new Date(item.dt * 1000);
          const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
          const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`;

          return (
            <div 
              key={item.dt} 
              className="glass p-4 rounded-3xl flex flex-col items-center justify-center space-y-2 hover:-translate-y-1 transition-transform duration-300 border border-white/10"
            >
              <span className="text-white/80 font-medium">{dayName}</span>
              <img 
                src={iconUrl} 
                alt={item.weather[0].description} 
                className="w-16 h-16 drop-shadow-lg"
              />
              <span className="text-2xl font-bold text-white">
                {Math.round(item.main.temp)}°
              </span>
              <span className="text-xs text-white/60 capitalize text-center leading-tight">
                {item.weather[0].description}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
