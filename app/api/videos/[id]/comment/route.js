'use server'

import { NextResponse } from 'next/server';
import Video from '@/models/Video';
import connectDB from '@/utils/db';

export async function POST(request, { params }) {
  await connectDB();

  const {id} = await params

  // In a real app, get user info from session/auth
  const formData = await request.formData()

  const user_name = formData.get('user_name')
  const user_email = formData.get('user_email')
  const user_image = formData.get('user_image')
  const text = formData.get('text')

  try {
    const video = await Video.findById(id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    video.comments.push({
      user_name,
      user_email,
      user_image,
      text,
    });

    await video.save();

    return NextResponse.json(
      { message: 'Comment added', video },
      { status: 200 }
    );
  } catch (error) {
    console.error('Add comment error:', error);
    return NextResponse.json(
      { error: 'Error adding comment' },
      { status: 500 }
    );
  }
}
