import express from 'express';
import cors from 'cors';
import yts from 'yt-search';
import NodeCache from 'node-cache';
import https from 'https';

const app = express();
app.use(cors());
app.use(express.json());

const apiCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 }); 

const port = process.env.PORT || 5001;

// Helper to fetch RAW HTML securely
const fetchHtml = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

app.get('/api/videos', async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const baseQuery = req.query.q ? String(req.query.q) : 'latest programming tutorials 2024';
    
    const variations = ["", "new", "top", "trending", "2024", "part 2", "review", "skills", "update", "full course", "compilation", "react", "highlights", "vlog", "documentary", "explained"];
    const activeVar = variations[(page - 1) % variations.length];
    const query = `${baseQuery} ${activeVar}`.trim();

    const cacheKey = `search_${query.toLowerCase()}`;
    if (apiCache.has(cacheKey)) {
      return res.json(apiCache.get(cacheKey));
    }

    const r = await yts(query);
    const videos = r.videos.filter(v => v.type === 'video').map(v => ({
      id: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail,
      channel: v.author.name,
      channelAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(v.author.name)}&background=random`,
      views: v.views >= 1000000 ? (v.views / 1000000).toFixed(1) + 'M' : (v.views >= 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views),
      timestamp: v.ago,
      duration: v.timestamp,
      description: v.description
    }));

    apiCache.set(cacheKey, videos);
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching videos' });
  }
});

app.get('/api/shorts', async (req, res) => {
  try {
    const cacheKey = `shorts_feed_1`;
    if (apiCache.has(cacheKey)) {
      return res.json(apiCache.get(cacheKey));
    }
    
    // Explicitly search for Shorts queries to grab vertical content
    const shortsQueries = ["#shorts trending", "funny #shorts", "satisfying #shorts viral", "amazing facts #shorts"];
    const r = await yts(shortsQueries[Math.floor(Math.random() * shortsQueries.length)]);
    
    const shorts = r.videos
      .filter(v => v.type === 'video' && v.seconds < 90) // Enforce Shorts timeframe
      .map(v => ({
      id: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail,
      channel: v.author.name,
      channelAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(v.author.name)}&background=random`,
      views: v.views >= 1000000 ? (v.views / 1000000).toFixed(1) + 'M' : (v.views >= 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views)
    }));

    apiCache.set(cacheKey, shorts, 300); // 5 min TTL
    res.json(shorts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching shorts' });
  }
});

