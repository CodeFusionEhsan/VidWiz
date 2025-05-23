import { NextResponse } from 'next/server';
import Video from '@/models/Video';
import connectDB from '@/utils/db';

export async function GET(request) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    let videos;
    if (query) {
      // Search by title, description, or tags
      videos = await Video.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { tags: { $regex: query, $options: 'i' } },
        ],
      }).sort({ createdAt: -1 });
    } else {
      // Fetch all videos
      videos = await Video.find().sort({ createdAt: -1 });
    }
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Error fetching videos.' },
      { status: 500 }
    );
  }
}
