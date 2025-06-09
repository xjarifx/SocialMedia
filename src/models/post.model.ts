import mongoose, { Schema, Document, Model } from "mongoose";

interface PostContent {
  text: string;
  image_url?: string;
}

interface PostDocument extends Document {
  user_id: number;
  content: PostContent;
  created_at: Date;
  updated_at: Date;
}

const postSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  content: {
    text: { type: String, required: true },
    image_url: String,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Post: Model<PostDocument> = mongoose.model<PostDocument>(
  "Post",
  postSchema
);

export default Post;
