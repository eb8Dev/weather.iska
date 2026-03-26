import { History } from 'lucide-react';

export default function RecentSearches({ searches, onSelect }) {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-12">
      <div className="flex items-center space-x-2 text-white/90 mb-4 px-2">
        <History size={20} />
        <h3 className="text-xl font-medium">Recent Locations</h3>
      </div>
      
      <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4 snap-x">
        {searches.map((weather) => {
          const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`;
          return (
            <button
              key={weather.id}
              onClick={() => onSelect(weather.name)}
              className="flex-shrink-0 w-48 text-left glass-dark rounded-2xl p-4 hover:bg-white/10 transition-colors snap-start ring-1 ring-white/5"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-white truncate pr-2 w-full">
                  {weather.name}
                </span>
                <img 
                  src={iconUrl} 
                  alt="weather icon" 
                  className="w-8 h-8 -mt-2 -mr-2 shadow-sm"
                />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-white">
                  {Math.round(weather.main.temp)}°
                </span>
                <span className="text-sm text-white/60 capitalize truncate">
                  {weather.weather[0].description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
