import Router from "express";
import {
  register,
  login,
  createBlog,
  getAllBlogs,
  createComment,
  getComments,
  getUserLikes, 
  toggleLike,
  deleteComment,
} from "../controller/userController.js";
import multer from "multer";
import path from "path";
import verifyToken from "../controller/middleware.js";

const router = Router();

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

router.post("/auth/register", register);
router.post("/auth/login", login);
router.post("/blogs", verifyToken, upload.single("image"), createBlog);
router.get("/getallblogs", getAllBlogs);
router.post("/comments", verifyToken, createComment);
router.get("/:blogId", getComments);
router.get("/likes/:userID", verifyToken, getUserLikes);
router.post("/like/:blogId", verifyToken, toggleLike);
router.delete("/comments/:commentId", verifyToken, deleteComment);
export default router;
