import { useEffect, useRef, useState } from 'react';

const GOLD_PARTICLES = 80;
const CONFETTI_COLORS = ['#d4a853', '#f0d68a', '#c9456d', '#e8789a', '#a07cdb', '#7c5cbf', '#f5e1b0', '#d4a853'];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  opacity: number;
}

export default function BirthdayScreen() {
  const [stage, setStage] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < GOLD_PARTICLES; i++) {
      particlesRef.current.push(createParticle(canvas.width, canvas.height));
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.2 ? lifeRatio * 5 : lifeRatio > 0.8 ? (1 - lifeRatio) * 5 : 1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('1)', `${alpha * p.opacity})`);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2 * (0.5 + lifeRatio * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace('1)', `${alpha * p.opacity * 0.15})`);
        ctx.fill();

        if (p.life <= 0) {
          particlesRef.current[idx] = createParticle(canvas.width, canvas.height);
        }
      });

      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1600),
      setTimeout(() => setStage(3), 2800),
      setTimeout(() => setStage(4), 4000),
      setTimeout(() => setStage(5), 5200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const confettiPieces = useRef(
    Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 8,
      size: Math.random() * 6 + 3,
      sway: (Math.random() - 0.5) * 150,
      rotation: Math.random() * 720,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }))
  ).current;

  const bgStars = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 6,
      duration: Math.random() * 3 + 3,
    }))
  ).current;

  return (
    <div
      className="birthday-bg w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{ animation: 'reveal-circle 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-[1]" />

      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[10%] left-[15%] w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(212,168,83,0.06), transparent 70%)',
            filter: 'blur(100px)',
            animation: 'aurora 18s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201,69,109,0.05), transparent 70%)',
            filter: 'blur(80px)',
            animation: 'aurora 22s 5s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(120,80,180,0.04), transparent 70%)',
            filter: 'blur(120px)',
            animation: 'breathe 8s ease-in-out infinite',
          }}
        />
      </div>

      {bgStars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: 'rgba(212,168,83,0.6)',
            animation: `star-pulse ${s.duration}s ${s.delay}s ease-in-out infinite`,
          }}
        />
      ))}

      {stage >= 2 && confettiPieces.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: '-3%',
            width: p.shape === 'rect' ? p.size * 0.6 : p.size,
            height: p.shape === 'rect' ? p.size * 1.8 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '1px',
            opacity: 0.5,
            ['--sway' as string]: `${p.sway}px`,
            animation: `confetti-elegant ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}

      <div
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,3,10,0.6) 100%)',
        }}
      />

      <div className="relative z-[3] flex flex-col items-center text-center px-6 max-w-2xl w-full">
        <div
          className="mb-6"
          style={{
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="relative flex flex-col items-center">
            <div
              className="w-4 h-6 rounded-full mb-0.5"
              style={{
                background: 'radial-gradient(ellipse at center bottom, #f0d68a, #d4a853, rgba(201,69,109,0.6))',
                filter: 'blur(1px)',
                animation: 'candle-flicker 2s ease-in-out infinite',
              }}
            />
            <div
              className="absolute -top-3 w-12 h-12 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(240,214,138,0.3), transparent 70%)',
                filter: 'blur(8px)',
                animation: 'candle-flicker 2s ease-in-out infinite',
              }}
            />
            <div
              className="w-1.5 h-8 rounded-b-sm"
              style={{ background: 'linear-gradient(180deg, rgba(212,168,83,0.6), rgba(212,168,83,0.2))' }}
            />
          </div>
        </div>

        <h1
          className="mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            opacity: stage >= 1 ? 1 : 0,
            animation: stage >= 1 ? 'title-reveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          }}
        >
          <span className="gold-gradient-text">Happy Birthday</span>
        </h1>

        <div
          className="h-px mb-5 mt-2"
          style={{
            width: '120px',
            background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.4), transparent)',
            opacity: stage >= 2 ? 1 : 0,
            transform: stage >= 2 ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'all 1s 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />

        <div
          style={{
            opacity: stage >= 2 ? 1 : 0,
            animation: stage >= 2 ? 'slide-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          }}
        >
          <h2
            className="mb-1"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(1.3rem, 4vw, 2.2rem)',
              letterSpacing: '0.08em',
              animation: stage >= 2 ? 'golden-glow 4s ease-in-out infinite' : 'none',
              color: '#d4a853',
            }}
          >
            rabbit7338
          </h2>
          <p
            className="text-xs tracking-[5px] uppercase mb-8"
            style={{ color: 'rgba(212,168,83,0.25)', fontWeight: 400 }}
          >
            4 · March · 2026
          </p>
        </div>

        <div
          className="glass-premium rounded-2xl p-8 md:p-10 max-w-md w-full relative overflow-hidden"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            animation: stage >= 3 ? 'slide-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,83,0.1) 0%, transparent 30%, transparent 70%, rgba(201,69,109,0.08) 100%)',
            }}
          />

          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.3), transparent)',
            }}
          />

          <div className="relative z-10">
            <p
              className="text-lg md:text-xl leading-relaxed mb-5"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontStyle: 'italic',
                color: 'rgba(240,214,138,0.9)',
              }}
            >
              Happy Birthday bro
            </p>

            <div
              className="w-8 h-px mx-auto mb-5"
              style={{ background: 'rgba(212,168,83,0.2)' }}
            />

            <p
              className="text-sm md:text-base leading-relaxed mb-4"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
                color: 'rgba(200,190,220,0.6)',
                letterSpacing: '0.02em',
              }}
            >
              I'll never stop bully u
            </p>

            <p
              className="text-sm md:text-base leading-relaxed"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                color: 'rgba(200,190,220,0.75)',
                letterSpacing: '0.02em',
              }}
            >
              Have a great and joyful day ✦
            </p>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center gap-3"
          style={{
            opacity: stage >= 4 ? 1 : 0,
            animation: stage >= 4 ? 'slide-reveal 1s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both' : 'none',
          }}
        >
          <div
            className="w-10 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.2), transparent)' }}
          />
          <p
            className="text-[11px] tracking-[4px] uppercase"
            style={{ color: 'rgba(212,168,83,0.15)', fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
          >
            made with love & bullying
          </p>
        </div>

        <div
          className="mt-6"
          style={{
            opacity: stage >= 5 ? 1 : 0,
            transition: 'opacity 1s ease',
          }}
        >
          <div className="flex items-center gap-4 justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: 3,
                  height: 12 + Math.sin(i * 1.2) * 8,
                  background: `rgba(212,168,83,${0.08 + i * 0.02})`,
                  animation: `pulse-soft ${1.5 + i * 0.2}s ${i * 0.15}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-[2]"
        style={{ background: 'linear-gradient(to top, rgba(5,3,10,0.4), transparent)' }}
      />
    </div>
  );
}

function createParticle(w: number, h: number): Particle {
  const isGold = Math.random() > 0.3;
  return {
    x: Math.random() * w,
    y: h + Math.random() * 50,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -(Math.random() * 0.8 + 0.2),
    life: Math.random() * 400 + 200,
    maxLife: 600,
    size: Math.random() * 2 + 0.5,
    color: isGold
      ? `rgba(212, 168, 83, 1)`
      : `rgba(201, 69, 109, 1)`,
    opacity: Math.random() * 0.5 + 0.2,
  };
          }
