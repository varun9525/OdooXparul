import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { mockTrips } from '../data';
import { motion, useScroll, useTransform } from 'motion/react';
import { MapPin, Calendar, Compass } from 'lucide-react';
import { format } from 'date-fns';

export function ShareTrip() {
  const { id } = useParams();
  const trip = mockTrips.find(t => t.id === id);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // We add a class to body just for this page to allow scrolling
    document.body.style.overflowY = 'auto';
    return () => { document.body.style.overflowY = ''; };
  }, []);

  if (!trip) return <div className="min-h-screen bg-[#0f1115] text-white flex items-center justify-center">Trip not found</div>;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-white overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <div className="h-screen w-full relative overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 bg-cover bg-center"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="absolute inset-0" style={{ backgroundImage: `url(${trip.imageUrl})` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f1115]/60 to-[#0f1115]" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-heavy text-indigo-300 font-medium tracking-widest uppercase text-sm mb-6 shadow-xl"
          >
            <Compass className="w-4 h-4" />
            Traveloop Shared Trip
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black mb-6 tracking-tighter"
          >
            {trip.title}
          </motion.h1>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6 text-xl text-gray-300"
          >
            <div className="flex items-center gap-2"><MapPin className="w-6 h-6 text-indigo-400" /> {trip.destination}</div>
            <div className="hidden md:block w-2 h-2 rounded-full bg-gray-600" />
            <div className="flex items-center gap-2"><Calendar className="w-6 h-6 text-indigo-400" /> {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}</div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={copyLink}
            className="mt-12 px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors"
          >
            {copied ? 'Link Copied!' : 'Copy Share Link'}
          </motion.button>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="max-w-4xl mx-auto px-6 py-24 relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">The Journey</h2>
          <p className="text-gray-400 text-lg">A day-by-day breakdown of this adventure.</p>
        </div>

        <div className="space-y-12">
          {trip.itinerary.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="flex flex-col md:flex-row gap-8 items-start group"
            >
              {/* Date/Time Node */}
              <div className="shrink-0 w-32 md:text-right pt-4">
                <div className="text-xl font-bold text-indigo-400">{format(new Date(item.date), 'MMM d')}</div>
                <div className="text-gray-500">{item.time}</div>
              </div>

              {/* Connector line - hidden on mobile */}
              <div className="hidden md:flex flex-col items-center self-stretch relative">
                <div className="w-4 h-4 rounded-full border-4 border-indigo-500 bg-[#0f1115] z-10 mt-5 group-hover:scale-150 transition-transform" />
                <div className="absolute top-9 bottom-[-3rem] w-0.5 bg-gray-800 group-last:hidden" />
              </div>

              {/* Card */}
              <div className="flex-1 glass-panel-heavy rounded-3xl p-8 card-3d-hover hover:bg-white/5 transition-colors">
                <div className="text-sm text-gray-400 mb-2 uppercase tracking-wider">{item.location}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-300 leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
          {trip.itinerary.length === 0 && (
            <div className="text-center text-gray-500 py-10">No itinerary planned yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}