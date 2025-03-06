import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import Api from "../Api";
import { useNavigate } from "react-router-dom";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await Api.get("/blogs/getallblogs");
      setBlogs(res?.data);
    } catch (error) {
      console.error("Error fetching blogs", error);
    }
  };

  const handleReadMore = (blog) => {
    navigate("/blogdetails", { state: { blog } });
  };

  const handleLike = async (blogId) => {
    try {
      await Api.post(`/blogs/like/${blogId}`);
      fetchBlogs(); // Refresh data
    } catch (error) {
      console.error("Error liking blog", error);
    }
  };

  const handleComment = async (blogId) => {
    const commentText = comments[blogId] || "";
    if (!commentText.trim()) return;

    try {
      await Api.post("/blogs/comment", { blogId, text: commentText });
      setComments({ ...comments, [blogId]: "" }); // Clear input after submit
      fetchBlogs(); // Refresh data
    } catch (error) {
      console.error("Error adding comment", error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Latest Blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-center">No blogs found.</p>
      ) : (
        <Row>
          {blogs.map((blog) => (
            <Col key={blog._id} md={4} className="mb-4">
              <Card className="shadow-sm">
                {blog.image && (
                  <Card.Img
                    variant="top"
                    src={blog.image}
                    alt={blog.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{blog.title}</Card.Title>
                  <Card.Text>{blog.content.substring(0, 100)}...</Card.Text>
                  <Button variant="primary" onClick={() => handleReadMore(blog)}>
                    Read More
                  </Button>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    By {blog.author?.name || "Unknown"}
                  </small>
                  <div className="mt-2">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleLike(blog._id)}
                    >
                      ❤️ {blog.likes || 0} Likes
                    </Button>
                  </div>
                  <div className="mt-3">
                    <Form.Control
                      type="text"
                      placeholder="Add a comment..."
                      value={comments[blog._id] || ""}
                      onChange={(e) =>
                        setComments({ ...comments, [blog._id]: e.target.value })
                      }
                    />
                    <Button
                      variant="success"
                      size="sm"
                      className="mt-2"
                      onClick={() => handleComment(blog._id)}
                    >
                      Comment
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default BlogList;
