import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../assets/css/job-css/JobForm.css";
import ApiUser from "~/services/usersApi";
import { statusUser, roleUser, CandidateGender, departmentOffer } from "~/data/Constants";

export default function DetailUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userDetail, setUserDetail] = useState({});
  
  const formdata = {
    id: id,
    fullName: userDetail.fullName,
    phone: userDetail.phone,
    userStatus: "",
    dob: userDetail.dob? new Date(userDetail.dob).toISOString().split("T")[0]
    : "",
    email: userDetail.email,
    address: userDetail.address,
    gender: userDetail.gender,
    department: userDetail.department,
    userRole: userDetail.userRole,
    note: userDetail.note
  };
  console.log("user", formdata);

  const loadDetailUser = async (id) => {
    try {
      const response = await ApiUser.getDetailUser(id);
      setUserDetail(response);
    } catch (error) {
      console.error("Error loading user details:", error);
    }
  };

  useEffect(() => {
    loadDetailUser(id);
  }, [id]);

  const handleChangeStatus = async () => {
    try {
      
      const submitUpdate = {
        ...formdata,
        userStatus: userDetail.userStatus === "ACTIVE" ? "DEACTIVATED": "ACTIVE",
      };
     console.log("date submit", JSON.stringify(submitUpdate,null,2));
      const responseUpdate = await ApiUser.editUser(submitUpdate);
      
    
      console.log("update duoc", responseUpdate.data);
      alert("oke");
      await loadDetailUser();
      navigate("/user")
    } catch (error) {
      console.error("ngooo", error);
      alert("loi me no roi")
    }
  };

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/user")}>
          User List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">User details</span>
      </div>
      <Row className="info-update">
        <Col xs={{ span: 6, offset: 8 }}>
          <p>Create on 26/06/2024, Last update by MaiNT47, Today</p>
        </Col>
      </Row>
      <div className="content-job-form">
        <Row style={{ justifyContent: "flex-end" }}>
          <Col xs={2}>
            {userDetail.userStatus === 'DEACTIVATED' ? (
              <button className="button-form button-form--success" onClick={handleChangeStatus} >
                Active User
              </button>
            ) : (
              <button className="button-form button-form--danger" onClick={handleChangeStatus} >
                De-Active User
              </button>
            )}
          </Col>
        </Row>
        <Row>
          {/* Display User Details */}
          <Col xs={6}>
            <p>
              <strong>Full Name:</strong> {userDetail.fullName}
            </p>
            <p>
              <strong>Email:</strong> {userDetail.email}
            </p>
            <p>
              <strong>D.O.B:</strong> {userDetail.dob}
            </p>
            <p>
              <strong>Address:</strong> {userDetail.address}
            </p>
            <p>
              <strong>Phone Number:</strong> {userDetail.phone}
            </p>
          </Col>
          <Col xs={6}>
            <p>
              <strong>Gender:</strong> {CandidateGender[userDetail.gender]}
            </p>
            <p>
              <strong>Role:</strong> {roleUser[userDetail.userRole]}
            </p>
            <p>
              <strong>Department:</strong> {departmentOffer[userDetail.department]}
            </p>
            <p>
              <strong>Status:</strong> {statusUser[userDetail.userStatus]}
            </p>
            <p>
              <strong>Note:</strong> {userDetail.note}
            </p>
          </Col>
        </Row>
        {/* Buttons */}
        <Row>
          <div className="button-job">
            <button type="button" className="button-submit">
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
      </div>
    </Container>
  );
}
