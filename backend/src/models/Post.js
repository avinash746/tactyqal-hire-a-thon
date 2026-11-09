import mongoose from 'mongoose';

const tagSchema = new mongoose.Schema(
  { name: { type: String, required: true, trim: true }, slug: { type: String, required: true } },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true }, // Markdown
    coverImage: { type: String, default: '' },
    author: { type: String, default: 'Tactyqal' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    readTime: { type: Number, default: 1 }, // minutes
    tags: { type: [tagSchema], default: [] },
    publishedAt: { type: Date, default: null }
  },
  { timestamps: true } // createdAt, updatedAt
);

postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ 'tags.slug': 1 });

export default mongoose.models.Post || mongoose.model('Post', postSchema);
