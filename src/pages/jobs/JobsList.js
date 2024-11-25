import React, { useContext, useEffect, useState } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/css/job-css/JobList.css";
import { fetchAllJobs, deleteJobs } from "~/services/jobApi";
import SearchJob from "./SearchJob";
import Pagination from "~/components/common/Pagination";
import { AuthContext } from "~/contexts/auth/AuthContext";
import { toast } from "react-toastify";
import { JobStatus, JobLevel } from "~/data/Constants";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalJob, setModalJob] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await fetchAllJobs();
        if (res.data) {
          const sortedJobs = res.data.sort((a, b) => b.id - a.id); // Sắp xếp công việc theo id giảm dần
          setJobs(sortedJobs);
          setFilteredJobs(sortedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  const handleDeleteClick = (job) => {
    setModalJob(job);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteJobs(modalJob.id);
      const updatedJobs = jobs.filter((item) => item.id !== modalJob.id);
      setJobs(updatedJobs);
      setFilteredJobs(updatedJobs);
      toast.success("Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Error deleting job. Please try again.");
    } finally {
      setShowModal(false);
    }
  };

  const formatDate = (dateArray) => {
    if (Array.isArray(dateArray) && dateArray.length === 3) {
      const [year, month, day] = dateArray;
      const formattedDay = day.toString().padStart(2, "0");
      const formattedMonth = month.toString().padStart(2, "0");
      return `${formattedDay}/${formattedMonth}/${year}`;
    }
    return "";
  };

  const handleModalClose = () => setShowModal(false);

  const handleSearch = (query, status) => {
    const filtered = jobs.filter((job) => {
      const matchesTitle = job.jobTitle
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesSkill = job.requiredSkillSet.some((skill) =>
        skill.name.toLowerCase().includes(query.toLowerCase())
      );
      const matchesLevel = job.jobLevel
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = status === "" || job.jobStatus === status;
      return (matchesTitle || matchesSkill || matchesLevel) && matchesStatus;
    });
    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= Math.ceil(filteredJobs.length / itemsPerPage)) {
      setCurrentPage(page);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <SearchJob onSearch={handleSearch} />
      {loading ? (
        <div>Loading....</div>
      ) : (
        <>
          <Table striped bordered hover responsive style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Required Skills</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayJobs.length > 0 ? (
                displayJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.jobTitle}</td>
                    <td>
                      {job.requiredSkillSet.map((skill, index) => (
                        <span key={index}>
                          {skill.name}
                          {index < job.requiredSkillSet.length - 1 && ", "}
                        </span>
                      ))}
                    </td>
                    <td>{formatDate(job.startDate)}</td>
                    <td>{formatDate(job.endDate)}</td>
                    <td>{JobStatus[job.jobStatus]}</td>
                    <td>{JobLevel[job.jobLevel]}</td>
                    <td>
                      <FaEye
                        className="action--icon"
                        onClick={() => navigate(`/job/${job.id}`)}
                        style={{ cursor: "pointer", marginRight: "10px" }}
                      />
                      {(user.role === "ROLE_ADMIN" ||
                        user.role === "ROLE_MANAGER" ||
                        user.role === "ROLE_RECRUITER") && (
                        <>
                          <FaEdit
                            className="action--icon"
                            onClick={() => navigate(`edit/${job.id}`)}
                            style={{ cursor: "pointer", marginRight: "10px" }}
                          />
                          <FaTrash
                            className="action--icon"
                            onClick={() => handleDeleteClick(job)}
                            style={{ cursor: "pointer", marginRight: "10px" }}
                          />
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">
                    No item matches with your search data. Please try again.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalItems={Math.ceil(filteredJobs.length / itemsPerPage)}
            onPageChange={handlePageChange}
          />

          <Modal show={showModal} onHide={handleModalClose}>
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <h4 style={{ textAlign: "center" }}>
                Are you sure you want to delete this job?
              </h4>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
}
