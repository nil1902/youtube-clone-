import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { CheckCircle2, ChevronRight, Search } from 'lucide-react';
import { API_URL } from '../utils/config';

export default function Channel() {
  const { channelName } = useParams();
  const [channelData, setChannelData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Videos");

  const tabs = ["Home", "Videos", "Shorts", "Live", "Podcasts", "Playlists", "Community"];

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/channel/${encodeURIComponent(channelName as string)}`)
      .then(res => res.json())
      .then(data => {
        setChannelData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [channelName]);

  if (loading || !channelData) {
    return (
      <div className="flex flex-col items-center justify-center p-20 mt-14 h-[calc(100vh-60px)] bg-[#0f0f0f]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-neutral-400 font-medium tracking-wide animate-pulse">Loading Official Channel Metadata...</div>
      </div>
    );
  }

  const { channelInfo, videos } = channelData;

  return (
    <div className="w-full bg-[#0f0f0f] mt-14 h-full min-h-screen text-white overflow-y-auto">
      {/* Dynamic Cinematic Banner */}
      <div className="w-full h-[15vw] min-h-[120px] max-h-[300px] overflow-hidden relative mx-auto lg:px-[10%] pt-4">
        <img 
          src={channelInfo.banner} 
          alt="Channel Banner" 
          className="w-full h-full object-cover lg:rounded-2xl"
        />
      </div>

      {/* Channel Header Section */}
      <div className="w-full max-w-[2000px] lg:px-[10%] px-4 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          <img 
            src={channelInfo.avatar} 
            alt={channelInfo.name} 
            className="w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-full object-cover border border-[#303030] shadow-xl"
          />
          <div className="flex flex-col items-center sm:items-start mt-2 sm:mt-4">
            <h1 className="text-[28px] sm:text-[36px] font-bold flex items-center gap-2">
              {channelInfo.name}
              <CheckCircle2 size={24} fill="#aaaaaa" color="#0f0f0f" className="mt-1"/>
            </h1>
            <div className="text-[#aaaaaa] text-[14px] font-medium flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-1">
              <span>@{channelInfo.name.replace(/\s+/g, '').toLowerCase()}</span>
              <span>•</span>
              <span>{channelInfo.subscribers}</span>
              <span>•</span>
              <span>{channelInfo.videoCount}</span>
            </div>
            <div className="text-[#aaaaaa] text-[14px] mt-2 mb-4 flex items-center cursor-pointer hover:text-white line-clamp-1 max-w-[600px] text-center sm:text-left transition-colors">
              {channelInfo.description} <ChevronRight size={16} className="ml-1 mt-0.5" />
            </div>
            <button className="bg-[#f1f1f1] text-[#0f0f0f] px-5 py-2.5 rounded-full text-[14px] font-bold hover:bg-[#d9d9d9] transition w-full sm:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Official YouTube Channel Tabs */}
      <div className="w-full border-b border-[#3f3f3f] mt-4 lg:px-[10%] px-4">
        <div className="flex gap-8 overflow-x-auto scrollbar-hide text-[15px] font-semibold text-[#aaaaaa]">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`pb-3 uppercase px-1 transition-colors whitespace-nowrap ${activeTab === tab ? "text-[#f1f1f1] border-b-[3px] border-[#f1f1f1]" : "hover:text-white"}`}
            >
              {tab}
            </button>
          ))}
          <button className="pb-3 px-1 ml-auto hover:text-white transition-colors">
            <Search size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Channel Video Grid (Only rendered heavily on Home/Videos tab) */}
      <div className="w-full max-w-[2000px] lg:px-[10%] px-4 py-6 pb-20">
        <div className="flex gap-3 mb-6">
           <button className="bg-[#f1f1f1] text-[#0f0f0f] px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">Latest</button>
           <button className="bg-[#222222] text-[#f1f1f1] hover:bg-[#3f3f3f] px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">Popular</button>
           <button className="bg-[#222222] text-[#f1f1f1] hover:bg-[#3f3f3f] px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">Oldest</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-4 md:gap-x-4">
          {videos && videos.length > 0 ? videos.map((video: any) => (
            <VideoCard key={video.id} {...video} />
          )) : (
            <div className="col-span-full py-20 text-center text-[#aaaaaa] text-lg">
              This channel has no videos matching the criteria right now.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
