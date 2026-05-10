import { useEffect, useState } from "react";
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun, Loader2 } from "lucide-react";

const getWeatherIcon = (code: number) => {
  if (code === 0 || code === 1) return <Sun className="h-6 w-6 text-amber-500" />;
  if (code === 2 || code === 3) return <Cloud className="h-6 w-6 text-slate-400" />;
  if (code >= 45 && code <= 48) return <Cloud className="h-6 w-6 text-slate-300" />;
  if (code >= 51 && code <= 57) return <CloudDrizzle className="h-6 w-6 text-blue-400" />;
  if (code >= 61 && code <= 67) return <CloudRain className="h-6 w-6 text-blue-500" />;
  if (code >= 71 && code <= 77) return <CloudSnow className="h-6 w-6 text-slate-200" />;
  if (code >= 80 && code <= 82) return <CloudRain className="h-6 w-6 text-blue-600" />;
  if (code >= 95 && code <= 99) return <CloudLightning className="h-6 w-6 text-yellow-500" />;
  return <Sun className="h-6 w-6 text-amber-500" />;
};

const getWeatherDescription = (code: number) => {
  if (code === 0) return "Clear sky";
  if (code === 1 || code === 2 || code === 3) return "Partly cloudy";
  if (code >= 45 && code <= 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 95 && code <= 99) return "Thunderstorm";
  return "Sunny";
};

export const WeatherWidget = ({ destination }: { destination: string }) => {
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // 1. Get Lat/Lon
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`);
        const geoData = await geoRes.json();
        
        if (!geoData.results || geoData.results.length === 0) {
          setLoading(false);
          return;
        }

        const { latitude, longitude } = geoData.results[0];

        // 2. Get Weather
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weatherData = await weatherRes.json();
        
        if (weatherData.daily) {
          setForecast(weatherData.daily);
        }
      } catch (error) {
        console.error("Failed to fetch weather", error);
      } finally {
        setLoading(false);
      }
    };

    if (destination) {
      fetchWeather();
    }
  }, [destination]);

  if (loading) return <div className="flex h-24 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md"><Loader2 className="h-6 w-6 animate-spin text-white" /></div>;
  if (!forecast) return null;

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md text-white">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-white/70">Upcoming Forecast</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {forecast.time.slice(0, 5).map((date: string, index: number) => (
          <div key={date} className="flex min-w-[80px] flex-col items-center justify-center rounded-xl bg-slate-900/40 p-3 shadow-inner">
            <span className="mb-2 text-xs font-semibold text-white/60">
              {new Date(date).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            {getWeatherIcon(forecast.weathercode[index])}
            <span className="mt-2 text-sm font-bold">{Math.round(forecast.temperature_2m_max[index])}°C</span>
            <span className="text-xs text-white/50">{Math.round(forecast.temperature_2m_min[index])}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
};
