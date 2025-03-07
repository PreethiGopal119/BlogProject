import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CommentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  blogId: { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  text: { type: String, required: true },
  status: { type: String, enum: ["liked", "removed", ""], default: "" }, 
}, { timestamps: true });

export default model("Comment", CommentSchema);
