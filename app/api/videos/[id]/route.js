'use server'

import { NextResponse } from 'next/server';
import Video from '@/models/Video';
import connectDB from '@/utils/db';


export async function GET(request, { params }) {
  await connectDB();

  const {id} = await params

  try {
    const video = await Video.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(video);
  } catch (error) {
    console.error('Fetch video error:', error);
    return NextResponse.json(
      { error: 'Error fetching video' },
      { status: 500 }
    );
  }
}
