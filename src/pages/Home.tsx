import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div>
        <h1>GrantGuide AI</h1>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/chatbot">Chatbot</Link>
    </div>
  );
};

export default Home;
