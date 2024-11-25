import React, { useState, useEffect } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import {
  fetchCandidateById,
  updateCandidate
} from '~/services/candidateApi';
import { fetchAllUser } from "~/services/userServices";
import '../../assets/css/candidate-css/CandidateCreateForm.css';
import {
  optionsSkills,
  optionsPosition,
  optionsGender,
  optionsLevel,
  optionsStatus,
} from '~/data/Constants';
import { isValidDOB, isValidEmail, isValidPhone } from '~/utils/Validate';
import { toast } from "react-toastify";


export default function EditCandidate() {
  const navigate = useNavigate();
  const { id } = useParams()
  const [recruiters, setRecruiters] = useState([]);
  const skillMapping = {
    "business analysis": "Business Analyst",
  };

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    dob: "",
    address: "",
    phone: "",
    gender: null,
    candidatePosition: null,
    yearExperience: "",
    highestLevel: null,
    skillIds: [],
    note: "",
    recruiterId: null,
    candidateStatus: { value: "OPEN", label: "Open" },
    attachFile: "",
  });



  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetchAllUser(0, 1000);
        const users = userResponse.data;
        const recruiterOptions = users.filter(user => user.userRole === 'ROLE_RECRUITER').map(user => ({
          value: user.id,
          label: user.fullName
        }));
        setRecruiters(recruiterOptions);
  
        const candidateResponse = await fetchCandidateById(id);
        const data = candidateResponse;
        // console.log("data", data);
        const formattedDob = data.dob ? data.dob.map(part => String(part).padStart(2, '0')).join('-') : '';
  
        setFormData({
          ...data,
          fullName: data.fullName || '',
          email: data.email || '',
          dob: formattedDob,
          address: data.address || '',
          phone: data.phone || '',
          gender: optionsGender.find(option => option.value === data.gender.toUpperCase()) || null,
          candidatePosition: optionsPosition.find(option => option.value === data.candidatePosition) || null,
          highestLevel: optionsLevel.find(option => option.value === data.highestLevel) || null,
          skillIds: data.skills ? data.skills.map(skill => {
            const normalizedSkill = skill.trim().toLowerCase();
            const mappedSkill = skillMapping[normalizedSkill] || skill;
            return optionsSkills.find(option => option.label.trim().toLowerCase() === mappedSkill.trim().toLowerCase());
          }).filter(Boolean) : [],
          recruiterId: recruiterOptions.find(option => option.label === data.recruiter) || null,
          candidateStatus: optionsStatus.find(option => option.value === data.candidateStatus),
          attachFile: data.attachFile || '' // Chỉ lưu tên file
        });
      } catch (error) {
        console.error('There was an error fetching the data!', error);
        alert('Error fetching data. Please try again.');
      }
    };
  
    fetchData();
  }, [id]);
  

  const handleChange = (field) => (value) => {
    setFormData({ ...formData, [field]: value });
    console.log(formData.attachFile);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, attachFile: file.name });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email address. Please input localpart@domainpart!");
      return;
    }

    if (!isValidPhone(formData.phone)) {

      toast.error("Phone number must be exactly 10 numbers. Please try again!");
      return;
    }

    if (formData.dob && !isValidDOB(formData.dob)) {
      toast.error("Date of Birth must be in the past please!");
      return;
    }
    const payload = {
      id: id,
      fullName: formData.fullName,
      dob: formData.dob,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      gender: formData.gender?.value || null,
      skillIds: formData.skillIds.map(skill => skill.value),
      recruiterId: formData.recruiterId?.value || null,
      attachFile: formData.attachFile || null,
      candidateStatus: formData.candidateStatus?.value || null,
      candidatePosition: formData.candidatePosition?.value || null,
      yearExperience: Number(formData.yearExperience) || 0,
      highestLevel: formData.highestLevel?.value || null,
      note: formData.note || '',
    };

    console.log('Updating candidate with payload:', payload);

    updateCandidate(payload)
      .then(response => {
        console.log('Candidate updated successfully!', response);
        toast.success('Candidate updated successfully!');
        navigate('/candidate');
      })
      .catch(error => {
        console.error('Error updating candidate!', error);
        console.error('Error response:', error.response);
        toast.error('Error updating candidate. Please try again.');
      });
  };
  return (
    <Container  >
      <div className="breadcrumb__group" style={{marginTop: "40px"}}>
        <span className="breadcrumb-link" onClick={() => navigate("/candidate")}>
          Candidate List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Edit Candidate</span>
      </div>
      <div className="content-candidate-form" style={{marginTop: "16px"}}>
        <Row>
          <Form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <h5>I. Personal Information</h5>
            <Row className="mb-3">
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="fullname">
                    Full Name <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      placeholder="Type a name..."
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName')(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="email">
                    Email <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="email"
                      placeholder="Type an email..."
                      value={formData.email}
                      onChange={(e) => handleChange('email')(e.target.value)}
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="dob">
                    D.O.B
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      aria-label="D.O.B"
                      inputId="dob"
                      type="date"
                      value={formData.dob}
                      onChange={(e) => handleChange('dob')(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="address">
                    Address
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      placeholder="Type an address..."
                      value={formData.address}
                      onChange={(e) => handleChange('address')(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="phone">
                    Phone Number
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="tel"
                      placeholder="Type a number..."
                      value={formData.phone}
                      onChange={(e) => handleChange('phone')(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="gender">
                    Gender <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                     aria-label="Gender"
                      inputId="gender"
                      value={formData.gender}
                      onChange={handleChange('gender')}
                      options={optionsGender}
                      className="basic-single-select"
                      classNamePrefix="select"
                      isClearable
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            {/* Professional Information */}
            <h5>II. Professional Information</h5>
            <Row className="mb-3">
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="attachFile">
                    CV Attachment
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                    />
                    {formData.attachFile && (
                      <small>Current file: {formData.attachFile}</small>
                    )}
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="yearExperience">
                    Year of Experience
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="number"
                      placeholder="Type a number"
                      value={formData.yearExperience}
                      onChange={(e) => handleChange('yearExperience')(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="position">
                    Current Position <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      aria-label="Current Position"
                      inputId="position"
                      value={formData.candidatePosition}
                      onChange={handleChange('candidatePosition')}
                      options={optionsPosition}
                      className="basic-single-select"
                      classNamePrefix="select"
                      isClearable
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="level">
                    Highest Level <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      aria-label="Highest Level"
                      inputId="level"
                      value={formData.highestLevel}
                      onChange={handleChange('highestLevel')}
                      options={optionsLevel}
                      className="basic-single-select"
                      classNamePrefix="select"
                      isClearable
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="skill">
                    Skills <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      aria-label="Skills"
                      inputId="skill"
                      isMulti
                      value={formData.skillIds}
                      onChange={handleChange('skillIds')}
                      options={optionsSkills}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      required
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="note">
                    Note
                  </Form.Label>
                  <Col sm={9}>
                    <Form.Control
                      type="text"
                      placeholder="Type a note"
                      value={formData.note}
                      onChange={(e) => handleChange('note')(e.target.value)}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="recruiter">
                    Recruiter <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      aria-label="Recruiter"
                      inputId="recruiter"
                      value={formData.recruiterId}
                      onChange={handleChange('recruiterId')}
                      options={recruiters}
                     
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3} data-testId="status">
                    Status <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={9}>
                    <Select
                      value={formData.candidateStatus}
                      onChange={handleChange('candidateStatus')}
                      options={optionsStatus}
                      className="basic-single-select"
                      classNamePrefix="select"
                      isClearable
                      isDisabled
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            {/* Submit and Cancel Buttons */}
            <Row className="mb-3">
              <Col xs={12}>
                <div className="button-candidate">
                  <button data-testId="editbutton" type="submit" className="button-form button-form--warning">
                    Update
                  </button>
                  <button
                    data-testId="cancel"
                    type="button"
                    className="button-form"
                    onClick={() => navigate("/candidate")}
                  >
                    Cancel
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </Row>
      </div>
    </Container>
  );
}