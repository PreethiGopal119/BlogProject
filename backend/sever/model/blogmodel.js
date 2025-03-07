// import mongoose from "mongoose";
// const { Schema, model } = mongoose;

// const BlogSchema = new mongoose.Schema({
//     title: String,
//     content: String,
//     category: String,
//     image: String,
//     author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   });
// const User = mongoose.model("Blog", BlogSchema);

// export default model("Blog", BlogSchema);
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    image: { type: String },
    category: { type: String },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],

  },
  { timestamps: true }
);

export default model("Blog", BlogSchema);
