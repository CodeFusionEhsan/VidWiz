'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [allVideos, setAllVideos] = useState([]);
  const [searchedVideos, setSearchedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch all videos on initial load
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/get');
        const data = await res.json();
        setAllVideos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/get?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchedVideos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Clear search and show all videos
  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  // Videos to display: searched videos if searching, otherwise all videos
  const videosToDisplay = isSearching ? searchedVideos : allVideos;

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
            Discover & Share Amazing Videos
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Find, watch, and upload your favorite videos. Join our creative community today!
          </p>
          <form onSubmit={handleSearch} className="flex items-center max-w-lg mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search videos..."
              className="w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
          ) : videosToDisplay.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {isSearching
                  ? 'No videos found matching your search.'
                  : 'No videos found. Upload one to get started!'}
              </p>
              {isSearching && (
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {isSearching ? `Results for "${searchQuery}"` : 'Latest Videos'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videosToDisplay.map((video) => (
                  <div key={video._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Link href={`/videos/${video._id}`}>
                      <video
                        src={video.videoUrl}
                        className="w-full aspect-video object-cover"
                        controls
                      />
                    </Link>
                    <div className="p-4">
                      <Link href={`/videos/${video._id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{video.description.slice(0, 300) + "..."}</p>
                       </Link>
                      <div className="flex items-center space-x-2 mb-3">
                        <img
                          src={video.uploaded_by.user_image}
                          alt={video.uploaded_by.user_name}
                          className="h-8 w-8 rounded-full"
                        />
                        <span className="text-sm text-gray-600">{video.uploaded_by.user_name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <span className="text-sm text-gray-500">Likes: {video.likes.length}</span>
                        <span className="text-sm text-gray-500">Views: {video.views}</span>
                      </div>
                      <div className="mt-2">
                        {video.tags.map((tag, idx) => (
                          <span key={idx} className="inline-block bg-gray-100 rounded-full px-2 py-1 text-xs text-gray-600 mr-2 mb-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Edit Hero Section */}
      <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Edit Your Videos With Ease
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Upload and customize your videos right here. Add effects, overlays, and more!
          </p>
          <Link
            href="/editor"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Edit Now
          </Link>
        </div>
      </section>
    </main>
  );
}
