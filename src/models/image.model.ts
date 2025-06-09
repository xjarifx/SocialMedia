import mongoose, { Schema, Document, Model } from "mongoose";

interface ImageDocument extends Document {
  user_id: number;
  url: string;
  type: string;
  created_at: Date;
}

const imageSchema: Schema = new Schema({
  user_id: { type: Number, required: true },
  url: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'profile', 'post'
  created_at: { type: Date, default: Date.now },
});

const Image: Model<ImageDocument> = mongoose.model<ImageDocument>(
  "Image",
  imageSchema
);

export default Image;
