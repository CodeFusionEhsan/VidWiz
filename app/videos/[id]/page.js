'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { use } from 'react';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function VideoPage({ params }) {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  // For demo, user info is hardcoded; in production, get from session/auth
  const {user, isLoaded} = useUser()

  const router = useRouter();

  // Fetch video
  useEffect(() => {
    const fetchVideo = async () => {
      setLoading(true);
      try {
        const {id} = await params
        const res = await fetch(`/api/videos/${id}`);
        const data = await res.json();
        if (res.ok) {
          setVideo(data);
          setLikesCount(data.likes.length);
          setIsLiked(data.likes.includes(user.id));
        } else {
          setError(data.error || 'Video not found');
        }
      } catch (err) {
        setError('Error fetching video');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, []);

  // Handle like
  const handleLike = async () => {
    const {id} = await params
    setIsLiking(true);
    try {

        const formData = new FormData()
        formData.append("userId", user.id)
      const res = await fetch(`/api/videos/${id}/like`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      }
    } catch (err) {
      console.error('Error liking video:', err);
    } finally {
      setIsLiking(false);
    }
  };

  // Handle comment
  const handleComment = async () => {
    const {id} = await params
    if (!commentText.trim()) return;
    setIsCommenting(true);
    try {
        const formData = new FormData()
        formData.append("user_name", user.fullName)
        formData.append("user_email", user.emailAddresses[0].emailAddress)
        formData.append("user_image", user.imageUrl)
        formData.append("text", commentText)
      const res = await fetch(`/api/videos/${id}/comment`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setVideo(data.video);
        setCommentText('');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsCommenting(false);
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

  if (!video) return null;

  return (
    <>
      <SignedIn>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <video
              src={video.videoUrl}
              className="w-full aspect-video object-cover"
              controls
            />
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
              <p className="text-gray-600 mb-4">{video.description}</p>
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={video.uploaded_by.user_image}
                  alt={video.uploaded_by.user_name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{video.uploaded_by.user_name}</p>
                  <p className="text-sm text-gray-500">{video.uploaded_by.user_email}</p>
                </div>
              </div>
              <div className="flex space-x-4 mb-4">
                <span className="text-sm text-gray-500">
                  {video.views} {video.views === 1 ? 'view' : 'views'}
                </span>
                <span className="text-sm text-gray-500">
                  {likesCount} {likesCount === 1 ? 'like' : 'likes'}
                </span>
              </div>
              <div className="mb-4">
                {video.tags.map((tag, idx) => (
                  <span key={idx} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600 mr-2 mb-2">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isLiked
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } ${isLiking ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLiking ? (
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
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                  {isLiked ? 'Liked' : 'Like'}
                </button>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={handleComment}
                    disabled={isCommenting || !commentText.trim()}
                    className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 ${
                      isCommenting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isCommenting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
                {video.comments.length === 0 ? (
                  <p className="text-gray-500">No comments yet</p>
                ) : (
                  video.comments.map((comment, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <img
                        src={comment.user_image}
                        alt={comment.user_name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="bg-gray-100 rounded-lg p-3 flex-1">
                        <p className="font-medium text-gray-900">{comment.user_name}</p>
                        <p className="text-sm text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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
