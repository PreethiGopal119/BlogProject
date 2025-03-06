import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export default model("Comment", CommentSchema);
