import styled, { keyframes } from 'styled-components'
import { motion } from 'framer-motion'

const drift = keyframes`
  0%   { transform: translate(0,  0)   scale(1);    opacity: 0.5; }
  33%  { transform: translate(50px, -40px) scale(1.08); opacity: 0.7; }
  66%  { transform: translate(-25px, 25px) scale(0.96); opacity: 0.45; }
  100% { transform: translate(0,  0)   scale(1);    opacity: 0.5; }
`

export const Shell = styled.div`
  position: relative;
  width: 100vw;
  height: 100dvh;
  overflow: hidden;
  background: ${(p) => p.theme.colors.bg.base};
  display: flex;
  flex-direction: column;
  isolation: isolate;
`

export const DotGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: radial-gradient(
    circle,
    rgba(100, 116, 139, 0.10) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
`

export const GlowBlobBlue = styled.div`
  position: absolute;
  top: -20%; left: -15%;
  width: 55vw; height: 55vw;
  max-width: 700px; max-height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, transparent 65%);
  animation: ${drift} 20s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`

export const GlowBlobAmber = styled.div`
  position: absolute;
  bottom: -20%; right: -15%;
  width: 60vw; height: 60vw;
  max-width: 800px; max-height: 800px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 119, 6, 0.05) 0%, transparent 65%);
  animation: ${drift} 26s ease-in-out infinite reverse;
  pointer-events: none;
  z-index: 0;
  @media (prefers-reduced-motion: reduce) { animation: none; }
`

export const GlowBlobLive = styled(motion.div)`
  position: absolute;
  top: 25%; left: 15%;
  width: 45vw; height: 45vw;
  max-width: 600px; max-height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.05) 0%, transparent 65%);
  pointer-events: none;
  z-index: 0;
`

export const ContentLayer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
`
