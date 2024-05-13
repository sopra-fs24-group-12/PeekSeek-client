import React from "react";

const MediaDisplay: React.FC = () => {
  const videoContainerStyle: React.CSSProperties = {
    
    width: "700px", // Set width for the circular container
    height: "300px", // Set height for the circular container
    overflow: "hidden",
    borderRadius: "50%", // Make the container round
    border: "5px solid rgba(255, 255, 255, 0.1)", // Thicker border with some transparency
    boxShadow: "0 0 20px 2px rgba(0, 0, 0, 0.3)", // Blurred shadow for diffusing effect
    display: "flex", // Center the video inside the container
    alignItems: "center",
    justifyContent: "center",
    margin: "auto", // Center the container horizontally
    backdropFilter: "blur(500px)", // Blur effect to help the container blend with the background
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
