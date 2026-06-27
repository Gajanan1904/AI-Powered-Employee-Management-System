import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import './FaceScanner.css';
import { apiService } from '../../services/apiService';

const FaceScanner = ({ onScanComplete }) => {
  const [stage, setStage] = useState('permission'); // permission | scanning | detected | success
  const [employees, setEmployees] = useState([]);
  const [matchedEmp, setMatchedEmp] = useState(null);
  const [logStatus, setLogStatus] = useState('Marking attendance...');
  const [isVerifying, setIsVerifying] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Load employees so we can randomly match one
    apiService.getEmployees().then((res) => {
      setEmployees(res.data);
    });
  }, []);

  useEffect(() => {

  if (
    stage === "scanning" &&
    videoRef.current &&
    streamRef.current
  ) {

    videoRef.current.srcObject =
      streamRef.current;

    videoRef.current.play();

    console.log("STREAM REATTACHED");

  }

}, [stage]);

  const handleGrantPermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true
    });

    streamRef.current = stream;

    console.log("STREAM =", stream);

    setStage("scanning");

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        videoRef.current.play();

        console.log(
          "VIDEO ELEMENT =",
          videoRef.current
        );
      }
    }, 500);

  } catch (err) {
    console.error(err);
    alert("Camera Permission Denied");
  }
};

  const captureFace = async () => {

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/face-auth/verify/"
    );

    const data = await response.json();

    console.log("FACE RESULT =", data);

    alert(data.employee);

  } catch (err) {

    console.error(err);

  }

};

