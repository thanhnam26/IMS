import React, { useContext, useEffect, useState } from "react";
import SearchJob from "./SearchJob";
import { Alert, Button, Col, Row } from "react-bootstrap";
import JobsList from "../jobs/JobsList";
import "../../assets/css/job-css/Job.css";
import * as XLSX from "xlsx";
import { Link } from "react-router-dom";
import { importJob } from "~/services/jobApi";
import { AuthContext } from "~/contexts/auth/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

// Cập nhật skillsMap với định dạng { value, label }
const skillsMap = {
  "Java": { value: 1, label: "Java" },
  "Nodejs": { value: 2, label: "Nodejs" },
  ".Net": { value: 3, label: ".Net" },
  "C++": { value: 4, label: "C++" },
  "Business Analyst": { value: 5, label: "Business Analyst" },
  "Communication": { value: 6, label: "Communication" },
};

// Cập nhật BenefitsMap với định dạng { value, label }
const benefitsMap = {
  "Lunch": { value: 1, label: "Lunch" },
  "25-day Leave": { value: 2, label: "25-day Leave" },
  "Healthcare Insurance": { value: 3, label: "Healthcare Insurance" },
  "Hybrid working": { value: 4, label: "Hybrid working" },
  "Travel": { value: 5, label: "Travel" },
};

// Chuyển đổi từ tên kỹ năng sang đối tượng kỹ năng với id
const convertSkillsToRequiredSkillSet = (skillsString) => {
  if (!skillsString) return [];
  const skills = skillsString.split(',').map(skill => skill.trim());
  return skills
    .map(skill => skillsMap[skill]) // Lấy đối tượng kỹ năng từ skillsMap
    .filter(skill => skill !== undefined) // Loại bỏ kỹ năng không có trong skillsMap
    .map(skill => ({ id: skill.value, name: skill.label })); // Chuyển đổi thành định dạng { id, name }
};

// Chuyển đổi từ tên lợi ích sang đối tượng lợi ích với id
const convertBenefitsToBenefitIds = (benefitsString) => {
  if (!benefitsString) return [];
  const benefits = benefitsString.split(',').map(benefit => benefit.trim());
  return benefits
    .map(benefit => benefitsMap[benefit]) // Lấy đối tượng lợi ích từ benefitsMap
    .filter(benefit => benefit !== undefined) // Loại bỏ lợi ích không có trong benefitsMap
    .map(benefit => ({ id: benefit.value, name: benefit.label })); // Chuyển đổi thành định dạng { id, name }
};

// Fetch all jobs from the API
const fetchAllJobs = () => {
  return axios.get("/api/jobs", { params: { index: 0, size: 100 } });
};

export default function Job() {
  const [data, setData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [jobs, setJobs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAllJobs().then(response => setJobs(response.data)).catch(error => console.error(error));
  }, []);

  const convertDateToArray = (dateString) => {
    if (typeof dateString !== 'string') {
      throw new TypeError('dateString should be a string');
    }
    const [day, month, year] = dateString.split('/').map(Number);
    return [year, month - 1, day]; // month - 1 because JavaScript Date months are 0-based
  };

  const handleImportFile = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const maxExistingId = jobs.length > 0 ? Math.max(...jobs.map(job => job.id)) : 0;

      // Process each row and send it to the API
      data.forEach((row, index) => {
        let startDateArray = [null, null, null];
        let endDateArray = [null, null, null];

        // Convert startDate và endDate từ file
        if (row.startDate) {
          startDateArray = convertDateToArray(String(row.startDate));
        }
        if (row.endDate) {
          endDateArray = convertDateToArray(String(row.endDate));
        }

        // Convert skills to requiredSkillSet
        const requiredSkillSet = row.skills ? convertSkillsToRequiredSkillSet(row.skills) : [];

        // Convert benefits to benefitIds
        const benefitIds = row.benefits ? convertBenefitsToBenefitIds(row.benefits) : [];
        
        const jobData = {
          id: maxExistingId + index + 1,
          ...row,
          startDate: startDateArray,
          endDate: endDateArray,
          skillIds: requiredSkillSet.map(skill => skill.id),
          benifitIds: benefitIds.map(benefit => benefit.id),
          jobStatus: "OPEN"
        };

        console.log(`Row ${index + 1}:`, jobData);

        // Send job data to API
        importJob(jobData)
          .then((response) => {
            console.log(`Job with ID ${jobData.id} added successfully`);
            toast.success(`Job added successfully`);  
            fetchAllJobs()
              .then((response) => setJobs(response.data))
              .catch((error) => console.error(error));
          })
          .catch((error) => {
            console.error(`Error adding job with ID ${jobData.id}`, error);
            toast.error(`Error adding job. Please try again.`);
          });
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleAlertClose = () => setShowAlert(false);

  return (
    <div className="App">
      <h5 className="job-subtitle">Jobs List</h5>
      <Row></Row>
      {(user.role === 'ROLE_ADMIN' ||user.role ==='ROLE_MANAGER' ||user.role === 'ROLE_RECRUITER') && (
      <Row style={{ float: 'right' }}>
        <div className="button-group">
          <Link className="button-form" style={{ marginRight: "10px" }} to="/job/add">
            Add New
          </Link>

          <label htmlFor="file-upload" className="button-form">
            Import
          </label>
          <input
            style={{ display: "none" }}
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            className="file-input"
            onChange={handleImportFile}
          />
        </div>
      </Row>
      )}
      <JobsList jobs={jobs} />
      {/* <Pagination /> */}

      {/* <div className="alert-job">
        <Alert
          show={showAlert}
          variant={alertMessage.includes("Error") ? "danger" : "success"}
          onClose={handleAlertClose}
          dismissible
        >
          <Alert.Heading>{alertMessage.includes("Error") ? "Error" : "Success"}</Alert.Heading>
          <p>{alertMessage}</p>
        </Alert>
      </div> */}
    </div>
  );
}
