
import React, { useContext } from "react";
import { Button, Row } from "react-bootstrap";
import SearchCandidate from "./SearchCandidate";
import CandidateTable from "./CandidateTable";
import "../../assets/css/candidate-css/Candidate.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/auth/AuthContext";



export default function Candidate() {


  return (
    <div className="App">


      <h5 className="candidate-subtitle">Candidate List</h5>


     
      <CandidateTable />
    </div>
  );
}
