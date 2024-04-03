import React from 'react';
import BaseContainer from '../ui/BaseContainer'; 
import SubmitButton from '../ui/SubmitButton'; 

const LandingPage = () => {
  return (
    <BaseContainer size="small" className="flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mt-8 mb-12">
        Welcome to PeekSeek!
      </h1>
      <div className="flex-grow flex items-center justify-center mb-12">
        <img src="/images/PeekSeek_logo.jpg" alt="PeekSeek Logo" style={{ width: '350px', height: '350px' }}/>
      </div>
      <div className="w-full flex justify-center mb-12">
        <SubmitButton /> {/* will change buttons */}
      </div>
    </BaseContainer>
  );
};

export default LandingPage;
