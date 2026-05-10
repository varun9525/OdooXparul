import { useEffect, useState } from "react";
import { Loader2, Map as MapIcon } from "lucide-react";

export const DestinationMap = ({ destination }: { destination: string }) => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`);
        const geoData = await geoRes.json();
        
        if (geoData.results && geoData.results.length > 0) {
          setCoords({
            lat: geoData.results[0].latitude,
            lon: geoData.results[0].longitude
          });
        }
      } catch (error) {
        console.error("Failed to fetch coordinates for map", error);
      } finally {
        setLoading(false);
      }
    };

    if (destination) fetchCoords();
  }, [destination]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-slate-200 bg-white/40 dark:border-white/10 dark:bg-white/5">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!coords) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/40 text-slate-500 dark:border-white/15 dark:bg-white/5 dark:text-white/50">
        <MapIcon className="mb-2 h-8 w-8 opacity-50" />
        <p className="text-sm font-semibold">Map unavailable for this destination</p>
      </div>
    );
  }

  const zoom = 0.05;
  const bbox = `${coords.lon - zoom},${coords.lat - zoom},${coords.lon + zoom},${coords.lat + zoom}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lon}`;

  return (
    <div className="h-64 md:h-full min-h-[300px] w-full overflow-hidden rounded-3xl border border-slate-200 shadow-xl dark:border-white/10 relative group">
      <div className="absolute top-4 left-4 z-10 rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 shadow-sm text-xs font-bold text-slate-700 flex items-center gap-2">
        <MapIcon className="h-3 w-3" />
        Interactive Map
      </div>
      <iframe
        width="100%"
        height="100%"
        src={mapUrl}
        className="border-none grayscale-[20%] transition-all duration-700 group-hover:grayscale-0"
        title={`Map of ${destination}`}
      />
    </div>
  );
};
