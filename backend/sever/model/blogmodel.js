
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const BlogSchema = new mongoose.Schema({
    title: String,
    content: String,
    category: String,
    image: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  });
const User = mongoose.model("Blog", BlogSchema);

export default model("Blog", BlogSchema);
