import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "../../assets/css/interview-css/Interview.css";
import { FaAngleRight } from "react-icons/fa6";
import {
  fetchInterviewDetail,
  putInterview,
} from "~/services/interviewServices";
import {
  convertToDateTimeSQL6,
  convertToDay,
  convertToHour,
  formatDayFromApi,
  getLabelFromValue,
  getSkillIds,
  handleClickURL,
} from "~/utils/Validate";
import {
  InterviewResult,
  InterviewStatus,
  optionsPosition,
  optionsSkills,
  userRole,
} from "~/data/Constants";
import { Col, Form, Row } from "react-bootstrap";
import "../../assets/css/candidate-css/CandidateDetail.css";
import { AuthContext } from "~/contexts/auth/AuthContext";
import { fetchCandidateById, updateCandidate } from "~/services/candidateApi";
import { toast } from "react-toastify";

const SubmitInterview = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { user } = useContext(AuthContext);
  const role = userRole.find((r) => r.value === user?.role)?.value;

  const { id } = useParams();
  const navigate = useNavigate();
  const [interviewSchedule, setInterviewSchedule] = useState(null);
  const [note, setNote] = useState("");
  const [result, setResult] = useState("");
  const [formdataCandidate, setFormdataCandidate] = useState([]);

  useEffect(() => {
    getInterviewSchedule(id);
  }, [id]);

  useEffect(() => {
    if (interviewSchedule?.candidate?.id) {
      getCandidate(interviewSchedule?.candidate?.id);
    }
  }, [interviewSchedule]);

  const getInterviewSchedule = async (id) => {
    let res = await fetchInterviewDetail(id);

    if (res) {
      setInterviewSchedule({
        ...res,
        scheduleTimeFrom: convertToHour(res.scheduleTimeFrom),
        scheduleTimeTo: convertToHour(res.scheduleTimeTo),
        scheduleDate: formatDayFromApi(res.scheduleTimeFrom),
      });
      setNote(res.note);
      setResult(res.interviewResult);
    } else {
      console.error("No data returned from API");
    }
  };

  const getCandidate = async (id) => {
    let res = await fetchCandidateById(id);
    if (res) {
      setFormdataCandidate(res);
    } else {
      console.error("No data candidate returned from API");
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const {
      recruiterDTO,
      jobDTO,
      scheduleTimeFrom,
      scheduleTimeTo,
      scheduleDate,
      candidate,
      interviewerSet,
      ...updatedData
    } = interviewSchedule;

    const scheduleTimeFromFinal = convertToDateTimeSQL6(
      scheduleDate,
      scheduleTimeFrom
    );
    const scheduleTimeToFinal = convertToDateTimeSQL6(
      scheduleDate,
      scheduleTimeTo
    );

    const finalUpdatedData = {
      ...updatedData,
      recruiterId: recruiterDTO?.id,
      jobId: jobDTO?.id,
      interviewResult: result,
      scheduleTimeFrom: scheduleTimeFromFinal,
      scheduleTimeTo: scheduleTimeToFinal,
      candidateId: candidate?.id,
      interviewStatus: "INTERVIEWED",
      note: note,
      interviewerSet:
        interviewSchedule?.interviewerSet.map(
          (interviewer) => interviewer.id
        ) || [],
      position: candidate?.position,
    };

    const { recruiter, skills, ...updatedCandidate } = formdataCandidate;

    const skillIds = getSkillIds(skills, optionsSkills);

    const finalUpdatedCandidate = {
      ...updatedCandidate,
      candidateStatus:
        result === "PASS"
          ? "PASSED_INTERVIEW"
          : result === "FAIL"
          ? "FAILED_INTERVIEW"
          : updatedCandidate.candidateStatus,
      recruiterId: finalUpdatedData?.recruiterId,
      skillIds: skillIds,
    };

    const [resCan, resInterview] = await Promise.all([
      updateCandidate(finalUpdatedCandidate),
      putInterview(finalUpdatedData),
    ]);

    if (resInterview && resCan) {
      handleClose();
      toast.success(resInterview);
      navigate("/interview");
    } else {
      toast.error("Failed to create interview schedule!");
    }
  };

  return (
    <div className="candidate-detail-container">
      <div className="candidate-title">
        <div className="breadcrumb__group">
          <span
            className="breadcrumb-link "
            onClick={() => navigate("/interview")}
          >
            Interview Schedule List
          </span>
          <FaAngleRight />
          <span className="breadcrumb-link__active">
            Interview Schedule Submit
          </span>
        </div>
      </div>

      <div className="candidate-detail">
        <div className="section">
          <div className="section-personal-info">
            <Row>
              <Col>
                <p>
                  <strong>Schedule title:</strong> {interviewSchedule?.title}
                </p>
                <p>
                  <strong>Candidate name:</strong>{" "}
                  {interviewSchedule?.candidate?.fullName}
                </p>
                <p>
                  <strong>Schedule Time:</strong>{" "}
                  {interviewSchedule?.scheduleDate} From{" "}
                  {interviewSchedule?.scheduleTimeFrom} To{" "}
                  {interviewSchedule?.scheduleTimeTo}
                </p>
                <p>
                  <strong>Location:</strong> {interviewSchedule?.location}
                </p>
                <p>
                  <strong>Meeting ID:</strong>{" "}
                  <Link
                    to="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="schedule__value"
                    onClick={(event) =>
                      handleClickURL(event, interviewSchedule?.meetingId)
                    }
                    style={{ fontSize: "1.1rem" }}
                  >
                    {interviewSchedule?.meetingId || "No Meeting ID"}
                  </Link>
                </p>
                <Form.Group controlId="formNote">
                  <strong>Notes:</strong>
                  {interviewSchedule?.interviewStatus !== "CANCELLED" ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  ) : (
                    <>
                      {" "}
                      {interviewSchedule?.note ? interviewSchedule.note : "NaN"}
                    </>
                  )}
                </Form.Group>
              </Col>
              <Col>
                <p>
                  <strong>Job:</strong>{" "}
                  {interviewSchedule?.jobDTO?.name || "NaN"}
                </p>

                <p>
                  <strong>Position: </strong>
                  {getLabelFromValue(
                    optionsPosition,
                    interviewSchedule?.position
                  )}
                </p>
                <p>
                  <strong>Interviewer:</strong>{" "}
                  {interviewSchedule?.interviewerSet
                    ?.map((item) => item.name)
                    .join(", ")}
                </p>

                <p>
                  <strong>Recruiter owner: </strong>
                  {interviewSchedule?.recruiterDTO?.name}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {
                    InterviewStatus.find(
                      (is) => is.value === interviewSchedule?.interviewStatus
                    )?.label
                  }
                </p>

                <Form.Group
                  controlId="formResult"
                  className="d-flex align-items-center"
                >
                  <Form.Label className="mb-0 me-2">
                    <strong>Result:</strong>
                  </Form.Label>
                  {interviewSchedule?.interviewStatus !== "CANCELLED" ? (
                    <Form.Control
                      as="select"
                      value={result}
                      onChange={(e) => setResult(e.target.value)}
                      className="flex-grow-1"
                    >
                      <option value="">Select a result</option>
                      {InterviewResult.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </Form.Control>
                  ) : (
                    <>
                      {
                        InterviewResult.find(
                          (ir) =>
                            ir.value === interviewSchedule?.interviewResult
                        )?.label
                      }
                    </>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </div>
        </div>

        <div className="actions">
          {interviewSchedule?.interviewStatus !== "CANCELLED" && (
            <Form onSubmit={handleSubmit}>
              <button
                className="button-form button-form--warning"
                disabled={!result}
                type="submit"
              >
                Submit
              </button>
            </Form>
          )}

          <button className="button-form" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitInterview;
