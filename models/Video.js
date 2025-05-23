// models/Video.js (Mongoose Model)
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user_name: String,
  user_email: String,
  user_image: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, index: true },
  videoUrl: { type: String, required: true },
  tags: [String],
  uploaded_by: {
    user_name: String,
    user_email: String,
    user_image: String
  },
  likes: [{ type: String}],
  comments: [commentSchema],
  views: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes for search optimization
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

export default mongoose.models.videos || mongoose.model('videos', videoSchema);
