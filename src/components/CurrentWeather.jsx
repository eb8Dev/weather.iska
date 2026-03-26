import { Cloud, Droplets, Wind, MapPin, Eye, Thermometer } from 'lucide-react';

export default function CurrentWeather({ weather }) {
  if (!weather) return null;

  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity, pressure },
    wind: { speed },
    weather: details,
    visibility
  } = weather;

  const weatherDetail = details[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weatherDetail.icon}@4x.png`;

  return (
    <div className="glass rounded-3xl p-8 w-full max-w-4xl mx-auto text-white mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left Section: Temperature and Icon */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
            <MapPin size={18} className="text-blue-300" />
            <h2 className="text-xl font-medium tracking-wide">{name}, {country}</h2>
          </div>
          
          <div className="flex items-center">
            <img 
              src={iconUrl} 
              alt={weatherDetail.description} 
              className="w-32 h-32 object-contain drop-shadow-2xl filter"
            />
            <div className="flex flex-col ml-4">
              <span className="text-7xl font-bold tracking-tighter">
                {Math.round(temp)}°
              </span>
              <span className="text-xl text-white/80 capitalize font-medium">
                {weatherDetail.description}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Details Grid */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          
          <div className="bg-white/10 p-4 rounded-2xl flex items-center space-x-4 border border-white/5 hover:bg-white/20 transition-colors">
            <div className="p-3 bg-blue-500/30 rounded-full text-blue-200">
              <Thermometer size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Feels Like</p>
              <p className="text-lg font-semibold">{Math.round(feels_like)}°</p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl flex items-center space-x-4 border border-white/5 hover:bg-white/20 transition-colors">
            <div className="p-3 bg-cyan-500/30 rounded-full text-cyan-200">
              <Droplets size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Humidity</p>
              <p className="text-lg font-semibold">{humidity}%</p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl flex items-center space-x-4 border border-white/5 hover:bg-white/20 transition-colors">
            <div className="p-3 bg-green-500/30 rounded-full text-green-200">
              <Wind size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Wind</p>
              <p className="text-lg font-semibold">{Math.round(speed * 3.6)} km/h</p>
            </div>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl flex items-center space-x-4 border border-white/5 hover:bg-white/20 transition-colors">
            <div className="p-3 bg-purple-500/30 rounded-full text-purple-200">
              <Eye size={24} />
            </div>
            <div>
              <p className="text-sm text-white/60">Visibility</p>
              <p className="text-lg font-semibold">{(visibility / 1000).toFixed(1)} km</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
