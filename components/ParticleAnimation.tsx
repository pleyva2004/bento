'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface ParticleAnimationConfig {
  particleCount: number;
  particleColor: string;
  connectionColor: string;
  maxDistance: number;
  particleSpeed: number;
  mouseAttractionStrength: number;
  mouseAttractionRadius: number;
  connectionHighlightRadius: number;
}

const defaultConfig: ParticleAnimationConfig = {
  particleCount: 70, // Medium energy
  particleColor: '#e5e7eb', // Neutral gray-200
  connectionColor: '#9ca3af', // Neutral gray-400
  maxDistance: 150, // Connection distance
  particleSpeed: 0.5, // Moderate speed
  mouseAttractionStrength: 0.3, // Gentle attraction
  mouseAttractionRadius: 200, // Attraction area
  connectionHighlightRadius: 150, // Highlight area near cursor
};

// Calculate particle count based on viewport area for consistent density across devices
const calculateParticleCount = (width: number, height: number): number => {
  // Reference: 70 particles looks good on 1920x1080 (~2M pixels)
  const referenceArea = 1920 * 1080;
  const referenceCount = 70;
  const density = referenceCount / referenceArea;

  const currentArea = width * height;
  const count = Math.round(currentArea * density);

  // Clamp between 15 (minimum for visual interest) and 100 (performance cap)
  return Math.max(20, Math.min(100, count));
};

export default function ParticleAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Initialize particles with viewport-based count for consistent density
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = calculateParticleCount(canvas.width, canvas.height);
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * defaultConfig.particleSpeed,
          vy: (Math.random() - 0.5) * defaultConfig.particleSpeed,
          radius: Math.random() * 2 + 1,
        });
      }
    };
    initParticles();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    // Update particle positions
    const updateParticles = () => {
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle) => {
        // Mouse attraction
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < defaultConfig.mouseAttractionRadius) {
          const force = (1 - distance / defaultConfig.mouseAttractionRadius) *
            defaultConfig.mouseAttractionStrength;
          particle.vx += (dx / distance) * force;
          particle.vy += (dy / distance) * force;
        }

        // Apply velocity damping
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Ensure minimum movement
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (speed < 0.1) {
          particle.vx += (Math.random() - 0.5) * 0.1;
          particle.vy += (Math.random() - 0.5) * 0.1;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.vx *= -1;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.vy *= -1;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }
      });
    };

    // Draw particles and connections
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < defaultConfig.maxDistance) {
            // Check if connection is near mouse for highlighting
            const midX = (particles[i].x + particles[j].x) / 2;
            const midY = (particles[i].y + particles[j].y) / 2;
            const mouseDx = mouse.x - midX;
            const mouseDy = mouse.y - midY;
            const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

            let opacity = 1 - distance / defaultConfig.maxDistance;

            // Highlight connections near cursor
            if (mouseDistance < defaultConfig.connectionHighlightRadius) {
              const highlightFactor = 1 - mouseDistance / defaultConfig.connectionHighlightRadius;
              opacity = Math.min(1, opacity + highlightFactor * 0.5);
            }

            ctx.strokeStyle = defaultConfig.connectionColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((particle) => {
        // Check if particle is near mouse
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let opacity = 0.8;
        let radius = particle.radius;

        // Highlight particles near cursor
        if (distance < defaultConfig.connectionHighlightRadius) {
          const highlightFactor = 1 - distance / defaultConfig.connectionHighlightRadius;
          opacity = Math.min(1, opacity + highlightFactor * 0.2);
          radius = particle.radius * (1 + highlightFactor * 0.5);
        }

        ctx.fillStyle = defaultConfig.particleColor + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Animation loop
    const animate = () => {
      updateParticles();
      draw();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Resize handler - defined as named function for proper cleanup
    const handleResize = () => {
      setCanvasSize();
      initParticles();
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