const restartCamera = () => {

  setMatchedEmp(null);

  setStage("scanning");

  setTimeout(() => {

    if (
      videoRef.current &&
      streamRef.current
    ) {

      videoRef.current.srcObject =
        streamRef.current;

      videoRef.current.play();

      console.log("CAMERA RESTARTED");

    }

  }, 300);

};


  const handleConfirmMatch = async () => {
    if (!matchedEmp) return;
    setLogStatus('Syncing with HR core database...');
    
    try {
      // Simulate API call to mark attendance
      await apiService.toggleAttendance(matchedEmp.id, 'Present');
      setStage('success');
    } catch (err) {
      console.error(err);
    }
  };

 const captureAndVerify = async () => {

  try {

    setIsVerifying(true);

    console.log("BUTTON CLICKED");

    const canvas = canvasRef.current;
    const video = videoRef.current;

    console.log("CANVAS =", canvas);
    console.log("VIDEO =", video);

    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    console.log("SIZE =", canvas.width, canvas.height);

    if (!video.videoWidth) {

      setIsVerifying(false);

      alert("Camera still loading. Please wait 2 seconds.");

      return;
    }

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    console.log("IMAGE DRAWN");

    const image = canvas.toDataURL("image/jpeg");

    const response = await fetch(
      "http://127.0.0.1:8000/face-auth/verify/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: image
        })
      }
    );

    const result = await response.json();

    console.log(result);

    if (result.matched) {

      console.log("EMPLOYEES =", employees);
      console.log("FIRST EMPLOYEE =", employees[0]);
      console.log("MATCHED NAME =", result.employee);

      const employee = employees.find(
        emp =>
          emp.name &&
          emp.name.toLowerCase().trim() ===
          result.employee.toLowerCase().trim()
      );

      if (employee) {

        setMatchedEmp(employee);
        setIsVerifying(false);
        setStage("detected");

      } else {

        setIsVerifying(false);
        alert("Employee not found in HR database");

      }

    } else {

      setIsVerifying(false);
      alert("Face Not Matched");

    }

  } catch (err) {

    console.error("VERIFY ERROR =", err);

    setIsVerifying(false);

    alert("Verification Failed");

  }

};

  return (
    <div className="face-scanner-wrapper glass-card glow-primary">
      {stage === 'permission' && (
        <div className="permission-state">
          <div className="permission-icon-box">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
          <h2 className="scanner-heading">Webcam Authorization</h2>
          <p className="scanner-description">
            To proceed with biometrical face attendance logging, please allow webcam authorization on your browser.
          </p>
          <Button onClick={handleGrantPermission} variant="primary" fullWidth>
            Authorize Camera
          </Button>
        </div>
      )}

      {stage === 'scanning' && (
        <div className="scanning-state">
          <div className="video-viewport">

            <video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  width="400"
  height="300"
/>
<canvas
  ref={canvasRef}
  style={{ display: "none" }}
/>

            <div className="cyber-corner top-left"></div>
            <div className="cyber-corner top-right"></div>
            <div className="cyber-corner bottom-left"></div>
            <div className="cyber-corner bottom-right"></div>
            
            {/* Animated Laser sweep */}
            <div className="scanning-laser"></div>
            
            {/* Cyber Face Outline overlay
            <svg className="face-outline" viewBox="0 0 100 100">
              <path d="M50 15 C30 15, 25 35, 25 50 C25 70, 35 85, 50 85 C65 85, 75 70, 75 50 C75 35, 70 15, 50 15 Z" fill="none" stroke="var(--color-secondary)" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="38" cy="45" r="3" fill="none" stroke="var(--color-secondary)" strokeWidth="0.8" />
              <circle cx="62" cy="45" r="3" fill="none" stroke="var(--color-secondary)" strokeWidth="0.8" />
              <path d="M44 55 Q50 62, 56 55" fill="none" stroke="var(--color-secondary)" strokeWidth="1" />
            </svg> */}
            
            <div className="scanning-overlay-text">
              ANALYZING NODAL FACIAL METRICS...
            </div>
          </div>
          
          <div className="scanner-status">
            <div className="pulse-indicator"></div>
            <span>AI BIOMETRIC CHECK RUNNING</span>
            <Button onClick={captureAndVerify}
              variant="primary"
              fullWidth
              disabled={isVerifying}>
                  {isVerifying ? "Verifying Face..." : "Verify My Face"}
            </Button>
          </div>
        </div>
      )}

      {stage === 'detected' && matchedEmp && (
        <div className="detected-state animate-fade-in">
          <h2 className="scanner-heading success-text">Face Match Detected</h2>
          <div className="match-card">
            <div className="match-avatar-wrapper">
              <img src={matchedEmp.avatar} alt={matchedEmp.name} className="match-avatar" />
              <div className="match-overlay-check">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 5 13"></polyline>
                </svg>
              </div>
            </div>
            <div className="match-details">
              <h3>{matchedEmp.name}</h3>
              <p className="match-meta">{matchedEmp.designation}</p>
              <div className="match-tag">{matchedEmp.department}</div>
            </div>
          </div>
          
          <div className="verification-badge">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="var(--color-success)" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 5 13"></polyline>
            </svg>
            <span>Face Verified Successfully</span>
          </div>

          <div className="match-actions">
            <Button onClick={handleConfirmMatch} variant="primary" fullWidth>
              Confirm & Log Present
            </Button>
            <Button
  onClick={restartCamera}
  variant="outline"
  fullWidth
>
  Re-Scan Face
</Button>
          </div>
        </div>
      )}

      {stage === 'success' && matchedEmp && (
        <div className="success-state animate-fade-in">
          <div className="success-checkmark-circle">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 5 13"></polyline>
            </svg>
          </div>
          <h2 className="scanner-heading">Attendance Logged</h2>
          <p className="scanner-description">
            Biometric check-in verified. {matchedEmp.name} has been successfully logged as <strong>Present</strong> in the enterprise core database.
          </p>
          <div className="success-info-table">
            <div className="info-row">
              <span>Nodal Match</span>
              <strong>{matchedEmp.id}</strong>
            </div>
            <div className="info-row">
              <span>Timestamp</span>
              <strong>{new Date().toLocaleTimeString()}</strong>
            </div>
            <div className="info-row">
              <span>Network Status</span>
              <strong>REST API SYNCED</strong>
            </div>
          </div>
          <Button onClick={() => {
            if (onScanComplete) onScanComplete(matchedEmp);
            setStage('permission');
            setMatchedEmp(null);
          }} variant="secondary" fullWidth>
            Return to Attendance list
          </Button>
        </div>
      )}
    </div>
  );
};

export default FaceScanner;
