import React from "react";

const MediaDisplay: React.FC = () => {
  const videoContainerStyle: React.CSSProperties = {
    
    width: "500px", 
    height: "350px",
    overflow: "hidden",
    borderRadius: "50%", 
    border: "5px solid rgba(255, 255, 255, 0.1)", 
    boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto", 
    backdropFilter: "blur(500px)", 
  };

  const videoStyle: React.CSSProperties = {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "auto",
    top: "10px",
    bottom: "30px",
  };

  return (
    <div style={videoContainerStyle}>
      <video style={videoStyle} autoPlay loop muted playsInline>
        <source src="/images/animation.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default MediaDisplay;
