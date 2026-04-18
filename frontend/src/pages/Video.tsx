import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, Share, Download, MoreHorizontal, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { API_URL } from '../utils/config';

const CommentThread = ({ comment }: { comment: any }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex gap-4">
      <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full mt-0.5" />
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-semibold text-[13px] text-[#f1f1f1]">@{comment.user}</span>
          <span className="text-[12px] text-[#aaaaaa]">{comment.timestamp}</span>
        </div>
        <p className="text-[14px] leading-snug whitespace-pre-wrap text-[#f1f1f1]">{comment.text}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <button className="p-1.5 text-[#f1f1f1] active:bg-[#272727] rounded-full transition shrink-0">
             <ThumbsUp size={15} strokeWidth={1.5} />
          </button>
          <span className="text-[12px] text-[#aaaaaa] -ml-1 mr-1">{comment.likes}</span>
          <button className="p-1.5 text-[#f1f1f1] active:bg-[#272727] rounded-full transition shrink-0">
             <ThumbsDown size={15} strokeWidth={1.5} />
          </button>
          <button className="text-[12px] font-bold text-[#f1f1f1] px-3 py-1.5 active:bg-[#272727] rounded-full ml-1">Reply</button>
        </div>
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2">
            <button 
               className="flex items-center gap-2 text-[#3ea6ff] hover:bg-[#3ea6ff]/10 px-4 py-1.5 rounded-full font-bold text-[14px] transition"
               onClick={() => setShowReplies(!showReplies)}
            >
              {showReplies ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              {comment.replies.length} replies
            </button>
            
            {showReplies && (
              <div className="flex flex-col gap-4 mt-3 ml-2 w-full">
                {comment.replies.map((reply: any) => (
                  <CommentThread key={reply.id} comment={reply} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default function Video() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/videos/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.title) {
          setVideo(data);
          setError(false);
          
          const userProfile = JSON.parse(localStorage.getItem('yt_user_profile') || '{"history": [], "channels": []}');
          const cleanWords = data.title.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter((w: string) => w.length > 4);
          userProfile.history = [...cleanWords, ...userProfile.history].slice(0, 50); 
          userProfile.channels = [data.channel, ...userProfile.channels.filter((c: string) => c !== data.channel)].slice(0, 15);
          localStorage.setItem('yt_user_profile', JSON.stringify(userProfile));
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));

    fetch(`${API_URL}/api/comments/${id}`)
      .then(res => res.json())
      .then(data => setComments(Array.isArray(data) ? data : []));

    fetch(`${API_URL}/api/videos`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRelatedVideos(data.filter((v: any) => v.id !== id).slice(0, 12)); // Optimal iPad performance limit
        }
        setLoading(false);
      });
  }, [id]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-60px)] text-white mt-14 bg-[#0f0f0f]">
        <div className="text-2xl font-bold mb-2">Video Unavailable</div>
        <div className="text-neutral-400">The video you are trying to watch doesn't exist or was a dummy link! Please go to the Home page and select a real video.</div>
      </div>
    );
  }

  if (loading || !video) {
    return (
      <div className="flex flex-col items-center justify-center p-20 mt-14 h-[calc(100vh-60px)] bg-[#0f0f0f]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4 transform-gpu"></div>
        <div className="text-neutral-400 font-medium tracking-wide animate-pulse">Establishing ultra-efficient direct iPad-optimized stream...</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#0f0f0f] mt-14 h-full min-h-screen pb-10">
      <div className="grid lg:grid-cols-[1fr,380px] xl:grid-cols-[1fr,420px] gap-6 p-0 md:p-6 lg:px-8 xl:px-[5%] max-w-[2000px] mx-auto text-white">
        
        {/* Main Video Section */}
        <div className="flex flex-col gap-3 min-w-0">
          
          {/* Extremely Low Battery Drain Profile: Let YouTube hardware-accel negotiate resolution natively based on connectivity. No heavy box shadows or DOM layer drops. */}
          <div className="w-full aspect-video bg-black md:rounded-[12px] overflow-hidden relative border-none md:border md:border-[#1a1a1a] transform-gpu">
            <iframe 
              src={`https://www.youtube.com/embed/${id}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&color=white`} 
              title={video.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen 
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="px-4 md:px-0">
             <h1 className="text-[19px] md:text-[20px] font-bold mt-2 leading-[1.3] text-[#f1f1f1]" style={{ wordBreak: 'break-word', WebkitFontSmoothing: 'antialiased' }}>{video.title}</h1>
   
             <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-4 mt-2">
               <div className="flex items-center justify-between xl:justify-start gap-3 shrink-0">
                 <div className="flex items-center gap-3">
                   <img 
                      src={video.channelAvatar} alt={video.channel} 
                      className="w-10 h-10 rounded-full object-cover border border-[#303030] cursor-pointer active:opacity-70 transition transform-gpu" 
                      onClick={() => navigate(`/channel/${encodeURIComponent(video.channel)}`)}
                   />
                   <div 
                      className="flex flex-col cursor-pointer active:opacity-70" 
                      onClick={() => navigate(`/channel/${encodeURIComponent(video.channel)}`)}
                   >
                     <h3 className="font-bold text-[16px] leading-tight flex items-center gap-1.5 text-[#f1f1f1]">
                       {video.channel}
                       <CheckCircle2 size={13} fill="#aaaaaa" color="#0f0f0f" className="mt-[2px]"/>
                     </h3>
                     <p className="text-[12px] text-[#aaaaaa]">{(Math.random() * 20).toFixed(1)}M subscribers</p>
                   </div>
                 </div>
                 <button className="bg-[#f1f1f1] text-[#0f0f0f] px-4 py-2.5 rounded-full text-[14px] font-[600] xl:mx-2 active:bg-[#d9d9d9] transition">
                   Subscribe
                 </button>
               </div>
   
               <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide text-[14px] webkit-overflow-scrolling-touch">
                 <div className="flex items-center bg-[#272727] rounded-full shrink-0">
                   <button className="flex items-center gap-2 px-4 py-2 active:bg-[#3f3f3f] rounded-l-full transition">
                     <ThumbsUp size={18} strokeWidth={1.5} /> <span className="font-medium">{(Math.random() * 200).toFixed(1)}K</span>
                   </button>
                   <div className="w-[1px] h-6 bg-[#3f3f3f]"></div>
                   <button className="px-4 py-2 active:bg-[#3f3f3f] rounded-r-full transition">
                     <ThumbsDown size={18} strokeWidth={1.5} />
                   </button>
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-[#272727] active:bg-[#3f3f3f] rounded-full transition shrink-0">
                   <Share size={18} strokeWidth={1.5} /> <span className="font-medium">Share</span>
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 bg-[#272727] active:bg-[#3f3f3f] rounded-full transition shrink-0">
                   <Download size={18} strokeWidth={1.5} /> <span className="font-medium">Download</span>
                 </button>
                 <button className="p-2.5 bg-[#272727] active:bg-[#3f3f3f] rounded-full transition shrink-0">
                   <MoreHorizontal size={18} strokeWidth={1.5} />
                 </button>
               </div>
             </div>
   
             <div className="bg-[#272727] p-3.5 rounded-xl mt-3 md:mt-4 text-[14px] leading-relaxed text-[#f1f1f1] active:opacity-80 transition cursor-pointer font-medium">
               <div className="font-bold mb-1">{video.views} views • Premiered {video.timestamp}</div>
               <p className="whitespace-pre-wrap leading-[1.4] opacity-90">{video.description.substring(0, 200)}...<br/><span className="font-bold text-[#f1f1f1] block mt-1">Show more</span></p>
             </div>
          </div>

          <div className="px-4 md:px-0 mt-6 flex flex-col gap-6 w-full">
            <div className="flex items-center gap-8">
              <h3 className="text-[20px] font-bold">{comments.length * 123} Comments</h3>
              <span className="font-medium cursor-pointer flex items-center gap-2 text-[14px] active:opacity-70"><svg height="24" viewBox="0 0 24 24" width="24" fill="currentColor"><path d="M21 6H3V5h18v1zm-6 5H3v1h12v-1zm-6 6H3v1h6v-1z"></path></svg> Sort by</span>
            </div>
            
            <div className="flex items-start gap-4">
              <img src="https://ui-avatars.com/api/?name=You&background=random" className="w-10 h-10 rounded-full" />
              <div className="flex-1 flex flex-col pt-1">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="w-full bg-transparent border-b border-[#3f3f3f] focus:border-[#f1f1f1] outline-none pb-1.5 text-[14px] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-6">
              {comments.map((comment: any) => (
                <CommentThread key={comment.id} comment={comment} />
              ))}
            </div>
          </div>
        </div>

        {/* Suggestion Sidebar iPad Opt */}
        <div className="flex flex-col gap-4 mt-6 lg:mt-0 px-4 md:px-0">
          {relatedVideos.map((video: any) => (
            <div 
              key={video.id + "_related"} 
              className="flex flex-row md:flex-row lg:flex-row gap-2.5 group cursor-pointer active:opacity-70 transition-opacity"
              onClick={() => navigate(`/video/${video.id}`)}
            >
              <div className="w-[160px] md:w-[168px] shrink-0 aspect-video rounded-xl overflow-hidden relative border border-[#1a1a1a] transform-gpu">
                  <img src={video.thumbnail} className="w-full h-full object-cover group-hover:scale-105 duration-300 transform-gpu"/>
                  <span className="absolute bottom-1 right-1 bg-black/90 text-[#f1f1f1] text-[11px] font-[600] px-1 rounded shadow-sm">
                     {video.duration}
                  </span>
              </div>
              <div className="flex flex-col mt-0.5 justify-start">
                 <h4 className="text-[14px] lg:text-[14px] text-[#f1f1f1] font-semibold line-clamp-2 leading-[1.3] webkit-font-smoothing">{video.title}</h4>
                 <span className="text-[12px] text-[#aaaaaa] mt-0.5">{video.channel}</span>
                 <span className="text-[12px] text-[#aaaaaa]">{video.views} views • {video.timestamp}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
