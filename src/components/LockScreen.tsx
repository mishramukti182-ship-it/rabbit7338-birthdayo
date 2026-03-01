import { useState, useEffect, useCallback, useRef } from 'react';

interface LockScreenProps {
  onBypass: () => void;
}

export default function LockScreen({ onBypass }: LockScreenProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [showSecret, setShowSecret] = useState(false);
  const [password, setPassword] = useState('');
  const [shaking, setShaking] = useState(false);
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const targetDate = new Date('2026-03-04T00:00:00');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; r: number; speed: number; opacity: number; phase: number }[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.3,
        speed: Math.random() * 0.005 + 0.002,
        opacity: Math.random() * 0.5 + 0.1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let frame: number;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        const twinkle = Math.sin(time * star.speed + star.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 168, 83, ${star.opacity * twinkle})`;
        ctx.fill();
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff <= 0) {
        onBypass();
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLockClick = useCallback(() => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) setShowSecret(true);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, [clickCount]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'rabbit7338') {
      onBypass();
    } else {
      setWrongAttempt(true);
      setPassword('');
      setTimeout(() => setWrongAttempt(false), 800);
    }
  };

  return (
    <div className="lock-bg w-full h-full flex items-center justify-center relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/4 left-0 right-0 h-[70%]"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(120,60,180,0.06), rgba(212,168,83,0.03), transparent)',
            animation: 'aurora 20s ease-in-out infinite',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute -top-1/3 left-1/4 right-0 h-[60%]"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(201,69,109,0.04), rgba(100,50,150,0.03), transparent)',
            animation: 'aurora 25s 5s ease-in-out infinite',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5,3,10,0.7) 100%)',
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-lg"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          onClick={handleLockClick}
          className="cursor-pointer mb-10 select-none relative group"
          style={{
            animation: shaking ? 'shake-subtle 0.5s ease-in-out' : 'float-gentle 6s ease-in-out infinite',
          }}
        >
          <div className="relative">
            <div
              className="absolute -inset-6 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(212,168,83,0.08), transparent 70%)',
                animation: 'glow-ring 4s ease-in-out infinite',
              }}
            />
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22 32 V24 C22 14 28 8 36 8 C44 8 50 14 50 24 V32"
                stroke="rgba(212,168,83,0.5)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <rect
                x="16" y="32" width="40" height="32" rx="6"
                fill="rgba(212,168,83,0.08)"
                stroke="rgba(212,168,83,0.3)"
                strokeWidth="1.5"
              />
              <circle cx="36" cy="44" r="3.5" fill="rgba(212,168,83,0.5)" />
              <rect x="34.5" y="46" width="3" height="8" rx="1.5" fill="rgba(212,168,83,0.4)" />
            </svg>
          </div>
        </div>

        <h1
          className="text-2xl md:text-3xl font-light tracking-[0.15em] mb-3"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: 'rgba(212,168,83,0.8)',
            animation: mounted ? 'fade-in-up 1s 0.3s ease-out both' : 'none',
          }}
        >
          NOT YET
        </h1>

        <div
          className="w-16 h-px mb-6"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.4), transparent)',
            animation: mounted ? 'fade-in 1s 0.5s ease-out both' : 'none',
          }}
        />

        <p
          className="text-sm md:text-base mb-10 leading-relaxed"
          style={{
            color: 'rgba(200,190,220,0.5)',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 300,
            letterSpacing: '0.03em',
            animation: mounted ? 'fade-in-up 1s 0.6s ease-out both' : 'none',
          }}
        >
          Come back on{' '}
          <span style={{ color: 'rgba(212,168,83,0.7)', fontWeight: 500 }}>
            4 March 2026
          </span>
          <br />
          <span className="text-xs" style={{ color: 'rgba(200,190,220,0.3)' }}>
            ...duh
          </span>
        </p>

        <div
          className="flex gap-3 md:gap-4 mb-8"
          style={{ animation: mounted ? 'fade-in-up 1s 0.8s ease-out both' : 'none' }}
        >
          {[
            { label: 'DAYS', value: timeLeft.days },
            { label: 'HRS', value: timeLeft.hours },
            { label: 'MIN', value: timeLeft.minutes },
            { label: 'SEC', value: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={item.label}
              className="glass-dark rounded-xl px-3 py-3 md:px-5 md:py-4 min-w-[60px] md:min-w-[72px]"
              style={{ animation: `countdown-glow 4s ${i * 0.5}s ease-in-out infinite` }}
            >
              <div
                className="text-xl md:text-3xl font-light gold-gradient-text"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {String(item.value).padStart(2, '0')}
              </div>
              <div
                className="text-[9px] md:text-[10px] tracking-[3px] mt-1.5"
                style={{ color: 'rgba(212,168,83,0.25)', fontWeight: 500 }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <p
          className="text-xs h-4"
          style={{ color: 'rgba(212,168,83,0.15)', fontWeight: 300 }}
        >
          {clickCount > 0 && clickCount < 5 && `${5 - clickCount} more...`}
        </p>

        {showSecret && (
          <form
            onSubmit={handlePasswordSubmit}
            className="mt-6 flex flex-col items-center gap-3"
            style={{ animation: 'fade-in-up 0.6s ease-out' }}
          >
            <div className="w-12 h-px mb-1" style={{ background: 'rgba(212,168,83,0.15)' }} />
            <p className="text-[10px] tracking-[4px] uppercase" style={{ color: 'rgba(212,168,83,0.3)' }}>
              Secret Access
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-transparent rounded-lg px-4 py-2 text-sm outline-none transition-all w-40"
                style={{
                  border: `1px solid ${wrongAttempt ? 'rgba(201,69,109,0.4)' : 'rgba(212,168,83,0.15)'}`,
                  color: 'rgba(212,168,83,0.7)',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  animation: wrongAttempt ? 'shake-subtle 0.4s ease-in-out' : 'none',
                }}
                autoFocus
              />
              <button
                type="submit"
                className="rounded-lg px-4 py-2 text-sm transition-all hover:opacity-80"
                style={{
                  border: '1px solid rgba(212,168,83,0.15)',
                  color: 'rgba(212,168,83,0.5)',
                  background: 'rgba(212,168,83,0.05)',
                }}
              >
                →
              </button>
            </div>
            {wrongAttempt && (
              <p className="text-xs" style={{ color: 'rgba(201,69,109,0.5)' }}>
                Not quite.
              </p>
            )}
          </form>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(10,6,18,0.5), transparent)' }}
      />
    </div>
  );
        }
