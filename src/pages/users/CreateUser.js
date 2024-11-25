import React, { useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../../assets/css/job-css/JobForm.css";
import Header from "../../components/common/Header";

export default function CreateUser() {
  const navigate = useNavigate();

  const optionsGender = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const optionsRole = [
    { value: "Admin", label: "Admin" },
    { value: "Recruiter", label: "Recruiter" },
    { value: "Interviewer", label: "Interviewer" },
    { value: "Manager", label: "Manager" },
  ];

  const optionsStatus = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  const optionsDepartment = [
    { value: "HR", label: "HR" },
    { value: "Finance", label: "Finance" },
    { value: "Communication", label: "Communication" },
    { value: "Marketing", label: "Marketing" },
    { value: "Accounting", label: "Accounting" },
  ];

  const optionsSkills = [
    { value: "java", label: "Java" },
    { value: "nodejs", label: "Nodejs" },
    { value: "dotnet", label: ".NET" },
    { value: "cpp", label: "C++" },
    { value: "business_analysis", label: "Business Analysis" },
    { value: "communication", label: "Communication" },
  ];

  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedRole, setSelectedRole] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to handle form submission
    // You can access form data using state variables like selectedGender, selectedRole, etc.
    // Example:
    // console.log(selectedGender, selectedRole, selectedStatus, selectedDepartment, selectedSkills);
  };

  return (
    <Container className="mb-3">

      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/user")}>
          User List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Create user</span>
      </div>
      <div className="content-job-form">
        <Row>
          <Form onSubmit={handleSubmit}>
            {/* First Row */}
            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Full name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control type="text" placeholder="Type a name" />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Email <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control type="text" placeholder="Type an email" />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            {/* Second Row */}
            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    D.O.B
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control type="date" name="dob" />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Address
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="text"
                      name="address"
                      placeholder="Type an address"
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            {/* Third Row */}
            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Phone Number
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="text"
                      name="phone"
                      placeholder="Type a phone"
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Gender <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Select
                      isMulti
                      value={selectedGender}
                      onChange={setSelectedGender}
                      options={optionsGender}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select gender(s)"
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            {/* Fourth Row */}
            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Role
                  </Form.Label>
                  <Col sm={7}>
                    <Select
                      isMulti
                      value={selectedRole}
                      onChange={setSelectedRole}
                      options={optionsRole}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select role(s)"
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Department <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Select
                      isMulti
                      value={selectedDepartment}
                      onChange={setSelectedDepartment}
                      options={optionsDepartment}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select department(s)"
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            {/* Fifth Row */}
            <Row>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Status
                  </Form.Label>
                  <Col sm={7}>
                    <Select
                      isMulti
                      value={selectedStatus}
                      onChange={setSelectedStatus}
                      options={optionsStatus}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select status"
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Note
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control type="text" name="note" placeholder="" />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            {/* Submit and Cancel Buttons */}
            <Row>
              <div className="button-job">
                <button type="submit" className="button-submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="button-submit"
                  onClick={() => navigate("/user")}
                >
                  Cancel
                </button>
              </div>
            </Row>
          </Form>
        </Row>
      </div>
    </Container>
  );
}
