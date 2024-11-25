import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import ApiUser from "~/services/usersApi";
import Select from "react-select"; // Import Select component from react-select
import "../../assets/css/job-css/JobForm.css";
import {optionsGender,optionsUserRole,optionsDepartment,optionsUserStatus} from "~/data/Constants"
import { toast } from "react-toastify";
const UpdateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    address: "",
    phone: "",
    gender: "",
    userRole: "",
    department: "",
    note: "",
    userStatus: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 

  useEffect(() => {
    const getUserById = async () => {
      try {
        const res = await ApiUser.getDetailUser(id);
        if (res) {
          setFormData({
            fullName: res.fullName || "",
            email: res.email || "",
            dob: res.dob ? new Date(res.dob).toISOString().split("T")[0] : "",
            address: res.address || "",
            phone: res.phone || "",
            gender: res.gender || "",
            userRole: res.userRole || "",
            department: res.department || "",
            note: res.note || "",
            userStatus: res.userStatus || "",
          });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error);
        setLoading(false);
      }
    };

    getUserById();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selected, name) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: selected.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const phoneRegex = /^\d{10}$/; 
  
    if (!formData.fullName) newErrors.fullName = "Full Name is required";
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email is not valid";
    }
  
    if (!formData.phone) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
  
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.userRole) newErrors.userRole = "User Role is required";
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.userStatus) newErrors.userStatus = "Status is required";
  
    if (!formData.dob) {
      newErrors.dob = "Date of Birth is required";
    } else {
      const today = new Date();
      const dob = new Date(formData.dob);
      if (dob >= today) {
        newErrors.dob = "Date of Birth must be in the past";
      }
    }
  
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      id,
      fullName: formData.fullName,
      email: formData.email,
      dob: formData.dob,
      address: formData.address,
      phone: formData.phone,
      gender: formData.gender,
      userRole: formData.userRole,
      department: formData.department,
      note: formData.note,
      userStatus: formData.userStatus,
    };

    console.log("Update payload:", payload);

    try {
      await ApiUser.editUser(payload);
      // console.log("User updated successfully!");
      toast.success("Update user Successfully!")
      navigate("/user");
    } catch (error) {
      console.error("Error updating user!", error);
      
      toast.error("Error updating user. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/users")}>
          User List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Edit User</span>
      </div>
      <Row className="info-update">
        
      </Row>
      <div className="content-job-form">
        <Row>
          <Form onSubmit={handleSubmit}>
            {/* Form fields */}
            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Full Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    {errors.fullName && (
                      <div className="text-danger">{errors.fullName}</div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Email <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <div className="text-danger">{errors.email}</div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    D.O.B
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                    />
                    {errors.dob && (
                      <div className="text-danger">{errors.dob}</div>
                    )}
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
                      value={formData.address}
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <div className="text-danger">{errors.address}</div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Phone number
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <div className="text-danger">{errors.phone}</div>
                    )}
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
                      name="gender"
                      options={optionsGender}
                      value={optionsGender.find(option => option.value === formData.gender)}
                      onChange={(selected) => handleSelectChange(selected, "gender")}
                    />
                    {errors.gender && (
                      <div className="text-danger">{errors.gender}</div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Role <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Select
                      name="userRole"
                      options={optionsUserRole}
                      value={optionsUserRole.find(option => option.value === formData.userRole)}
                      onChange={(selected) => handleSelectChange(selected, "userRole")}
                    />
                    {errors.userRole && (
                      <div className="text-danger">{errors.userRole}</div>
                    )}
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
                      name="department"
                      options={optionsDepartment}
                      value={optionsDepartment.find(option => option.value === formData.department)}
                      onChange={(selected) => handleSelectChange(selected, "department")}
                    />
                    {errors.department && (
                      <div className="text-danger">{errors.department}</div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Status
                  </Form.Label>
                  <Col sm={7}>
                    <Select
                      name="userStatus"
                      options={optionsUserStatus}
                      value={optionsUserStatus.find(option => option.value === formData.userStatus)}
                      onChange={(selected) => handleSelectChange(selected, "userStatus")}
                    />
                    {errors.userStatus && (
                      <div className="text-danger">{errors.userStatus}</div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Note
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                    />
                    {errors.note && (
                      <div className="text-danger">{errors.note}</div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            {/* Submit and Cancel Buttons */}
            <Row>
              <div className="button-job">
                <button type="submit" className="button-submit">
                  Save
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
};

export default UpdateUser;
