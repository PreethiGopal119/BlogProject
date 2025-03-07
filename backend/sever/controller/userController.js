import User from "../model/usermodel.js";
import Blog from "../model/blogmodel.js";
import Comment from "../model/commentmodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashPassword, role });
    await user.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const createBlog = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const newBlog = new Blog({
      title,
      content,
      category,
      author: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : null, 
    });

    await newBlog.save();
    res.json(newBlog);
  } catch (err) {
    res.status(500).json({ msg: "Error creating blog" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name");

    const blogsWithImages = blogs.map((blog) => ({
      ...blog._doc,
      image: blog.image
        ? `${req.protocol}://${req.get("host")}${
            blog.image.startsWith("/") ? "" : "/"
          }${blog.image.replace(/\\/g, "/")}`
        : null,
    }));

    res.json(blogsWithImages);
  } catch (err) {
    console.error("Error fetching blogs:", err); 
    res.status(500).json({ msg: "Error fetching blogs" });
  }
};


export const createComment = async (req, res) => {
  try {
    const { blogId, text } = req.body;
    if (!text.trim()) {
      return res.status(400).json({ msg: "Comment cannot be empty" });
    }

    const comment = new Comment({
      blogId,
      userId: req.user.id,
      text,
      status: "",
    });

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ msg: "Error creating comment" });
  }
};


export const getComments = async (req, res) => {
  try {
    const { blogId } = req.query; 
    if (!blogId) {
      return res.status(400).json({ msg: "Blog ID is required" });
    }

    const comments = await Comment.find({ blogId })
      .populate("userId", "name") 
      .sort({ createdAt: -1 }); 

    res.status(200).json(comments);
  } catch (err) {
    console.error("Error retrieving comments:", err);
    res.status(500).json({ msg: "Error retrieving comments", error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this comment" });
    }

    await Comment.findByIdAndDelete(commentId);
    res.json({ msg: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting comment", error });
  }
};

export const getUserLikes = async (req, res) => {
  try {
    const { userID } = req.params;
    const likes = await Comment.find({ userId: userID });

    const likeStatus = likes.reduce((acc, like) => {
      acc[like.blogId] = like.status;
      return acc;
    }, {});

    res.json(likeStatus);
  } catch (error) {
    res.status(500).json({ message: "Error fetching likes", error });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userID = req.user.id;

    let likeRecord = await Comment.findOne({ userId: userID, blogId });

    if (!likeRecord) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    likeRecord.status = likeRecord.status === "liked" ? "" : "liked";

    await likeRecord.save();
    res.json({ message: "Success", status: likeRecord.status });
  } catch (error) {
    res.status(500).json({ message: "Error toggling like", error });
  }
};
