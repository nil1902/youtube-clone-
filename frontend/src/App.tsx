import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Video from './pages/Video';
import Channel from './pages/Channel';
import Shorts from './pages/Shorts';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen overflow-hidden bg-neutral-950 text-white">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/video/:id" element={<Video />} />
              <Route path="/channel/:channelName" element={<Channel />} />
              <Route path="/shorts" element={<Shorts />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
