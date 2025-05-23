import { NextResponse } from 'next/server';
import Video from '@/models/Video';
import connectDB from '@/utils/db';

export async function GET(request, { params }) {
  await connectDB();

  const {id} = await params

  try {
    const videos = await Video.find({
      'uploaded_by.user_email': id,
      // If using _id, change to: 'uploaded_by._id': params.userId
      // For this example, we use user_email as identifier
    }).sort({ createdAt: -1 });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('Fetch user videos error:', error);
    return NextResponse.json(
      { error: 'Error fetching user videos' },
      { status: 500 }
    );
  }
}
