'use client';
import { useState, useRef } from 'react';
import { Video, Transformation } from 'cloudinary-react';
import { Cloudinary } from '@cloudinary/url-gen';

export default function VideoEditor() {
  const [videoUrl, setVideoUrl] = useState('');
  const [publicId, setPublicId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cropMode, setCropMode] = useState('fill');
  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(360);
  const [overlayText, setOverlayText] = useState('Your Overlay Text');
  const [overlayColor, setOverlayColor] = useState("#FF66EB");
  const [overlaySize, setOverlaySize] = useState(30);
  const [xpos, setXpos] = useState(50)
  const [ypos, setYpos] = useState(50)
  const fileInputRef = useRef(null);

  const cloudinary = new Cloudinary({
    cloud: { cloudName: 'dhdsslool' }
  });

  const uploadVideo = async (e) => {
    setIsUploading(true);
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ajiy2qfo');
    formData.append('cloud_name', 'dhdsslool');

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dhdsslool/video/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await res.json();
      console.log(data)
      setPublicId(data.public_id);
      setVideoUrl(data.secure_url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async () => {
    if (!publicId) return;

    // For demo, use the Cloudinary URL directly
    // In production, you might want to use the API to generate a download link
    const downloadUrl = cloudinary.video(publicId)
      .toURL({
        transformation: [
          { width, height, crop: cropMode },
          {
            overlay: {
              font_family: 'Arial',
              font_size: overlaySize,
              font_weight: 'bold',
              text: overlayText,
              color: overlayColor,
            },
            y: ypos,
            x: xpos
          },
        ],
      });

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'edited-video.mp4';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900">
          VidWiz Video Editor
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Preview Section */}
          <div className="flex-1 bg-white rounded-xl shadow-md overflow-hidden p-4">
            <div className="w-full aspect-video bg-gray-200 flex items-center justify-center rounded-lg">
              {publicId ? (
                <Video
                  cloudName="dhdsslool"
                  publicId={publicId}
                  controls
                  className="w-full h-full object-contain rounded-md"
                >
                  <Transformation width={width} height={height} crop={cropMode} />
                  <Transformation
                    overlay={{
                      font_family: 'Arial',
                      font_size: overlaySize,
                      font_weight: 'bold',
                      text: overlayText,
                      color: overlayColor,
                    }}
                    y={ypos}
                    x={xpos}
                  />
                </Video>
              ) : (
                <div className="text-gray-500">Upload a video to preview</div>
              )}
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex-1 flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Video
              </label>
              <input
                type="file"
                accept="video/*"
                ref={fileInputRef}
                onChange={uploadVideo}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {isUploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop Mode
              </label>
              <select
                value={cropMode}
                onChange={(e) => setCropMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="fill">Fill</option>
                <option value="fit">Fit</option>
                <option value="crop">Crop</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Width
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overlay X Position
                </label>
                <input
                  type="number"
                  value={xpos}
                  onChange={(e) => setXpos(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overlay Y Position
                </label>
                <input
                  type="number"
                  value={ypos}
                  onChange={(e) => setYpos(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overlay Text
              </label>
              <input
                type="text"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overlay Color
                </label>
                <input
                  type="color"
                  value={overlayColor}
                  onChange={(e) => setOverlayColor(e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overlay Size
                </label>
                <input
                  type="number"
                  value={overlaySize}
                  onChange={(e) => setOverlaySize(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={!publicId}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download Edited Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
