import { useEffect, useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share, MoreHorizontal } from 'lucide-react';
import { API_URL } from '../utils/config';

export default function Shorts() {
  const [shorts, setShorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/shorts`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setShorts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || shorts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 mt-14 h-[calc(100vh-60px)] bg-[#0f0f0f]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4 transform-gpu"></div>
        <div className="text-neutral-400 font-medium tracking-wide animate-pulse">Loading Vertical Shorts Feed...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0f0f0f] mt-14 h-[calc(100vh-56px)] flex justify-center overflow-hidden">
        
      {/* Native CSS Snap Scrolling Container */}
      <div 
        ref={scrollRef}
        className="w-full sm:w-[400px] h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative"
      >
        {shorts.map((short, idx) => (
          <div key={idx} className="w-full h-full snap-start snap-always relative flex items-center justify-center bg-black/95">
            
            {/* The Short Video Player */}
            <iframe 
              src={`https://www.youtube.com/embed/${short.id}?autoplay=${idx === 0 ? 1 : 0}&loop=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1`} 
              className="w-full aspect-[9/16] h-[90%] sm:h-[95%] sm:rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.8)] pointer-events-auto"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>

            {/* Overlay Gradient for Text Readability */}
            <div className="absolute inset-x-0 bottom-[5%] h-1/3 bg-gradient-to-t from-black/80 to-transparent sm:rounded-b-2xl pointer-events-none"></div>

            {/* Floating Right Action Bar */}
            <div className="absolute right-3 sm:-right-16 bottom-[10%] flex flex-col items-center gap-6 z-10 drop-shadow-md">
               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-[48px] h-[48px] bg-black/40 sm:bg-[#272727] rounded-full flex items-center justify-center hover:bg-black/60 sm:hover:bg-[#3f3f3f] transition active:scale-95">
                     <ThumbsUp size={24} fill="currentColor" className="text-white" />
                  </div>
                  <span className="text-white text-[12px] font-semibold">{short.views.replace('M', 'M').replace('K', 'K')}</span>
               </div>
               
               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-[48px] h-[48px] bg-black/40 sm:bg-[#272727] rounded-full flex items-center justify-center hover:bg-black/60 sm:hover:bg-[#3f3f3f] transition active:scale-95">
                     <ThumbsDown size={24} className="text-white" />
                  </div>
                  <span className="text-white text-[12px] font-semibold">Dislike</span>
               </div>

               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-[48px] h-[48px] bg-black/40 sm:bg-[#272727] rounded-full flex items-center justify-center hover:bg-black/60 sm:hover:bg-[#3f3f3f] transition active:scale-95">
                     <MessageSquare size={24} fill="currentColor" className="text-white transform scale-x-[-1]" />
                  </div>
                  <span className="text-white text-[12px] font-semibold">{(Math.random() * 5).toFixed(1)}K</span>
               </div>

               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-[48px] h-[48px] bg-black/40 sm:bg-[#272727] rounded-full flex items-center justify-center hover:bg-black/60 sm:hover:bg-[#3f3f3f] transition active:scale-95">
                     <Share size={24} fill="currentColor" className="text-white" />
                  </div>
                  <span className="text-white text-[12px] font-semibold">Share</span>
               </div>
               
               <div className="flex flex-col items-center gap-1 group cursor-pointer">
                  <div className="w-[48px] h-[48px] bg-black/40 sm:bg-[#272727] rounded-full flex items-center justify-center hover:bg-black/60 sm:hover:bg-[#3f3f3f] transition active:scale-95">
                     <MoreHorizontal size={24} className="text-white" />
                  </div>
               </div>
               
               <div className="w-[40px] h-[40px] bg-neutral-800 rounded-md overflow-hidden mt-2 border-2 border-white cursor-pointer active:scale-95 transition shadow-lg">
                  <img src={short.channelAvatar} className="w-full h-full object-cover"/>
               </div>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-[6%] left-0 max-w-[80%] pl-4 sm:pl-6 pb-2 flex flex-col z-10 drop-shadow-md">
               <div className="flex items-center gap-3 mb-3 cursor-pointer">
                  <img src={short.channelAvatar} className="w-9 h-9 rounded-full border border-white" />
                  <span className="text-white font-bold text-[15px]">@{short.channel.replace(' ', '')}</span>
                  <button className="bg-white text-black font-bold text-[13px] px-4 py-1.5 rounded-full ml-1 active:bg-gray-200 transition">Subscribe</button>
               </div>
               <p className="text-white font-medium text-[15px] leading-snug line-clamp-2 pr-2">{short.title}</p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
