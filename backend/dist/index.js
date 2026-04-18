"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const yt_search_1 = __importDefault(require("yt-search"));
const node_cache_1 = __importDefault(require("node-cache"));
const https_1 = __importDefault(require("https"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const apiCache = new node_cache_1.default({ stdTTL: 3600, checkperiod: 600 });
const port = process.env.PORT || 5001;
// Helper to fetch RAW HTML securely
const fetchHtml = (url) => {
    return new Promise((resolve, reject) => {
        https_1.default.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
};
const router = express_1.default.Router();
router.get('/videos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const r = yield (0, yt_search_1.default)(query);
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
        if (videos.length === 0)
            throw new Error("AWS Scraping blocked");
        apiCache.set(cacheKey, videos);
        res.json(videos);
    }
    catch (err) {
        console.error("AWS Lambda Scraper Fallback Triggered:", err);
        // Cloud IP Ban Fallback -> Never show blank screen!
        const mockVideos = Array.from({ length: 15 }).map((_, i) => ({
            id: `fallback_${Math.random()}`,
            title: `Amazing Video Tutorial & Insights ${i + 1}`,
            thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i}?w=800&q=80`,
            channel: "Creator Hub",
            channelAvatar: `https://ui-avatars.com/api/?name=Creator+Hub&background=random`,
            views: `${(Math.random() * 5).toFixed(1)}M`,
            timestamp: `${Math.floor(Math.random() * 11) + 1} months ago`,
            duration: "10:05",
            description: "Fallback dataset activated due to AWS Lambda rate limits."
        }));
        res.json(mockVideos);
    }
}));
router.get('/shorts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cacheKey = `shorts_feed_1`;
        if (apiCache.has(cacheKey)) {
            return res.json(apiCache.get(cacheKey));
        }
        const shortsQueries = ["#shorts trending", "funny #shorts", "satisfying #shorts viral", "amazing facts #shorts"];
        const r = yield (0, yt_search_1.default)(shortsQueries[Math.floor(Math.random() * shortsQueries.length)]);
        const shorts = r.videos
            .filter(v => v.type === 'video' && v.seconds < 90)
            .map(v => ({
            id: v.videoId,
            title: v.title,
            thumbnail: v.thumbnail,
            channel: v.author.name,
            channelAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(v.author.name)}&background=random`,
            views: v.views >= 1000000 ? (v.views / 1000000).toFixed(1) + 'M' : (v.views >= 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views)
        }));
        apiCache.set(cacheKey, shorts, 300);
        res.json(shorts);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching shorts' });
    }
}));
router.get('/videos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const videoId = req.params.id;
        const cacheKey = `video_${videoId}`;
        if (apiCache.has(cacheKey)) {
            return res.json(apiCache.get(cacheKey));
        }
        const video = yield (0, yt_search_1.default)({ videoId });
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
        }
        else {
            res.status(404).json({ message: 'Video not found' });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching video details' });
    }
}));
router.get('/channel/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const channelName = req.params.name;
        const cacheKey = `channel_${channelName.toLowerCase()}`;
        if (apiCache.has(cacheKey)) {
            return res.json(apiCache.get(cacheKey));
        }
        const r = yield (0, yt_search_1.default)(channelName);
        const channelObject = r.channels && r.channels.length > 0 ? r.channels[0] : null;
        let channelVideos = r.videos.filter(v => v.author.name.toLowerCase() === channelName.toLowerCase());
        if (channelVideos.length === 0)
            channelVideos = r.videos.slice(0, 15);
        let trueBanner = "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=2000&q=80";
        let trueDescription = `Official channel for ${channelName}. Subscribe for the latest videos, updates, and community highlights!`;
        let trueVideoCount = channelObject ? `${channelObject.videoCount} videos` : `${Math.floor(Math.random() * 500) + 50} videos`;
        let trueAvatar = (channelObject === null || channelObject === void 0 ? void 0 : channelObject.image) || `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=random&size=200`;
        if (channelObject && channelObject.url) {
            try {
                const html = yield fetchHtml(channelObject.url);
                const bannerMatch = html.match(/"banner":\{"thumbnails":\[.*?\{"url":"([^"]+)"/);
                if (bannerMatch && bannerMatch[1])
                    trueBanner = bannerMatch[1];
                const descMatch = html.match(/"description":\{"simpleText":"(.*?)"\}/);
                if (descMatch && descMatch[1])
                    trueDescription = descMatch[1].replace(/\\n/g, '\n').replace(/\\u200b/g, '');
                if (channelObject.videoCount === -1) {
                    const vcMatch = html.match(/"videoCountText":\{"selected":false,"accessibility":\{"accessibilityData":\{"label":"([^"]+)"\}\}/);
                    if (vcMatch && vcMatch[1])
                        trueVideoCount = vcMatch[1];
                }
            }
            catch (err) {
                console.error("Scraper fallback failed:", err);
            }
        }
        const mappedVideos = channelVideos.map(v => ({
            id: v.videoId,
            title: v.title,
            thumbnail: v.thumbnail,
            channel: v.author.name,
            channelAvatar: trueAvatar,
            views: v.views >= 1000000 ? (v.views / 1000000).toFixed(1) + 'M' : (v.views >= 1000 ? (v.views / 1000).toFixed(1) + 'K' : v.views),
            timestamp: v.ago,
            duration: v.timestamp
        }));
        const result = {
            channelInfo: {
                name: (channelObject === null || channelObject === void 0 ? void 0 : channelObject.name) || channelName,
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching channel details' });
    }
}));
router.get('/comments/:videoId', (req, res) => {
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
    const generateComment = (idPrefix, isReply = false) => {
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
// Bind Router to multiple universal base endpoints so Netlify or Proxy failures ALWAYS catch!
app.use('/api', router);
app.use('/.netlify/functions/api', router);
app.use('/.netlify/functions/api/api', router);
// UNIVERSAL JUGAAD (HACK): Transform Express into a master Full-Stack Server
// This statically serves the compiled Vite frontend right inside the Backend!
const frontendBuildPath = path_1.default.join(__dirname, '../../frontend/dist');
app.use(express_1.default.static(frontendBuildPath));
// React-Router-DOM Fallback (Redirect all non-api traffic to index.html)
app.use((req, res, next) => {
    res.sendFile(path_1.default.join(frontendBuildPath, 'index.html'));
});
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });
}
// Export nothing by default, we use explicit 'export { app }' at top
