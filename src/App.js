import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BlogList from "./Blog/BlogList";
import BlogDetail from "./Blog/BlogDetail";
import Login from "./login/Login";
import CreateBlog from "./Blog/CreateBlog";
import Signup from "./login/Signup";
import UserProfile from './User/UserProfile'
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/bloglist" element={<BlogList />} />
          <Route path="/blogdetails" element={<BlogDetail />} />
          <Route path="/" element={<Login />} />
          <Route path="/createblog" element={<CreateBlog />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/user" element={<UserProfile />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
