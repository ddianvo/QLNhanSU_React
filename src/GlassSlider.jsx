import React, { useRef, useEffect } from 'react';
import './GlassSlider.css';

const GlassSlider = ({ value, onChange }) => {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);

  // Xử lý khi di chuyển chuột
  const handleMouseMove = (e) => {
    if (!isDragging.current || !sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    
    // Tính toán phần trăm (0 - 100)
    let newValue = (offsetX / width) * 100;
    newValue = Math.max(0, Math.min(100, newValue));
    
    if (onChange) {
      onChange(Math.round(newValue));
    }
  };

  // Xử lý khi thả chuột
  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Xử lý khi nhấn chuột
  const handleMouseDown = (e) => {
    isDragging.current = true;
    handleMouseMove(e); // Cập nhật ngay vị trí khi click
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="glass-slider-wrapper">
      <div 
        id="slider" 
        ref={sliderRef} 
        onMouseDown={handleMouseDown}
      >
        {/* Truyền biến CSS --range-size để CSS xử lý hiệu ứng width */}
        <div className="rangeBar" style={{ '--range-size': value }}></div>
        
        <div className="rangeHandle" style={{ left: `${value}%` }}>
          <div className="rangeNub"></div>
          <div className="rangeFloat">{Math.round(value)}%</div>
        </div>
      </div>
    </div>
  );
};

export default GlassSlider;