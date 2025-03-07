import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";
import { Form, Button, Container, Card } from "react-bootstrap";
import "./BlogList.css";

function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token");

    try {
      await Api.post("/blogs/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-auth-token": token,
        },
      });
      navigate("/bloglist");
    } catch (error) {
      console.error("Error creating blog", error);
    }
  };

  return (
    <Container className="create-blog-container">
      <Card className="create-blog-card">
        <h2 className="create-blog-title">Create a New Blog</h2>
        <Form onSubmit={handleCreate}>
          <Form.Group className="create-blog-form-group">
            <Form.Label className="create-blog-label">Title</Form.Label>
            <Form.Control
              className="create-blog-input"
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="create-blog-form-group">
            <Form.Label className="create-blog-label">Content</Form.Label>
            <Form.Control
              className="create-blog-textarea"
              as="textarea"
              rows={5}
              placeholder="Write your content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="create-blog-form-group">
            <Form.Label className="create-blog-label">Category</Form.Label>
            <Form.Select
              className="create-blog-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Technology">Technology</option>
              <option value="Education">Education</option>
              <option value="Lifestyle">Lifestyle</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="create-blog-form-group">
            <Form.Label className="create-blog-label">Upload Image</Form.Label>
            <Form.Control
              className="create-blog-file"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          {image && (
            <div className="create-blog-image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="create-blog-preview-img"
              />
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            className="create-blog-submit-btn"
          >
            Publish Blog
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default CreateBlog;
