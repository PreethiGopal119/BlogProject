import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

function BlogDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const blog = location.state?.blog; 

  if (!blog) {
    return <h2 className="text-center mt-5">No blog data available</h2>;
  }

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card style={{ width: "50rem", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}>
    
        {blog.image && <Card.Img variant="top" src={blog.image} alt={blog.title} />}

        <Card.Body>
          <Card.Title className="text-primary">{blog.title}</Card.Title>
          <Card.Text>{blog.content}</Card.Text>
          <p className="text-muted">
            <strong>Category:</strong> {blog.category}
          </p>
          <p className="text-muted">
            <strong>Author:</strong> {blog.author.name}
          </p>
          <Button variant="dark" onClick={() => navigate(-1)}>
             Go Back
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BlogDetail;
