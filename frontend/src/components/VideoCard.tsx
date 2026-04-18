import { Link, useNavigate } from 'react-router-dom';
import React from 'react';

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  channelAvatar: string;
  views: string;
  timestamp: string;
  duration: string;
}

const VideoCard = React.memo(function VideoCard({ id, title, thumbnail, channel, channelAvatar, views, timestamp, duration }: VideoCardProps) {
  const navigate = useNavigate();

  const navigateToChannel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/channel/${encodeURIComponent(channel)}`);
  };

  return (
    <Link to={`/video/${id}`} className="flex flex-col gap-3 cursor-pointer group active:opacity-80 md:active:opacity-100 transition-opacity content-vis">
      {/* Battery Optimised Render: No VRAM leak from heavy will-change properties */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#222]">
        <img 
          src={thumbnail} 
          alt={title} 
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover rounded-xl group-hover:rounded-none group-hover:scale-105 duration-300 transform-gpu"
        />
        <span className="absolute bottom-1.5 right-1.5 bg-black/90 text-[#f1f1f1] text-[12px] font-semibold px-2 py-0.5 rounded shadow-sm">
          {duration}
        </span>
      </div>
      <div className="flex gap-3 pr-[24px]">
        <div className="shrink-0 pt-0.5 z-10" onClick={navigateToChannel}>
          <img 
             src={channelAvatar} alt={channel} 
             loading="lazy"
             className="w-9 h-9 rounded-full object-cover cursor-pointer hover:opacity-80 transition transform-gpu" 
          />
        </div>
        <div className="flex flex-col gap-0.5 mt-0.5 overflow-hidden">
          <h3 className="text-[#f1f1f1] text-[16px] xl:text-[15px] font-semibold leading-[1.35] line-clamp-2 md:tracking-tight webkit-font-smoothing">
            {title}
          </h3>
          <span 
             className="text-[#aaaaaa] text-[13px] md:text-[14px] hover:text-white transition-colors mt-0.5 cursor-pointer z-10 inline-block w-fit" 
             onClick={navigateToChannel}
          >
             {channel}
          </span>
          <div className="text-[#aaaaaa] text-[13px] md:text-[14px] flex items-center flex-wrap">
            <span>{views} views</span>
            <span className="mx-1.5 text-[10px]">•</span>
            <span>{timestamp}</span>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default VideoCard;
