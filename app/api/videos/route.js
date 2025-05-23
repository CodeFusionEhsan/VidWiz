import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import Video from '@/models/Video'; // Adjust path as needed
import connectDB from '@/utils/db'; // Adjust path as needed

export async function POST(request) {
  await connectDB(); // Connect to your MongoDB

  const formData = await request.formData();

  // Extract fields from form data
  const title = formData.get('title');
  const description = formData.get('description');
  const tags = formData.get('tags');
  const videoFile = formData.get('video');
  const uploaded_by = JSON.parse(formData.get('uploaded_by'));

  // Handle missing file or fields
  if (!videoFile || !title) {
    return NextResponse.json(
      { error: 'Video file and title are required.' },
      { status: 400 }
    );
  }

  try {

    // Create video document in MongoDB
    const video = new Video({
      title,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      videoUrl: videoFile,
      uploaded_by,
      likes: [],
      comments: [],
      views: 0,
    });

    await video.save();

    return NextResponse.json(
      { message: 'Video uploaded successfully!', video },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Error uploading video.' },
      { status: 500 }
    );
  }
}
