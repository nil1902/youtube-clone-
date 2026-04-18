export const videos = [
  {
    id: "v1",
    title: "Building a YouTube Clone with React & Node.js!",
    thumbnail: "https://images.unsplash.com/photo-1627398246383-f27329971842?w=800&q=80",
    channel: "CodeMaster",
    channelAvatar: "https://i.pravatar.cc/150?u=1",
    views: "1.2M",
    timestamp: "2 days ago",
    duration: "15:20",
    description: "In this video, we build a YouTube clone from scratch using React, TypeScript, Vite, Tailwind CSS, and Node.js with Express. We cover everything from setting up the layout to creating related videos and comments section."
  },
  {
    id: "v2",
    title: "10 CSS Tricks You Didn't Know Existed",
    thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
    channel: "DesignPro",
    channelAvatar: "https://i.pravatar.cc/150?u=2",
    views: "850K",
    timestamp: "1 week ago",
    duration: "8:05",
    description: "Upgrade your CSS skills with these 10 mind-blowing tricks!"
  },
  {
    id: "v3",
    title: "The Future of Artificial Intelligence",
    thumbnail: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&q=80",
    channel: "TechTrends",
    channelAvatar: "https://i.pravatar.cc/150?u=3",
    views: "3.4M",
    timestamp: "1 month ago",
    duration: "22:15",
    description: "A deep dive into what the future holds for AI and humanity."
  },
  {
    id: "v4",
    title: "Why You Should Learn TypeScript in 2024",
    thumbnail: "https://images.unsplash.com/photo-1667372283526-7c08287e0766?w=800&q=80",
    channel: "DevDiaries",
    channelAvatar: "https://i.pravatar.cc/150?u=4",
    views: "210K",
    timestamp: "4 hours ago",
    duration: "10:50",
    description: "TypeScript is taking over the JS ecosystem. Here is why you must learn it now."
  },
  {
    id: "v5",
    title: "Understanding React UseEffect Once and For All",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    channel: "ReactNinja",
    channelAvatar: "https://i.pravatar.cc/150?u=5",
    views: "450K",
    timestamp: "3 days ago",
    duration: "18:30",
    description: "Struggling with useEffect? We break it down into simple terms."
  },
  {
    id: "v6",
    title: "My Minimal Desk Setup for Programming",
    thumbnail: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80",
    channel: "StudioVibes",
    channelAvatar: "https://i.pravatar.cc/150?u=6",
    views: "1.8M",
    timestamp: "2 months ago",
    duration: "12:10",
    description: "Touring my minimal and highly productive desk setup for 2024."
  },
  {
    id: "v7",
    title: "Vite vs Webpack - What should you choose?",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    channel: "BuildTools",
    channelAvatar: "https://i.pravatar.cc/150?u=7",
    views: "320K",
    timestamp: "5 days ago",
    duration: "14:45",
    description: "Comparing Vite and Webpack in performance, DX, and ecosystem."
  },
  {
    id: "v8",
    title: "A Day in the Life of a Software Engineer",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    channel: "CodeLife",
    channelAvatar: "https://i.pravatar.cc/150?u=8",
    views: "2.1M",
    timestamp: "1 year ago",
    duration: "25:00",
    description: "Follow me around as I go about my day as a senior software engineer."
  }
];

export const comments: Record<string, any[]> = {
  "v1": [
    { id: 1, user: "Alice", avatar: "https://i.pravatar.cc/150?u=11", text: "Wow, this is incredibly detailed! Thanks for the tutorial.", timestamp: "1 day ago" },
    { id: 2, user: "Bob", avatar: "https://i.pravatar.cc/150?u=12", text: "I've been looking for a React + Node setup exactly like this.", timestamp: "20 hours ago" },
    { id: 3, user: "Charlie", avatar: "https://i.pravatar.cc/150?u=13", text: "Can you do a follow-up on adding authentication?", timestamp: "5 hours ago" }
  ]
};
