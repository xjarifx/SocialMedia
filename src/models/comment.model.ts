import mongoose, { Schema, Document, Model } from "mongoose";

interface CommentContent {
  text: string;
}

interface CommentDocument extends Document {
  post_id: mongoose.Types.ObjectId;
  user_id: number;
  content: CommentContent;
  created_at: Date;
}

const commentSchema: Schema = new Schema({
  post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  user_id: { type: Number, required: true },
  content: {
    text: { type: String, required: true },
  },
  created_at: { type: Date, default: Date.now },
});

const Comment: Model<CommentDocument> = mongoose.model<CommentDocument>(
  "Comment",
  commentSchema
);

export default Comment;
