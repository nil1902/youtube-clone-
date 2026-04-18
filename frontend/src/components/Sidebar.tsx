import { Home, Compass, PlaySquare, Clock, ThumbsUp, History, Film, MonitorPlay } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: Film, label: 'Shorts', path: '/shorts' },
  { icon: MonitorPlay, label: 'Subscriptions', path: '/subscriptions' },
];

const libItems = [
  { icon: History, label: 'History', path: '/history' },
  { icon: PlaySquare, label: 'Your videos', path: '/your-videos' },
  { icon: Clock, label: 'Watch later', path: '/watch-later' },
  { icon: ThumbsUp, label: 'Liked videos', path: '/liked' },
];

export default function Sidebar() {
  const location = useLocation();

  const NavLink = ({ icon: Icon, label, path }: any) => {
    const isActive = location.pathname === path;
    return (
      <Link 
        to={path} 
        className={`flex xl:flex-row flex-col items-center xl:items-center xl:justify-start justify-center gap-1 xl:gap-5 px-0 xl:px-4 py-3 xl:py-2.5 rounded-xl mx-2 transition-colors ${
          isActive ? 'xl:bg-[#272727] font-medium' : 'hover:bg-[#272727]'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-[#f1f1f1]' : 'text-[#f1f1f1]'} />
        <span className={`text-[10px] xl:text-[14px] truncate w-full text-center xl:text-left ${isActive ? 'text-[#f1f1f1] font-semibold' : 'text-[#f1f1f1]'}`}>{label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-18 xl:w-64 bg-[#0f0f0f] overflow-y-auto hidden md:flex flex-col py-1 xl:py-3 shrink-0 scrollbar-hide z-40 relative">
      <div className="pb-3 border-b border-[#303030]/0 xl:border-[#303030]/50 mb-3 flex flex-col gap-1">
        {navItems.map((item, index) => (
          <NavLink key={index} {...item} />
        ))}
      </div>
      <div className="pb-3 hidden xl:block">
        <h3 className="px-6 py-2 text-[16px] font-bold text-[#f1f1f1] flex items-center">
           You <span className="ml-2 mt-[1px]">›</span>
        </h3>
        {libItems.map((item, index) => (
          <NavLink key={index} {...item} />
        ))}
      </div>
    </aside>
  );
}
