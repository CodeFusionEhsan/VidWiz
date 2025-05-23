'use client';
import { useState, useRef } from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { useUser } from '@clerk/nextjs';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function UploadPage() {
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState("");
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const {user, isLoaded} = useUser()

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploadSuccess(false);

    if (!videoFile) {
      setError('Please select a video file.');
      return;
    }
    if (!title) {
      setError('Title is required.');
      return;
    }

    setLoading(true);

    // Simulate upload (replace with your actual API call)
    try {
      // In a real app, you would use fetch/formData to send to your API
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', tags);
      formData.append('uploaded_by', JSON.stringify({
        user_name: user?.fullName,
        user_email: user?.emailAddresses[0].emailAddress,
        user_image: user?.imageUrl
    }));

      const res = await fetch('/api/videos', {
        method: "POST",
        body: formData
      })

      const jsres = await res.json()

      // For demo, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setUploadSuccess('Video uploaded successfully!');
      setTitle("")
      setDescription("")
      setTags("")
      setVideoFile("")
      setPreviewUrl("")
    } catch (err) {
      setError('Failed to upload video. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Upload Video
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Video Upload Preview */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {previewUrl ? (
                      <video
                        src={previewUrl}
                        className="mx-auto h-48 object-cover"
                        controls
                      />
                    ) : (
                      <div className="text-gray-600">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="mt-2 text-sm">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <CldUploadWidget
                                uploadPreset="ajiy2qfo"
                                onSuccess={(result, { widget }) => {
                                setVideoFile(result?.info.url);
                                setPreviewUrl(result?.info.url)
                                console.log(result)
                                widget.close();
                                }}
                            >
                                {({ open }) => {
                                function handleOnClick() {
                                    setVideoFile("");
                                    setPreviewUrl("")
                                    open();
                                }
                                return (
                                    <button onClick={handleOnClick}>
                                    Upload a Video
                                    </button>
                                );
                                }}
                            </CldUploadWidget>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          MP4, AVI, MOV up to 1GB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title Input */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              {/* Description Input */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>

              {/* Tags Input */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <label className="block text-sm font-medium text-gray-700">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              

              {/* Error and Success Messages */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              {uploadSuccess && (
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm text-green-600">{uploadSuccess}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Uploading...' : 'Upload Video'}
                </button>
              </div>
            </form>
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
