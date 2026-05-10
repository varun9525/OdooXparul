import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { Edit3, Loader2, Save, X, Award, Map, Star, Plane, Briefcase, Info } from "lucide-react";
import { useNavigate } from "react-router";
import { tripAPI, Trip } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { ProfileSkeleton } from "../components/ui/Skeleton";

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
  });
  const [showBadgeInfo, setShowBadgeInfo] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await tripAPI.getTrips();
        setTrips(response.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
      avatarUrl: user?.avatarUrl || "",
    });
  }, [user]);

  const stats = useMemo(() => {
    return {
      trips: trips.length,
      destinations: new Set(trips.map((trip) => trip.destination.toLowerCase())).size,
      budget: trips.reduce((sum, trip) => sum + Number(trip.totalBudget || 0), 0),
    };
  }, [trips]);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await updateProfile(form.firstName, form.lastName, form.bio, form.avatarUrl);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || user?.username || "Traveler";

  if (loading) {
    return <ProfileSkeleton />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-5xl space-y-8 py-4 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-xl backdrop-blur-2xl dark:border-white/20 dark:bg-white/10 md:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          <div className="relative z-10 h-32 w-32 flex-shrink-0 overflow-hidden rounded-full border-4 border-indigo-100 shadow-2xl dark:border-indigo-500/50 md:h-40 md:w-40">
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1664871475935-39a9b861514f?q=80&w=400"}
              alt={displayName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative z-10 flex-1">
            {!editing ? (
              <>
                <h1 className="mb-2 text-4xl font-black text-slate-800 dark:text-white">{displayName}</h1>
                <p className="mb-3 text-lg font-medium text-slate-500 dark:text-white/60">{user?.email}</p>
                <p className="mb-8 max-w-2xl text-slate-600 dark:text-white/60">{user?.bio || "No bio added yet."}</p>
                <button onClick={() => setEditing(true)} className="inline-flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-5 py-3 font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20">
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={saveProfile} className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First name" className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" className="rounded-xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-500 dark:text-white/60 pl-1">Profile Picture</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setForm({ ...form, avatarUrl: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }} 
                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-2 font-semibold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition-all cursor-pointer" 
                  />
                </div>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" rows={4} className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold dark:border-white/10 dark:bg-white/5 dark:text-white" />
                <div className="flex gap-3">
                  <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white disabled:opacity-60">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </button>
                  <button type="button" onClick={() => setEditing(false)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 font-bold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white">
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["Trips", stats.trips],
            ["Destinations", stats.destinations],
            ["Planned Budget", stats.budget],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm dark:border-white/10 dark:bg-white/5">
              <h4 className="mb-1 text-3xl font-black text-indigo-600 dark:text-indigo-400">{value}</h4>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/60">{label}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 relative">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-xl font-black text-slate-800 dark:text-white">
              <Award className="h-6 w-6 text-yellow-500" /> Traveler Badges
            </h3>
            <button 
              onClick={() => setShowBadgeInfo(!showBadgeInfo)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20 dark:hover:text-white"
            >
              <Info className="h-4 w-4" />
            </button>
          </div>

          {showBadgeInfo && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5 dark:border-indigo-500/30 dark:bg-indigo-500/10"
            >
              <h4 className="mb-3 font-black text-indigo-900 dark:text-indigo-200">How to earn badges:</h4>
              <ul className="space-y-2 text-sm font-semibold text-slate-700 dark:text-white/70">
                <li className="flex items-center gap-2"><Star className="h-4 w-4 text-yellow-500" /> <strong className="text-slate-900 dark:text-white">First Journey:</strong> Create your first trip.</li>
                <li className="flex items-center gap-2"><Plane className="h-4 w-4 text-indigo-500" /> <strong className="text-slate-900 dark:text-white">Globetrotter:</strong> Plan at least 3 total trips.</li>
                <li className="flex items-center gap-2"><Map className="h-4 w-4 text-rose-500" /> <strong className="text-slate-900 dark:text-white">Explorer:</strong> Visit 3 or more unique destinations.</li>
                <li className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-emerald-500" /> <strong className="text-slate-900 dark:text-white">High Roller:</strong> Plan trips with a combined total budget over $5,000.</li>
              </ul>
            </motion.div>
          )}

          <div className="flex flex-wrap gap-4">
            {stats.trips >= 1 ? (
              <div className="flex items-center gap-3 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 dark:border-yellow-500/30 dark:bg-yellow-500/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white"><Star className="h-4 w-4" /></div>
                <div><p className="text-sm font-bold text-yellow-700 dark:text-yellow-300">First Journey</p></div>
              </div>
            ) : <p className="text-sm text-slate-400">Create your first trip to earn a badge!</p>}
            
            {stats.trips >= 3 && (
              <div className="flex items-center gap-3 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white"><Plane className="h-4 w-4" /></div>
                <div><p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Globetrotter</p></div>
              </div>
            )}
            
            {stats.destinations >= 3 && (
              <div className="flex items-center gap-3 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 dark:border-rose-500/30 dark:bg-rose-500/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white"><Map className="h-4 w-4" /></div>
                <div><p className="text-sm font-bold text-rose-700 dark:text-rose-300">Explorer</p></div>
              </div>
            )}

            {stats.budget > 5000 && (
              <div className="flex items-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white"><Briefcase className="h-4 w-4" /></div>
                <div><p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">High Roller</p></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-black text-slate-800 dark:text-white">Your Trips</h2>
        {loading ? (
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {trips.map((trip) => (
              <motion.button key={trip.id} whileHover={{ y: -5 }} onClick={() => navigate(`/trips/${trip.id}`)} className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-3xl border border-slate-200 bg-slate-900 p-6 text-left shadow-lg dark:border-white/10">
                <img src={trip.imageUrl || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800"} alt={trip.title} className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:scale-110 group-hover:opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="relative z-10">
                  <h4 className="mb-1 text-xl font-black text-white">{trip.title}</h4>
                  <p className="text-sm font-semibold text-white/70">{trip.destination}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
