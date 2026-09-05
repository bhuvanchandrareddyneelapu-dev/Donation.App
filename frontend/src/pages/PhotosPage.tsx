import React, { useState } from 'react';
import { Camera, Sparkles, X, ZoomIn, Calendar, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PhotoItem {
  id: string;
  url: string;
  title: string;
  category: string;
  date: string;
  description: string;
  isOfficialIdol?: boolean;
}

export const PhotosPage: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  const officialGaneshIdolUrl = '/assets/images/unicode-estates-ganesh-idol.png';

  const photos: PhotoItem[] = [
    {
      id: 'idol-main',
      url: officialGaneshIdolUrl,
      title: 'Official Unicode Estates Lord Ganesha Idol',
      category: 'Ganesh Darshan',
      date: '14 Sept 2026',
      description: 'The sacred, magnificent Lord Ganesha idol established at Unicode Estates Clubhouse Mandap for 2026 Celebrations.',
      isOfficialIdol: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs uppercase tracking-wider">
            <Camera className="w-4 h-4 text-orange-400" />
            <span>Unicode Estates Gallery</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Festival Photo Gallery
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Capturing the divine moments, daily Sthapana puja, Aarti, Mahaprasadam distribution, and devotional celebrations at Unicode Estates Ganesh Chaturthi 2026.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-400 pt-2">
            <div className="flex items-center space-x-1.5 text-amber-300">
              <MapPin className="w-4 h-4" />
              <span>Unicode Estates Clubhouse Mandap</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-1.5 text-orange-400">
              <Calendar className="w-4 h-4" />
              <span>Ganesh Chaturthi 2026</span>
            </div>
          </div>
        </div>

        {/* Featured Official Ganesh Idol Spotlight */}
        <div className="bg-gradient-to-r from-orange-950/60 via-slate-900 to-amber-950/50 border border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Official Shrine & Idol Photo</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Unicode Estates Lord Ganesha
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Take virtual darshan of our official community idol. High-resolution photos of daily Alankar, Pushparchan, and evening Aarti are uploaded here daily during the 7-day festival.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedPhoto(photos[0])}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/30 hover:brightness-110 flex items-center space-x-2 transition"
                >
                  <ZoomIn className="w-4 h-4" />
                  <span>View Fullscreen High-Res Photo</span>
                </button>

                <Link
                  to="/ganesh"
                  className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center space-x-2 transition"
                >
                  <Heart className="w-4 h-4 text-orange-400" />
                  <span>Devotional Darshan & Aarti</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div 
                onClick={() => setSelectedPhoto(photos[0])}
                className="relative rounded-2xl overflow-hidden border border-amber-500/40 shadow-2xl cursor-pointer group bg-slate-950 aspect-[4/3]"
              >
                <img
                  src={officialGaneshIdolUrl}
                  alt="Unicode Estates Lord Ganesha Idol"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center text-white">
                  <div>
                    <span className="text-xs font-black text-amber-300">Unicode Estates 2026</span>
                    <h4 className="text-sm font-extrabold">Shree Ganesh Sthapana Mandap</h4>
                  </div>
                  <div className="p-2.5 rounded-xl bg-orange-500/80 text-white group-hover:scale-110 transition-transform">
                    <ZoomIn className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>Festival Moments</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400">
                1 Asset
              </span>
            </h3>
            <div className="text-xs text-slate-400 font-medium">
              Updated Live by Committee Admins
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="bg-slate-900 border border-slate-800 hover:border-orange-500/50 rounded-2xl overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold border border-amber-500/30">
                    {photo.category}
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h4 className="text-sm font-extrabold text-white group-hover:text-orange-400 transition-colors">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {photo.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                    <span>{photo.date}</span>
                    <span className="text-orange-400 font-semibold flex items-center space-x-1">
                      <ZoomIn className="w-3 h-3" />
                      <span>Click to Enlarge</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State Banner for upcoming festival photos */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-white">More Festival Photos Coming Soon</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
              Official puja, morning Mahaprasadam, cultural dance performances, and Visarjan procession photos will be uploaded here during festival week!
            </p>
          </div>
        </div>

      </div>

      {/* Lightbox Fullscreen Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-y-auto">
          <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl my-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-black uppercase">
                  {selectedPhoto.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold">• {selectedPhoto.date}</span>
              </div>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image Display */}
            <div className="p-4 sm:p-6 bg-slate-950 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-h-[65vh] w-auto object-contain rounded-2xl shadow-2xl border border-slate-800"
              />
            </div>

            {/* Modal Description Footer */}
            <div className="p-5 sm:p-6 space-y-3 bg-slate-900 border-t border-slate-800">
              <h3 className="text-lg font-black text-white">{selectedPhoto.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedPhoto.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Official Unicode Estates Visual Asset</span>
                </div>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Close Preview
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
