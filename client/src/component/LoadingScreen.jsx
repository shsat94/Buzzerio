import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 400);

    // When progress reaches 100%, start fade-out
    if (progress === 100) {
      setTimeout(() => {
        setVisible(false);
      }, 500);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [progress]);

  // Demo toggle control
  const toggleLoader = () => {
    if (!visible) {
      setProgress(0);
      setVisible(true);
    }
  };


  return (
    <div className="relative w-full h-screen flex flex-col">
      {/* Demo content behind loader */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Buzzerio Project Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">Dashboard Item 1</div>
          <div className="bg-white p-4 rounded-lg shadow">Dashboard Item 2</div>
          <div className="bg-white p-4 rounded-lg shadow">Dashboard Item 3</div>
        </div>
      </div>

      {/* Loading overlay */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Blurred backdrop */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md"></div>
        
        {/* Loading card */}
        <div className="relative bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 w-64 flex flex-col items-center justify-center shadow-2xl border border-white/20">
          {/* Spinner */}
          <div className="relative w-20 h-20 mb-4">
            {/* Outer spinning ring */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 border-r-blue-500 animate-spin"></div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-purple-600 to-blue-400 animate-pulse"></div>
            
            {/* Glowing effect */}
            <div className="absolute inset-0 rounded-full bg-purple-500 opacity-20 blur-md animate-pulse"></div>
          </div>
          
          {/* Text and progress */}
          <div className="text-white font-medium mb-4">
            Loading<span className="animate-pulse">...</span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-300 bg-opacity-20 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Progress percentage */}
          <div className="text-white/80 text-sm mt-2">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
}