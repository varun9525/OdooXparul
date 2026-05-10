import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart, Loader2, MessageSquare, Plus, Share2 } from "lucide-react";
import { communityAPI, CommunityPost } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Skeleton } from "../components/ui/Skeleton";

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", destination: "", content: "" });
  const [showForm, setShowForm] = useState(false);

  const loadPosts = async () => {
    const response = await communityAPI.getPosts();
    setPosts(response.data);
  };

  useEffect(() => {
    loadPosts().finally(() => setLoading(false));
    const interval = window.setInterval(loadPosts, 20000);
    return () => window.clearInterval(interval);
  }, []);

  const createPost = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    await communityAPI.createPost(form);
    setForm({ title: "", destination: "", content: "" });
    setShowForm(false);
    await loadPosts();
  };

  const likePost = async (postId: string) => {
    await communityAPI.likePost(postId);
    await loadPosts();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-4xl space-y-8 py-4 pb-12">
      <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-transparent dark:bg-transparent dark:shadow-none md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Community</h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-white/55">Live posts from Traveloop users.</p>
        </div>
        <button onClick={() => setShowForm((value) => !value)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-500">
          <Plus className="h-5 w-5" />
          Share Experience
        </button>
      </div>

      {showForm && (
        <form onSubmit={createPost} className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-xl dark:border-white/10 dark:bg-white/5">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold dark:border-white/10 dark:bg-white/5 dark:text-white" />
          <input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Destination" className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold dark:border-white/10 dark:bg-white/5 dark:text-white" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Share what happened..." rows={5} className="w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3 font-semibold dark:border-white/10 dark:bg-white/5 dark:text-white" />
          <button className="rounded-xl bg-indigo-600 px-5 py-3 font-bold text-white">Post</button>
        </form>
      )}

      {loading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="mb-3 h-8 w-3/4" />
              <Skeleton className="mb-3 h-4 w-full" />
              <Skeleton className="mb-6 h-4 w-5/6" />
              <div className="flex gap-8 border-t border-slate-100 pt-6 dark:border-white/10">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post, index) => {
            const authorName = `${post.author?.firstName || ""} ${post.author?.lastName || ""}`.trim() || post.author?.username || user?.username || "Traveler";
            return (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} key={post.id} className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:p-8">
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-indigo-100 shadow-sm dark:border-white/20">
                    <img src={post.author?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"} alt={authorName} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white">{authorName}</h4>
                    <p className="text-xs font-medium text-slate-500 dark:text-white/50">{post.destination || "Traveloop"} · {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <h2 className="mb-3 text-2xl font-black text-slate-900 dark:text-white">{post.title}</h2>
                <p className="mb-6 text-lg leading-relaxed text-slate-600 dark:text-white/80">{post.content}</p>
                <div className="flex gap-8 border-t border-slate-100 pt-6 dark:border-white/10">
                  <button onClick={() => likePost(post.id)} className="flex items-center gap-2 font-medium text-slate-500 transition-colors hover:text-pink-500 dark:text-white/60 dark:hover:text-pink-400">
                    <Heart className="h-6 w-6" />
                    {post.likesCount}
                  </button>
                  <button className="flex items-center gap-2 font-medium text-slate-500 dark:text-white/60">
                    <MessageSquare className="h-6 w-6" />
                    0
                  </button>
                  <button className="ml-auto flex items-center gap-2 font-medium text-slate-500 dark:text-white/60">
                    <Share2 className="h-6 w-6" />
                  </button>
                </div>
              </motion.div>
            );
          })}
          {posts.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center font-semibold text-slate-500 dark:border-white/15 dark:text-white/50">No community posts yet.</div>}
        </div>
      )}
    </motion.div>
  );
};

export default Community;
