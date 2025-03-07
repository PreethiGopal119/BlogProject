import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import Api from "../Api";
import "./BlogDetails.css";

function BlogDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state?.blog;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const fetchComments = useCallback(async () => {
    try {
      const res = await Api.get(`/blogs/comments?blogId=${blog._id}`);
      setComments(res?.data || []);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  }, [blog?._id]);

  useEffect(() => {
    if (blog?._id) {
      fetchComments();
    }
  }, [blog?._id, fetchComments]);

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem("token");

      await Api.post(
        "/blogs/comments",
        {
          blogId: blog._id,
          text: newComment,
          status: "liked",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (!blog) {
    return <h2 className="blog-detail-no-data">No blog data available</h2>;
  }

  return (
    <div className="blog-detail-container">
      <div >
        <center>
          <h4 style={{ fontWeight: "bold", paddingTop: "20px" }}>
            The Inside Scoop
          </h4>
        </center>
        <div
          className="d-block container "
          style={{ height: "-webkit-fill-available", alignContent: "center" }}
        >
          <div>
            <Card
              className="shadow-lg p-4"
              style={{ border: "none", backgroundColor: "transparent" }}
            >
              <Row>
                <Col md={6}>
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="blog-detail-image"
                    />
                  )}
                </Col>
                <Col md={6} className="d-flex flex-column ">
                  <h3 level={3} className="mb-3 mt-2">
                    <strong>Title :</strong> &nbsp; {blog.title}
                  </h3>
                  <div
                    className=" p-3"
                    // style={{ maxHeight: "150px", overflowY: "auto" }}
                  >
                    <p>
                      <strong>Content :</strong> &nbsp;&nbsp;{blog.content}
                    </p>
                  </div>
                  <div>
                    <strong>Category :</strong> &nbsp;{blog.category}
                  </div>
                  <div>
                    <strong>Post by: </strong> &nbsp;{blog.author.name}
                  </div>
                  <div>
                    <div className="d-flex justify-content-between align-items-center mt-3 text-muted">
                      <span>
                        <strong>Posted On :</strong> &nbsp;
                        {new Date(blog.updatedAt).toLocaleString()}
                      </span>
                    </div>
                    <Row className="mt-5">
                      <Col>
                        <div className="d-flex gap-3">
                          <br />
                          <Button variant="dark" onClick={() => navigate(-1)}>
                            Go Back
                          </Button>
                          <Row>
                            <Col lg={6} xs={12}>
                              <Form.Control
                                className="blog-detail-comment-input"
                                type="text"
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleComment()
                                }
                              />
                            </Col>
                            <Col lg={2} xs={12}>
                              <Button
                                variant="success"
                                size="sm"
                                className="blog-detail-comment-btn"
                                onClick={handleComment}
                              >
                                Comment
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <div className="blog-detail-comment-list-container">
                    <ul className="blog-detail-comment-list">
                      {comments.length === 0 ? (
                        <p>No comments yet. Be the first to comment!</p>
                      ) : (
                        comments.map((comment, index) => (
                          <li key={index} className="blog-detail-comment">
                            <strong>
                              {comment.userId?.name || "Unknown"}:
                            </strong>{" "}
                            {comment.text}
                            <br />
                            <small>
                              {new Date(comment.createdAt).toLocaleString()}
                            </small>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </div>
     
    </div>
  );
}

export default BlogDetail;
