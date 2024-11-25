import React from "react";
import { Col, Nav, Row } from "react-bootstrap";
import {
  FaHome,
  FaUser,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaUserCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "~/assets/css/Navbar.css";

const Sidebar = ({ isExpanded, handleMouseEnter, handleMouseLeave, role }) => {
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`sidebar ${isExpanded ? "expanded" : ""}`}
    >
      <Row>
        <Col sm={6}>
          <div className="logo">DEV</div>
        </Col>
        <Col sm={6}>
          <div className="logo-text">IMS</div>
        </Col>
      </Row>
      <Nav className="flex-column">
        <Link to="/" className="nav-link">
          <FaHome size={24} className="nav-icon" />
          <span className="nav-label">Home</span>
        </Link>
        <Link to="/candidate" className="nav-link">
          <FaUser size={24} className="nav-icon" />
          <span className="nav-label">Candidate</span>
        </Link>
        <Link to="/job" className="nav-link">
          <FaBriefcase size={24} className="nav-icon" />
          <span className="nav-label">Job</span>
        </Link>
        <Link to="/interview" className="nav-link">
          <FaFileAlt size={24} className="nav-icon" />
          <span className="nav-label">Interview</span>
        </Link>
        {role !== "ROLE_INTERVIEWER" && (
          <>
            <Link to="/offer" className="nav-link">
              <FaCheckCircle size={24} className="nav-icon" />
              <span className="nav-label">Offer</span>
            </Link>
            <Link to="/user" className="nav-link">
              <FaUserCircle size={24} className="nav-icon" />
              <span className="nav-label">User</span>
            </Link>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
