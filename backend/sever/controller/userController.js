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

    const comment = new Comment({
      blogId,
      userId: req.user.id,
      text,
    });

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ msg: "Error creating comment" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

