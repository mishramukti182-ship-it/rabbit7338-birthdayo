import { useState, useEffect } from 'react';
import LockScreen from './components/LockScreen';
import BirthdayScreen from './components/BirthdayScreen';

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  const targetDate = new Date('2026-03-04T00:00:00');

  useEffect(() => {
    const now = new Date();
    if (now >= targetDate) {
      setUnlocked(true);
    }
  }, []);

  const handleBypass = () => {
    setTransitioning(true);
    setTimeout(() => {
      setUnlocked(true);
      setTransitioning(false);
    }, 800);
  };

  return (
    <div className="w-full h-screen relative overflow-hidden" style={{ background: '#0a0612' }}>
      {!unlocked ? (
        <div
          style={{
            opacity: transitioning ? 0 : 1,
            transform: transitioning ? 'scale(1.05)' : 'scale(1)',
            filter: transitioning ? 'blur(10px)' : 'blur(0)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            width: '100%',
            height: '100%',
          }}
        >
          <LockScreen onBypass={handleBypass} />
        </div>
      ) : (
        <BirthdayScreen />
      )}
    </div>
  );
}
