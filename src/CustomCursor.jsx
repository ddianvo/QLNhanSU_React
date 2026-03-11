import React, { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const cursorRef = useRef({ x: 0, y: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const onMouseMove = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
      
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px';
        dotRef.current.style.top = e.clientY + 'px';
      }
    };

    const animateRing = () => {
      cursorRef.current.rx += (cursorRef.current.x - cursorRef.current.rx) * 0.14;
      cursorRef.current.ry += (cursorRef.current.y - cursorRef.current.ry) * 0.14;
      if (ringRef.current) {
        ringRef.current.style.left = cursorRef.current.rx + 'px';
        ringRef.current.style.top = cursorRef.current.ry + 'px';
      }
      requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove);
    const animId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef}></div>
      <div id="cursor-ring" ref={ringRef}></div>
    </>
  );
};

export default CustomCursor;