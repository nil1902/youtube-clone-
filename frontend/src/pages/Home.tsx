import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { API_URL } from '../utils/config';

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [internalQuery, setInternalQuery] = useState("");
  
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const categories = [
    "All", "Gaming", "Music", "Live", "Mixes", "Computers", 
    "React routers", "Indie music", "Recently uploaded", "Comedy", "Podcasts"
  ];

  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoElementRef = useCallback((node: any) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  // Reset videos and pick an unbiased randomized Trending Search when on 'All' mode
  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);

    if (!searchQuery && category === "All") {
      try {
        const userProfile = JSON.parse(localStorage.getItem('yt_user_profile') || '{"history": [], "channels": []}');
        
        const unbiasedTrendingQueries = [
          "trending worldwide this week latest",
          "newest viral videos most viewed",
          "recently uploaded trending hits",
          "popular internet videos this month",
          "highest viewed videos 2024 new"
        ];
        
        let algoQueries = [...unbiasedTrendingQueries];
        
        // --- REAL YOUTUBE ALGORITHM INJECTION ---
        // 65% probability to heavily bias the algorithmic grid to the user's explicit watch history!
        if (userProfile.history.length > 5 && Math.random() > 0.35) {
          const randomInterest = userProfile.history[Math.floor(Math.random() * userProfile.history.length)];
          const randomChannel = userProfile.channels.length > 0 ? userProfile.channels[Math.floor(Math.random() * userProfile.channels.length)] : "";
          
          if (Math.random() > 0.5 && randomChannel) {
             algoQueries.push(`${randomChannel} official latest`, `${randomInterest} top videos`);
             algoQueries.push(`${randomChannel} official latest`); // Multiply probability weight
          } else {
             algoQueries.push(`best of ${randomInterest} highly viewed`, `${randomInterest} explained`);
             algoQueries.push(`best of ${randomInterest} highly viewed`); 
          }
        }
        
        const dynamicQuery = algoQueries[Math.floor(Math.random() * algoQueries.length)];
        setInternalQuery(dynamicQuery);
      } catch (e) {
        setInternalQuery("trending worldwide this week");
      }
    } else {
      setInternalQuery(searchQuery || category);
    }
  }, [category, searchQuery]);

  // Fetch videos whenever page or internalQuery deeply updates
  useEffect(() => {
    if (!internalQuery) return;

    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    fetch(`${API_URL}/api/videos?q=${encodeURIComponent(internalQuery)}&page=${page}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
           setVideos(prev => {
             const newVideos = data.filter(nv => !prev.some(pv => pv.id === nv.id));
             return [...prev, ...newVideos];
           });
        } else {
           setHasMore(false);
        }
        setLoading(false);
        setLoadingMore(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setLoadingMore(false);
      });
  }, [internalQuery, page]);

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] min-h-[calc(100vh-56px)] w-full mt-14 overflow-y-auto">
      <div className="flex gap-3 px-4 py-3 overflow-x-auto whitespace-nowrap sticky top-0 bg-[#0f0f0f] z-40 scrollbar-hide">
        {categories.map((cat, i) => (
          <button 
            key={i} 
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              (!searchQuery && category === cat) 
                ? 'bg-white text-black border-transparent' 
                : 'bg-[#222222] text-[#f1f1f1] hover:bg-[#3f3f3f] border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div className="p-4 sm:p-6 pb-20 w-full max-w-[2200px] mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-60 mt-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mb-6"></div>
            <div className="text-neutral-400 font-medium">Fetching highly trending algorithm videos...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-4 md:gap-x-4">
              {videos.length > 0 ? videos.map((video: any, index: number) => {
                if (videos.length === index + 1) {
                  return <div ref={lastVideoElementRef} key={video.id + index}><VideoCard {...video} /></div>;
                } else {
                  return <div key={video.id + index}><VideoCard {...video} /></div>;
                }
              }) : <div className="text-neutral-400 col-span-full text-center mt-10 text-lg">No videos found for your search. Try searching something else.</div>}
            </div>
            
            {loadingMore && (
              <div className="flex justify-center mt-8 mb-4 w-full col-span-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
