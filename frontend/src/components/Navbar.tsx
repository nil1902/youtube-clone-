import { Menu, Search, Mic, Video as VideoIcon, Bell, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-[#0f0f0f] h-14 shrink-0 fixed top-0 w-full z-50">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-[#272727] rounded-full transition-colors hidden sm:block">
          <Menu size={24} color="white" />
        </button>
        <Link to="/" className="flex items-center gap-1.5 tracking-tighter text-white">
          <div className="bg-red-600 text-white p-1 rounded-[6px] flex items-center justify-center">
            <svg height="20" viewBox="0 0 24 24" width="20" fill="currentColor" className="mr-0.5"><path d="M21.58,7.19c-0.23-0.86-0.91-1.54-1.77-1.77C18.25,5,12,5,12,5s-6.25,0-7.81,0.42C3.33,5.65,2.65,6.33,2.42,7.19 C2,8.75,2,12,2,12s0,3.25,0.42,4.81c0.23,0.86,0.91,1.54,1.77,1.77C5.75,19,12,19,12,19s6.25,0,7.81-0.42 c0.86-0.23,1.54-0.91,1.77-1.77C22,15.25,22,12,22,12S22,8.75,21.58,7.19z M9.5,15.5v-7l6.5,3.5L9.5,15.5z"></path></svg>
          </div>
          <span className="text-[20px] font-bold pb-0.5 tracking-tight relative">
            YouTube<sup className="text-[9px] absolute top-1 right-[-14px] text-[#aaaaaa]">IN</sup>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-[700px] px-8 pl-16">
        <form onSubmit={handleSearch} className="flex items-center flex-1 rounded-full border border-[#303030] bg-[#121212] overflow-hidden focus-within:border-[#1c62b9] focus-within:ml-[2px] ml-4 transition-all">
          <div className="pl-4 pr-1 text-neutral-400 focus-within:block hidden">
            <Search size={20} strokeWidth={1} />
          </div>
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search" 
            className="flex-1 bg-transparent border-none outline-none py-2 px-4 text-white text-[15px] font-normal placeholder-[#aaaaaa]"
          />
          <button type="submit" className="px-5 py-2 bg-[#222222] hover:bg-[#303030] border-l border-[#303030] transition-colors" aria-label="Search">
            <Search size={22} strokeWidth={1.5} className="text-[#f1f1f1]" />
          </button>
        </form>
        <button className="p-2.5 bg-[#181818] hover:bg-[#303030] rounded-full transition-colors hidden sm:flex shrink-0">
          <Mic size={22} strokeWidth={1.5} className="text-[#f1f1f1]" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        <button className="p-2 hover:bg-[#272727] rounded-full transition-colors hidden sm:block text-[#f1f1f1]">
          <VideoIcon size={24} strokeWidth={1.2} />
        </button>
        <button className="p-2 hover:bg-[#272727] rounded-full transition-colors text-[#f1f1f1]">
          <Bell size={24} strokeWidth={1.2} />
        </button>
        <button className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center font-medium overflow-hidden shrink-0 ml-2 text-white">
          <User size={20} />
        </button>
      </div>
    </nav>
  );
}
