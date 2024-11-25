import React from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { FaAngleRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../../assets/css/job-css/JobForm.css";
import { createJobs } from "~/services/jobApi";
import { toast } from "react-toastify";

export default function CreateForm() {
  const navigate = useNavigate();

  const optionsBenefits = [
    { value: 1, label: "Lunch" },
    { value: 2, label: "25-day Leave" },
    { value: 3, label: "Healthcare Insurance" },
    { value: 4, label: "Hybrid working" },
    { value: 5, label: "Travel" },
  ];

  const optionsLevel = [
    { value: "FRESHER", label: "Fresher" },
    { value: "JUNIOR", label: "Junior" },
    { value: "SENIOR", label: "Senior" },
    { value: "LEADER", label: "Leader" },
    { value: "TRAINER", label: "Trainer" },
    { value: "MENTOR", label: "Mentor" },
  ];

  const optionsSkill = [
    { value: 1, label: "Java" },
    { value: 2, label: "Nodejs" },
    { value: 3, label: ".Net" },
    { value: 4, label: "C++" },
    { value: 5, label: "Business Analyst" },
    { value: 6, label: "Communication" },
  ];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minStartDate = tomorrow.toISOString().split("T")[0];

  const formik = useFormik({
    initialValues: {
      jobTitle: "",
      startDate: "",
      endDate: "",
      salaryFrom: "",
      salaryTo: "",
      workingAddress: "",
      description: "",
      jobStatus: "OPEN",
      selectedBenefits: [],
      selectedLevel: null,
      selectedSkills: [],
    },
    validationSchema: Yup.object({
      jobTitle: Yup.string().required("Job Title is required"),
      startDate: Yup.date()
        .min(tomorrow, "Start date must be later than current date")
        .required("Start Date is required"),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), "End date must be later than Start date")
        .required("End Date is required"),
      salaryFrom: Yup.number()
        .min(1, "Salary must be greater than to 0")
        .required("Salary From is required"),
      salaryTo: Yup.number()
        .min(Yup.ref("salaryFrom"), "Salary To must be greater than Salary From")
        .required("Salary To is required"),
      workingAddress: Yup.string().required("Working Address is required"),
      description: Yup.string().required("Description is required"),
      selectedSkills: Yup.array()
        .min(1, "Skills are required")
        .required("Skills are required"),
      selectedBenefits: Yup.array()
        .min(1, "At least one Benefit is required")
        .required("Benefits are required"),
      selectedLevel: Yup.object().nullable().required("Level is required"),
    }),
    onSubmit: (values) => {
      const payload = {
        ...values,
        skillIds: values.selectedSkills.map((skill) => skill.value),
        benifitIds: values.selectedBenefits.map((benefit) => benefit.value),
        jobLevel: values.selectedLevel ? values.selectedLevel.value : "",
      };

      createJobs(payload)
        .then((response) => {
          toast.success("Job created successfully!");
          navigate("/job");
        })
        .catch((error) => {
          console.error("There was an error creating the job!", error);
          toast.error("Error creating job. Please try again.");
        });
    },
  });

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/job")}>
          Job List
        </span>
        <FaAngleRight />
        <span className="">Create Job</span>
      </div>
      <div className="content-job-form">
        <Row>
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Job Title <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="text"
                      name="jobTitle"
                      value={formik.values.jobTitle}
                      onChange={formik.handleChange}
                      placeholder="Enter Job Title"
                      isInvalid={!!formik.errors.jobTitle}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.jobTitle}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Skills <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Select
                      isMulti
                      name="selectedSkills"
                      value={formik.values.selectedSkills}
                      onChange={(selectedOptions) => formik.setFieldValue("selectedSkills", selectedOptions)}
                      options={optionsSkill}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                    {formik.errors.selectedSkills && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.selectedSkills}
                      </div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Start Date <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="date"
                      name="startDate"
                      value={formik.values.startDate}
                      onChange={formik.handleChange}
                      placeholder="Enter Start Date"
                      min={minStartDate}
                      isInvalid={!!formik.errors.startDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.startDate}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    End Date <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="date"
                      name="endDate"
                      value={formik.values.endDate}
                      onChange={formik.handleChange}
                      placeholder="Enter End Date"
                      min={formik.values.startDate ? new Date(new Date(formik.values.startDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0] : minStartDate}
                      isInvalid={!!formik.errors.endDate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.endDate}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Salary Range <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Row>
                      <Col sm={2}>From</Col>
                      <Col sm={4}>
                        <Form.Control
                          type="text"
                          min={0}
                          name="salaryFrom"
                          value={formik.values.salaryFrom}
                          onChange={formik.handleChange}
                          isInvalid={!!formik.errors.salaryFrom}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.salaryFrom}
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={2}>To</Col>
                      <Col sm={4}>
                        <Form.Control
                          type="text"
                          min={0}
                          name="salaryTo"
                          value={formik.values.salaryTo}
                          onChange={formik.handleChange}
                          isInvalid={!!formik.errors.salaryTo}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.salaryTo}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Benefits <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Select
                      isMulti
                      name="selectedBenefits"
                      value={formik.values.selectedBenefits}
                      onChange={(selectedOptions) => formik.setFieldValue("selectedBenefits", selectedOptions)}
                      options={optionsBenefits}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                    {formik.errors.selectedBenefits && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.selectedBenefits}
                      </div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row style={{ marginTop: "10px" }}>
              <Col xs={6}>
                <Form.Group as={Row}>
                  <Form.Label style={{ display: "flex" }} column sm={4}>
                    Working Address <span style={{ color: "red" }}> *</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      type="text"
                      name="workingAddress"
                      value={formik.values.workingAddress}
                      onChange={formik.handleChange}
                      placeholder="Enter Working Address"
                      isInvalid={!!formik.errors.workingAddress}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.workingAddress}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
              <Col xs={6} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Level <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Select
                      name="selectedLevel"
                      value={formik.values.selectedLevel}
                      onChange={(selectedOption) => formik.setFieldValue("selectedLevel", selectedOption)}
                      options={optionsLevel}
                      className="basic-single-select"
                      classNamePrefix="select"
                    />
                    {formik.errors.selectedLevel && (
                      <div className="invalid-feedback d-block">
                        {formik.errors.selectedLevel}
                      </div>
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={{ span: 6, offset: 6 }} className="mb-3">
                <Form.Group as={Row}>
                  <Form.Label column sm={3}>
                    Description <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Col sm={7}>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      placeholder="Enter Description"
                      style={{ minHeight: "100px" }}
                      isInvalid={!!formik.errors.description}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.description}
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <br />
            <Row>
              <div className="button-job">
                <button type="submit" className="button-submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="button-submit"
                  onClick={() => navigate("/job")}
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
