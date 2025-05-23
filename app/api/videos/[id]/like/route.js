'use server'

import { NextResponse } from 'next/server';
import Video from '@/models/Video';
import connectDB from '@/utils/db';

export async function POST(request, { params }) {
  await connectDB();

  const {id} = await params

  // In a real app, get user ID from session/auth
  const formData = await request.formData()
  const userId  = formData.get("userId") // Replace with actual auth logic

  try {
    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if user already liked
    if (video.likes.includes(userId)) {
      return NextResponse.json(
        { message: 'Already liked', video },
        { status: 200 }
      );
    }

    video.likes.push(userId);
    await video.save();

    return NextResponse.json(
      { message: 'Liked video', video },
      { status: 200 }
    );
  } catch (error) {
    console.error('Like video error:', error);
    return NextResponse.json(
      { error: 'Error liking video' },
      { status: 500 }
    );
  }
}
