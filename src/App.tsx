import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Play, 
  Share2, 
  Heart, 
  MessageCircle, 
  Search, 
  Chrome, 
  Video, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  ExternalLink,
  Github
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface VideoItem {
  id: string;
  platform: 'Facebook' | 'TikTok' | 'Instagram' | 'YouTube';
  title: string;
  thumbnail: string;
  author: string;
  likes: string;
  comments: string;
}

// --- Mock Data ---
const MOCK_VIDEOS: VideoItem[] = [
  {
    id: '1',
    platform: 'TikTok',
    title: 'Amazing nature scenery in the mountains #travel #nature',
    thumbnail: 'https://picsum.photos/seed/tiktok1/400/700',
    author: '@nature_lover',
    likes: '1.2M',
    comments: '45.2K'
  },
  {
    id: '2',
    platform: 'Facebook',
    title: 'How to make the perfect chocolate cake in 5 minutes!',
    thumbnail: 'https://picsum.photos/seed/fb1/400/225',
    author: 'Chef Maria',
    likes: '250K',
    comments: '12K'
  },
  {
    id: '3',
    platform: 'Instagram',
    title: 'Morning workout routine for beginners #fitness #health',
    thumbnail: 'https://picsum.photos/seed/ig1/400/500',
    author: '@fitness_pro',
    likes: '89K',
    comments: '1.5K'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'url' | 'extension'>('feed');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleFetchVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/fetch-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Failed to fetch video');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const simulateDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
      // In a real app, we'd trigger a file download here
      alert('Video download started! (Simulation)');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-zinc-950" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">VDownloader</h1>
          </div>
          
          <nav className="flex items-center gap-1">
            <button 
              onClick={() => setActiveTab('feed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'feed' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Mock Feed
            </button>
            <button 
              onClick={() => setActiveTab('url')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'url' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Download by URL
            </button>
            <button 
              onClick={() => setActiveTab('extension')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'extension' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Extension Info
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'feed' && (
            <motion.div 
              key="feed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4">Extension Simulation</h2>
                <p className="text-zinc-400">
                  This mock feed demonstrates how the browser extension injects a 
                  <span className="text-emerald-400 font-semibold"> Download </span> 
                  button directly onto social media platforms.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_VIDEOS.map((video) => (
                  <div key={video.id} className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-emerald-500/50 transition-all duration-300">
                    {/* Video Thumbnail */}
                    <div className="relative aspect-[9/16] md:aspect-square overflow-hidden">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      
                      {/* Extension Download Button - The core feature requested */}
                      <button 
                        onClick={() => simulateDownload(video.id)}
                        disabled={downloadingId === video.id}
                        className="absolute top-4 right-4 z-10 p-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-full shadow-lg shadow-emerald-500/20 transform hover:scale-110 active:scale-95 transition-all duration-200 group-hover:translate-x-0 translate-x-12 opacity-0 group-hover:opacity-100"
                        title="Download this video"
                      >
                        {downloadingId === video.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                      </button>

                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="inline-block px-2 py-1 bg-zinc-950/60 backdrop-blur-sm rounded text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2">
                          {video.platform}
                        </span>
                        <p className="text-sm font-medium line-clamp-2 leading-tight">
                          {video.title}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="p-4 flex items-center justify-between border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold">
                          {video.author[1].toUpperCase()}
                        </div>
                        <span className="text-xs text-zinc-400 font-medium">{video.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-zinc-500">
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-[10px]">{video.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-[10px]">{video.comments}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'url' && (
            <motion.div 
              key="url"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl">
                    <Search className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Download by URL</h2>
                    <p className="text-zinc-400 text-sm">Paste any social media video link below</p>
                  </div>
                </div>

                <form onSubmit={handleFetchVideo} className="space-y-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.tiktok.com/@user/video/..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-4 focus:outline-none focus:border-emerald-500 transition-colors text-zinc-200 placeholder:text-zinc-600"
                    />
                    <button 
                      type="submit"
                      disabled={loading || !url}
                      className="absolute right-2 top-2 bottom-2 px-6 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 font-bold rounded-xl transition-all flex items-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch'}
                    </button>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  {result && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4"
                    >
                      <div className="flex gap-4">
                        <img 
                          src={result.thumbnail} 
                          alt="Thumbnail" 
                          className="w-32 h-20 object-cover rounded-lg border border-zinc-800"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold truncate">{result.title}</h3>
                          <p className="text-xs text-zinc-500 mt-1">{result.platform} Video</p>
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-emerald-500 font-medium">Ready to download</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => simulateDownload('result')}
                        className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download Video
                      </button>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'extension' && (
            <motion.div 
              key="extension"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8">
                <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-emerald-500/20">
                  <Chrome className="w-12 h-12 text-zinc-950" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">Browser Extension</h2>
                  <p className="text-zinc-400 leading-relaxed">
                    Our Chrome Extension automatically detects videos on Facebook, TikTok, and Instagram, 
                    placing a convenient download button right where you need it.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    How to Install
                  </h3>
                  <ol className="space-y-4 text-sm text-zinc-400">
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100 flex-shrink-0">1</span>
                      <p>Download the extension package from our <span className="text-emerald-400">GitHub</span>.</p>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100 flex-shrink-0">2</span>
                      <p>Open <code className="bg-zinc-950 px-1 rounded">chrome://extensions</code> in your browser.</p>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100 flex-shrink-0">3</span>
                      <p>Enable <span className="text-zinc-100 font-medium">Developer Mode</span> in the top right.</p>
                    </li>
                    <li className="flex gap-3">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-100 flex-shrink-0">4</span>
                      <p>Drag and drop the folder into the extensions page.</p>
                    </li>
                  </ol>
                </div>

                <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Github className="w-5 h-5 text-emerald-500" />
                    Source Code
                  </h3>
                  <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                    The extension is open-source. You can view the manifest and content scripts on our repository.
                  </p>
                  <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View on GitHub
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
                <h3 className="text-xl font-bold mb-6">Extension Logic (Content Script)</h3>
                <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 font-mono text-xs text-emerald-500/80 overflow-x-auto">
                  <pre>{`// content-script.js
const observer = new MutationObserver(() => {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (video.dataset.downloaderInjected) return;
    
    const btn = document.createElement('button');
    btn.innerHTML = 'Download';
    btn.style.position = 'absolute';
    btn.style.zIndex = '9999';
    // ... styling and positioning logic ...
    
    video.parentElement.appendChild(btn);
    video.dataset.downloaderInjected = 'true';
  });
});

observer.observe(document.body, { childList: true, subtree: true });`}</pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-800 py-12 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Video className="w-5 h-5" />
            <span className="text-sm font-medium">VDownloader © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-zinc-500 text-sm">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
