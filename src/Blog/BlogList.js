import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import Api from "../Api";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FcLike } from "react-icons/fc";
import { GoHeart } from "react-icons/go";

function BlogList({ userID }) {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likes, setLikes] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await Api.get("/blogs/getallblogs");
        const blogsData = res?.data || [];
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);

        const uniqueCategories = ["All", ...new Set(blogsData.map((blog) => blog.category))];
        setCategories(uniqueCategories);

        if (userID) {
          fetchLikeStatuses(blogsData);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    const fetchLikeStatuses = async (blogsData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const likeStatuses = {};
        for (const blog of blogsData) {
          const res = await Api.get(`/blogs/getLikeStatus/${userID}/${blog._id}`);
          likeStatuses[blog._id] = res.data.status || "";
        }
        setLikes(likeStatuses);
      } catch (error) {
        console.error("Error fetching like statuses:", error);
      }
    };

    fetchBlogs();
  }, [userID]);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setFilteredBlogs(category === "All" ? blogs : blogs.filter((blog) => blog.category === category));
  };

  const handleReadMore = (blog) => {
    navigate("/blogdetails", { state: { blog } });
  };

  const handleLike = async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to like a blog.");
        return;
      }

      const response = await axios.post(
        `http://localhost:4000/api/blogs/like/${blogId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Like API Response:", response.data);

      setLikes((prevLikes) => ({
        ...prevLikes,
        [blogId]: response.data.status || "",
      }));
    } catch (error) {
      console.error("Error liking blog:", error.response?.data || error.message);
    }
  };

  return (
    <Container className="blog-container">
      <h2 className="text-center blog-title">Latest Blogs</h2>

      <div className="blog-filter-container mt-5">
        <Form.Group className="blog-filter-group">
          <Form.Label className="blog-filter-label"><b>Filter by Category:</b></Form.Label>
          <Form.Select className="blog-filter-select" value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button className="blog-create-btn" onClick={() => navigate("/createblog")}>Create Blog</Button>
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-center no-blogs-text">No blogs found.</p>
      ) : (
        <Row>
          {filteredBlogs.map((blog) => (
            <Col key={blog._id} md={4} className="mb-4">
              <Card className="blog-card">
                {blog.image && <Card.Img variant="top" src={blog.image} alt={blog.title} className="blog-card-img" />}
                
                <Card.Body>
                  <Card.Title className="blog-card-title">{blog.title}</Card.Title>
                  <Card.Text className="blog-card-text">
                    {blog.content.substring(0, 100)}...
                  </Card.Text>
                  <Button className="blog-readmore-btn" onClick={() => handleReadMore(blog)}>Read More</Button>
                </Card.Body>

                <Card.Footer>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <small className="text-muted">By {blog.author?.name || "Unknown"}</small>

                    <button
                      onClick={() => handleLike(blog._id)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "20px",
                      }}
                    >
                      {likes[blog._id] === "liked" ? <FcLike size={"20"} /> : <GoHeart size={"20"} />}
                    </button>
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
