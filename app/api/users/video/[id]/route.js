import { NextResponse } from 'next/server';
import Video from '@/models/Video';
import connectDB from '@/utils/db';

export async function DELETE(request, { params }) {
  await connectDB();

  const {id} = await params

  try {
    const video = await Video.findByIdAndDelete(id);
    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: 'Video deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete video error:', error);
    return NextResponse.json(
      { error: 'Error deleting video' },
      { status: 500 }
    );
  }
}
