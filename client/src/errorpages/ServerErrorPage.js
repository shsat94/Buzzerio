import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ServerErrorPage = () => {
  return (
    <div style={{display:'flex',justifyContent:'center', color: 'white'}}>
      <div style={{ display:'flex',justifyContent:'center',flexDirection:'column',textAlign:'center'}}>
        <DotLottieReact
          src="https://lottie.host/ca1857de-b338-430c-881e-7f21a66373f5/vpSlu0oQ8g.json"
          loop
          autoplay
        />
        <h1 style={{fontSize:'2rem'}}>Internal Server Error : Connection lost</h1>

      </div>
    </div>
  );
};

export default ServerErrorPage;