app.get('/api/videos/:id', async (req, res) => {
  try {
    const videoId = req.params.id;
    const cacheKey = `video_${videoId}`;
    
    if (apiCache.has(cacheKey)) {
      return res.json(apiCache.get(cacheKey));
    }

    const video = await yts({ videoId });
    if (video) {
       const mappedVideo = {
         id: video.videoId,
         title: video.title,
         thumbnail: video.thumbnail,
         channel: video.author.name,
         channelAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(video.author.name)}&background=random`,
         views: video.views >= 1000000 ? (video.views / 1000000).toFixed(1) + 'M' : (video.views >= 1000 ? (video.views / 1000).toFixed(1) + 'K' : video.views),
         timestamp: video.uploadDate || 'Recently',
         duration: video.timestamp,
         description: video.description
       };
       apiCache.set(cacheKey, mappedVideo);
       res.json(mappedVideo);
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching video details' });
  }
});

app.get('/api/channel/:name', async (req, res) => {
  try {
    const channelName = req.params.name;
    const cacheKey = `channel_${channelName.toLowerCase()}`;
    
    if (apiCache.has(cacheKey)) {
      return res.json(apiCache.get(cacheKey));
    }

    const r = await yts(channelName);
    const channelObject = r.channels && r.channels.length > 0 ? r.channels[0] : null;
    
    let channelVideos = r.videos.filter(v => v.author.name.toLowerCase() === channelName.toLowerCase());
    if (channelVideos.length === 0) channelVideos = r.videos.slice(0, 15);

    // Default Fallbacks
    let trueBanner = "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=2000&q=80";
    let trueDescription = `Official channel for ${channelName}. Subscribe for the latest videos, updates, and community highlights!`;
    let trueVideoCount = channelObject ? `${channelObject.videoCount} videos` : `${Math.floor(Math.random() * 500) + 50} videos`;
    let trueAvatar = channelObject?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=random&size=200`;

    // 1000% Authentic Metadata Scraper (bypasses API restrictions by parsing native YouTube variables)
    if (channelObject && channelObject.url) {
      try {
        const html = await fetchHtml(channelObject.url);
        
        // Extract Authentic Banner 
        const bannerMatch = html.match(/"banner":\{"thumbnails":\[.*?\{"url":"([^"]+)"/);
        if (bannerMatch && bannerMatch[1]) trueBanner = bannerMatch[1];
        
        // Extract Authentic Description
        const descMatch = html.match(/"description":\{"simpleText":"(.*?)"\}/);
        if (descMatch && descMatch[1]) trueDescription = descMatch[1].replace(/\\n/g, '\n').replace(/\\u200b/g, '');

        // Extract Video Count if yt-search failed (-1)
        if (channelObject.videoCount === -1) {
           const vcMatch = html.match(/"videoCountText":\{"selected":false,"accessibility":\{"accessibilityData":\{"label":"([^"]+)"\}\}/);
           if (vcMatch && vcMatch[1]) trueVideoCount = vcMatch[1];
        }
      } catch (err) {
        console.error("Scraper fallback failed:", err);
      }
    }

    const mappedVideos = channelVideos.map(v => ({
      id: v.videoId,
      title: v.title,
      thumbnail: v.thumbnail,
      channel: v.author.name,
      channelAvatar: trueAvatar, // Use real extracted avatar
      views: v.views >= 1000000 ? (v.views / 1000000).toFixed(1) + 'M' : (v.views >= 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views),
      timestamp: v.ago,
      duration: v.timestamp
    }));

    const result = {
      channelInfo: {
        name: channelObject?.name || channelName,
        subscribers: channelObject ? `${channelObject.subCount} subscribers` : `${(Math.random() * 10).toFixed(1)}M subscribers`,
        videoCount: trueVideoCount.includes("videos") ? trueVideoCount : `${trueVideoCount} videos`,
        description: trueDescription,
        avatar: trueAvatar,
        banner: trueBanner
      },
      videos: mappedVideos
    };

    apiCache.set(cacheKey, result);
    res.json(result);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching channel details' });
  }
});

app.get('/api/comments/:videoId', (req, res) => {
  const users = ["TechEnthusiast99", "CodeWarrior_x", "AlexDevOfficial", "FrontendNinja", "RandomViewer102", "Sara_Codes", "DesignMastery", "ReactPro", "JS_Lover", "BackendBoss", "FullStackHero"];
  const texts = [
    "This is an absolute masterpiece. Completely clarified the topic for me in under 10 minutes!",
    "Thanks for breaking this down so clearly. Finally makes sense after weeks of struggling.",
    "I've been looking for a tutorial like this for weeks. Great job on the deep dive!",
    "The editing on this is incredible. You earned a new subscriber. Can we get part 2?",
    "Can you do a part 2 covering advanced enterprise topics?",
    "This literally saved my final year project. Thank you so much!",
    "Love how concise and straight to the point this was. No fluff, just pure value.",
    "I appreciate you not wasting our time with a 5-minute intro.",
    "This deserves way more views, the algorithm is sleeping on this one.",
    "This solved the exact bug I've been stuck on since Tuesday."
  ];
  
  interface CommentType {
    id: string;
    user: string;
    avatar: string;
    text: string;
    timestamp: string;
    likes: number | string;
    replies: CommentType[];
  }
  
  const generateComment = (idPrefix: string, isReply: boolean = false): CommentType => {
    const user = users[Math.floor(Math.random() * users.length)];
    const text = texts[Math.floor(Math.random() * texts.length)];
    return {
      id: `${idPrefix}_${Math.random().toString(36).substring(7)}`,
      user: user,
      avatar: `https://ui-avatars.com/api/?name=${user}&background=random`,
      text: text,
      timestamp: `${Math.floor(Math.random() * 24) + 1} ${Math.random() > 0.5 ? 'hours' : 'days'} ago`,
      likes: Math.random() > 0.5 ? `${(Math.random() * 5).toFixed(1)}K` : Math.floor(Math.random() * 500),
      replies: isReply ? [] : Array.from({ length: Math.random() > 0.6 ? Math.floor(Math.random() * 5) + 1 : 0 }, (_, i) => generateComment(`${idPrefix}_reply_${i}`, true))
    };
  };

  const massiveStack = Array.from({ length: 45 }, (_, i) => generateComment(`c_${i}`));
  res.json(massiveStack);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}

// Export the underlying express app for Netlify / Vercel Serverless Wrappers
export default app;
