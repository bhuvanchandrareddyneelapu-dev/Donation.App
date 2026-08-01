import React, { useState } from 'react';
import { Users, ThumbsUp, MessageSquare, Share2, Video, Send, Megaphone, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Lalbaugcha Raja Executive Committee',
      title: '🚩 Grand Inauguration & Prana Pratishtha Schedule Announced!',
      content: 'We are thrilled to announce that the divine idol installation will commence at 6:00 AM on 14th September 2026. Special VVIP Aarti will be held at 7:30 PM followed by Mahaprasadam distribution. All devotees are cordially invited!',
      mediaUrl: 'https://images.unsplash.com/photo-1605626830588-4663e26b1c5a?w=800',
      mediaType: 'IMAGE',
      likes: 142,
      comments: [
        { id: 101, author: 'Priya Sundaram', text: 'Ganpati Bappa Morya! Looking forward to attending with my entire family. 🙏' },
        { id: 102, author: 'Aarav Patel', text: 'Volunteer team ready at Gate 2 for smooth darshan management.🚩' },
      ],
      announcement: true,
      time: '2 hours ago',
    },
    {
      id: 2,
      author: 'Kolkata Sarbojanin Samiti',
      title: '📺 Live Stream: Morning Dhunuchi Naach & Pushpanjali',
      content: 'Devotees unable to visit in person can now watch live 4K streaming directly from Park Circus Maidan pandal.',
      mediaUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800',
      mediaType: 'STREAM_LINK',
      likes: 98,
      comments: [
        { id: 103, author: 'Subhash Bose', text: 'Subho Mahalaya to everyone!' }
      ],
      announcement: false,
      time: '5 hours ago',
    },
  ]);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;

    const postObj = {
      id: Date.now(),
      author: user?.name || 'Devotee Community Member',
      title: newPostTitle,
      content: newPostContent,
      mediaUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800',
      mediaType: 'IMAGE',
      likes: 0,
      comments: [],
      announcement: false,
      time: 'Just now',
    };

    setPosts([postObj, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  const handleAddComment = (postId: number) => {
    const text = commentInputs[postId];
    if (!text) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { id: Date.now(), author: user?.name || 'Devotee', text }]
        };
      }
      return p;
    }));

    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Title */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Users className="w-4 h-4" />
            <span>Sacred Devotee & Volunteer Feed</span>
          </div>
          <h1 className="text-3xl font-black text-white">Event & Festival Community Feed</h1>
          <p className="text-slate-400 text-sm mt-1">Connect with fellow devotees, view live streaming links, and receive committee updates.</p>
        </div>

        {/* Create Post Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-10 shadow-xl">
          <h3 className="text-sm font-bold text-white mb-3">Share a Memory or Announcement</h3>
          <form onSubmit={handleCreatePost} className="space-y-3">
            <input
              type="text"
              placeholder="Post Title..."
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
            />
            <textarea
              rows={3}
              placeholder="Write your update, festival experience, or divine message..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-orange-500 focus:outline-none"
            />
            <div className="flex justify-between items-center pt-2">
              <div className="flex space-x-3 text-slate-400 text-xs font-semibold">
                <button type="button" className="flex items-center gap-1 hover:text-orange-400">
                  <ImageIcon className="w-4 h-4 text-orange-400" /> Photo
                </button>
                <button type="button" className="flex items-center gap-1 hover:text-blue-400">
                  <Video className="w-4 h-4 text-blue-400" /> Live Stream
                </button>
              </div>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md shadow-orange-600/30"
              >
                Publish Post
              </button>
            </div>
          </form>
        </div>

        {/* Feed List */}
        <div className="space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              
              {/* Post Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white text-sm">{post.author}</span>
                    {post.announcement && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                        <Megaphone className="w-3 h-3" /> ANNOUNCEMENT
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">{post.time}</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-base font-extrabold text-white">{post.title}</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{post.content}</p>
              </div>

              {/* Media Image */}
              {post.mediaUrl && (
                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-800">
                  <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Interactions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1.5 hover:text-orange-400 font-bold transition"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes} Likes</span>
                </button>
                
                <div className="flex items-center space-x-1.5 font-bold">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span>{post.comments.length} Comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="bg-slate-950 rounded-2xl p-4 space-y-3">
                {post.comments.map((c) => (
                  <div key={c.id} className="text-xs space-y-0.5">
                    <span className="font-bold text-orange-400">{c.author}: </span>
                    <span className="text-slate-300">{c.text}</span>
                  </div>
                ))}

                <div className="flex space-x-2 pt-2">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ''}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddComment(post.id)}
                    className="p-2 rounded-xl bg-orange-600 text-white"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
