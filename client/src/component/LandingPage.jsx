import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [fishPos, setFishPos] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [bubbles, setBubbles] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const generateBubbles = () => {
      const newBubbles = [];
      for (let i = 0; i < 15; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 60 + 10,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.3 + 0.1
        });
      }
      setBubbles(newBubbles);
    };
    generateBubbles();
  }, []);

  useEffect(() => {
    let frameId;
    const animate = () => {
      setBubbles(prev => prev.map(bubble => ({
        ...bubble,
        y: bubble.y <= -bubble.size ? window.innerHeight + bubble.size : bubble.y - bubble.speed,
        x: bubble.x + Math.sin(Date.now() * 0.001 + bubble.id) * 0.5
      })));
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const handleFishMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleFishMouseMove = (e) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setFishPos({
        x: Math.max(0, Math.min(e.clientX - rect.left - dragOffset.x, rect.width - 60)),
        y: Math.max(0, Math.min(e.clientY - rect.top - dragOffset.y, rect.height - 60))
      });
    }
  };

  const handleFishMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleFishMouseMove);
      document.addEventListener('mouseup', handleFishMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleFishMouseMove);
      document.removeEventListener('mouseup', handleFishMouseUp);
    };
  }, [isDragging, dragOffset]);

  const FluidBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, 
            rgba(59, 130, 246, 0.3) 0%, 
            rgba(147, 51, 234, 0.2) 25%, 
            rgba(236, 72, 153, 0.2) 50%, 
            rgba(34, 197, 94, 0.1) 75%, 
            transparent 100%)`,
          transition: 'all 0.3s ease-out'
        }}
      />

      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          className="absolute rounded-full bg-gradient-to-br from-blue-400 to-purple-500"
          style={{
            left: bubble.x,
            top: bubble.y,
            width: bubble.size,
            height: bubble.size,
            opacity: bubble.opacity,
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() * 0.003 + bubble.id) * 0.1})`,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  );

  const InteractiveTagline = () => {
    const [hovered, setHovered] = useState(null);
    const words = ['Fast.', 'Fair.', 'Buzzerio.'];
    return (
      <div className="text-center mb-8">
        <div className="flex justify-center items-center space-x-4 text-6xl font-bold">
          {words.map((word, index) => (
            <span
              key={index}
              className={`cursor-pointer transition-all duration-300 ${
                hovered === index 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 scale-110 drop-shadow-lg' 
                  : 'text-white hover:text-blue-300'
              }`}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              style={{
                transform: hovered === index ? 'translateY(-10px) scale(1.1)' : 'translateY(0)',
                textShadow: hovered === index ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none'
              }}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    );
  };

  const DraggableFish = () => (
    <div
      className={`absolute cursor-pointer transition-transform ${isDragging ? 'scale-110' : 'hover:scale-105'}`}
      style={{ left: fishPos.x, top: fishPos.y, zIndex: 10 }}
      onMouseDown={handleFishMouseDown}
    >
      <div className="relative">
        <div className="text-6xl animate-bounce">🐠</div>
        {isDragging && (
          <div className="absolute -inset-4 bg-blue-400 rounded-full opacity-30 animate-ping" />
        )}
      </div>
    </div>
  );

  const handleDashboardClick = () => navigate('/home');

  const LoginSection = () => (
    <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20 shadow-2xl">
      <h3 className="text-2xl font-semibold text-white mb-6 text-center">Ready to Get Started?</h3>
      {localStorage.getItem('token') == null ? (
        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Continue with Login
          </button>
          <p className="text-white text-opacity-70 text-center text-sm">
            Join thousands of quiz creators worldwide
          </p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-4xl animate-bounce">🎉</div>
          <p className="text-white text-xl">Welcome to Buzzerio!</p>
          <button onClick={handleDashboardClick} className="bg-green-500 text-white py-3 px-6 rounded-xl hover:bg-green-400 transition-colors">
            Enter Dashboard
          </button>
        </div>
      )}
    </div>
  );

  const AboutSection = () => (
    <div className="bg-white bg-opacity-5 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-10">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Buzzerio</span>
        </h2>
        <p className="text-xl text-white text-opacity-90 leading-relaxed max-w-3xl mx-auto">
          Buzzerio helps you host <span className="font-semibold text-blue-300">fast and fair quizzes</span>. 
          With Buzzerio, you can create and manage interactive quizzes in a 
          <span className="font-semibold text-purple-300"> fun and engaging way</span>.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-10 rounded-2xl p-6 hover:bg-opacity-20 transition-all cursor-pointer">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold text-white mb-2">Lightning Fast</h3>
            <p className="text-white text-opacity-70">Create quizzes in seconds with our intuitive builder</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-6 hover:bg-opacity-20 transition-all cursor-pointer">
            <div className="text-4xl mb-4">⚖️</div>
            <h3 className="text-xl font-semibold text-white mb-2">Always Fair</h3>
            <p className="text-white text-opacity-70">Advanced anti-cheat systems ensure honest gameplay</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-6 hover:bg-opacity-20 transition-all cursor-pointer">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-white mb-2">Super Engaging</h3>
            <p className="text-white text-opacity-70">Interactive elements keep players excited and focused</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden"
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
      <FluidBackground />
      <div className="relative z-10 min-h-screen flex flex-col">
        <header className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-white">Buzzerio</div>
            <div className="text-white text-opacity-70">🎯 Try dragging the fish! 🐠</div>
          </div>
        </header>
        <main className="flex-1 flex flex-col justify-center items-center px-6 py-12 space-y-12">
          <InteractiveTagline />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl w-full">
            <AboutSection />
            <LoginSection />
          </div>
        </main>
        <footer className="p-6 text-center text-white text-opacity-50">
          <p>&copy; 2024 Buzzerio. Making quizzes fun again.</p>
        </footer>
      </div>
      <DraggableFish />
      <div className="fixed bottom-6 right-6 space-y-3">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-4 cursor-pointer hover:scale-110 transition-transform">
          <div className="text-2xl animate-spin">⭐</div>
        </div>
        <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-full p-4 cursor-pointer hover:scale-110 transition-transform">
          <div className="text-2xl animate-pulse">💫</div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
