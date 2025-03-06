
import express, { json } from "express";
import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(
  json({
    limit: "25mb",
  })
);

app.use("/uploads", express.static(path.resolve("uploads")));

import blogRoutes from './sever/router/router.js'

app.use("/api/blogs", blogRoutes);

export default app;
