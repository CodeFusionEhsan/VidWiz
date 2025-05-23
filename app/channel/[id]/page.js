'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function ChannelPage({ params }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  const {user, isLoaded} = useUser()

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const {id} = await params
        const videosRes = await fetch(`/api/users/${id}`);
        if (!videosRes.ok) throw new Error('Failed to fetch videos');
        const videosData = await videosRes.json();
        setVideos(videosData);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (videoId) => {
    setDeletingId(videoId);
    try {
      const res = await fetch(`/api/users/video/${videoId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete video');
      setVideos(videos.filter(v => v._id !== videoId));
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">{error}</p>
        <Link href="/" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">User not found.</p>
        <Link href="/" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <>
    <SignedIn>
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
            {/* User Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                src={user.image || user.imageUrl || '/default-user.png'}
                alt={user.name || user.fullName || 'User'}
                className="h-16 w-16 rounded-full"
                />
                <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user.name || user.fullName || 'User'}</h1>
                <p className="text-gray-600">{user.email || user.emailAddresses[0].emailAddress}</p>
                </div>
            </div>
            </div>

            {/* User Videos */}
            <h2 className="text-xl font-bold text-gray-900 mb-6">Videos</h2>
            {videos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
                <p className="text-gray-500">No videos uploaded yet.</p>
                {user.email && (
                <Link
                    href="/upload"
                    className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Upload Video
                </Link>
                )}
            </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                <div key={video._id} className="bg-white rounded-xl shadow-md overflow-hidden">
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
                    <div className="mt-4">
                        <button
                        onClick={() => handleDelete(video._id)}
                        disabled={deletingId === video._id}
                        className={`w-full px-4 py-2 rounded-lg transition-all duration-300 ${
                            deletingId === video._id
                            ? 'bg-red-400 text-white cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                        >
                        {deletingId === video._id ? (
                            <span className="flex items-center justify-center gap-2">
                            <svg
                                className="animate-spin h-5 w-5 text-current"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                                className="opacity-25"
                                />
                                <path
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                className="opacity-75"
                                />
                            </svg>
                            Deleting...
                            </span>
                        ) : (
                            'Delete Video'
                        )}
                        </button>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>
        </div>
    </SignedIn>
    <SignedOut>
        <section className="bg-white pt-20 px-4 sm:px-6 lg:px-8 h-114.25">
              <div className="max-w-4xl pt-20 mx-auto text-center">
                <h1 className="text-4xl font-bold text-black sm:text-5xl mb-4">
                  Welcome to VidWiz
                </h1>
                <p className="text-xl text-black mb-8">
                  Discover, upload, and share your favorite videos with the world.
                </p>
                <SignInButton className="inline-block px-8 py-3 bg-indigo-700 text-white font-medium rounded-lg hover:bg-indigo-50 transition-all duration-300"/>
              </div>
            </section>
    </SignedOut>
    </>
  );
}
