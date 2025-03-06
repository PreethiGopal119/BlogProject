import React, { useEffect, useState } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import Api from "../Api";
import { useNavigate } from "react-router-dom";

function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await Api.get("/blogs/getallblogs");
        console.log("ress", res);

        const blogsData = res?.data || [];
        setBlogs(blogsData);
        setFilteredBlogs(blogsData);
        const uniqueCategories = [
          "All",
          ...new Set(blogsData.map((blog) => blog.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    };
    fetchBlogs();
  }, []);

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((blog) => blog.category === category));
    }
  };

  const handleReadMore = (blog) => {
    navigate("/blogdetails", { state: { blog } });
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Latest Blogs</h2>

      <Form.Group className="mb-3 text-center">
        <Form.Label>
          <b>Filter by Category:</b>
        </Form.Label>
        <Form.Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ maxWidth: "300px", margin: "0 auto" }}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {filteredBlogs.length === 0 ? (
        <p className="text-center">No blogs found.</p>
      ) : (
        <Row>
          {filteredBlogs.map((blog) => (
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
                  <Button onClick={() => handleReadMore(blog)}>
                    Read More
                  </Button>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">
                    By {blog.author?.name || "Unknown"}
                  </small>
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
