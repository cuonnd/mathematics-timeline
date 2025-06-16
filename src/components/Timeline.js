import React, { useState, useEffect } from 'react';
import PersonCard from './PersonCard';
import YearMarker from './YearMarker';
import { mathematicians } from '../data/mathematicians';
import '../styles/Timeline.css';

const Timeline = () => {
  const [currentYear, setCurrentYear] = useState(1300);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const minYear = 1300;
  const maxYear = 1900;
  const pixelsPerYear = 5; // 5px per year
  const timelineWidth = (maxYear - minYear) * pixelsPerYear;
  const yearRange = maxYear - minYear;
  const rowHeight = 80; // Chiều cao mỗi hàng
  const maxLanesPerRow = 8; // Số lane tối đa mỗi hàng

  // Auto play functionality
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= maxYear) {
            setIsPlaying(false);
            return minYear;
          }
          return prev + 1;
        });
      }, 50); // Tốc độ chạy timeline
    }
    return () => clearInterval(interval);
  }, [isPlaying, maxYear]);

  // Hàm tính toán layout để tránh overlap
  const calculateLayout = () => {
    // Sắp xếp theo năm sinh
    const sortedMathematicians = [...mathematicians].sort((a, b) => a.birthYear - b.birthYear);
    
    // Tạo mảng đa chiều để lưu trữ vị trí
    const layout = [];
    const occupiedSpaces = []; // Theo dõi không gian đã sử dụng
    
    sortedMathematicians.forEach((person) => {
      const startPos = (person.birthYear - minYear) * pixelsPerYear;
      const endPos = (person.deathYear - minYear) * pixelsPerYear;
      const width = endPos - startPos;
      
      // Tìm hàng trống cho nhân vật này
      let assignedRow = 0;
      let assignedLane = 0;
      let placed = false;
      
      while (!placed) {
        // Kiểm tra từng lane trong hàng hiện tại
        for (let lane = 0; lane < maxLanesPerRow; lane++) {
          const key = `${assignedRow}-${lane}`;
          
          if (!occupiedSpaces[key]) {
            occupiedSpaces[key] = [];
          }
          
          // Kiểm tra xem có conflict với các nhân vật khác không
          const hasConflict = occupiedSpaces[key].some(occupiedPerson => {
            const occupiedStart = (occupiedPerson.birthYear - minYear) * pixelsPerYear;
            const occupiedEnd = (occupiedPerson.deathYear - minYear) * pixelsPerYear;
            
            return !(endPos <= occupiedStart || startPos >= occupiedEnd);
          });
          
          if (!hasConflict) {
            // Đặt nhân vật vào vị trí này
            occupiedSpaces[key].push(person);
            assignedLane = lane;
            placed = true;
            break;
          }
        }
        
        if (!placed) {
          assignedRow++;
        }
      }
      
      layout.push({
        ...person,
        row: assignedRow,
        lane: assignedLane,
        startPos,
        endPos,
        width,
        left: startPos,
        top: 80 + (assignedRow * rowHeight) + (assignedLane * 10) // Offset nhỏ cho mỗi lane
      });
    });
    
    return layout;
  };

  const layout = calculateLayout();

  // Tạo markers cho các năm
  const yearMarkers = [];
  for (let year = minYear; year <= maxYear; year += 50) {
    const position = (year - minYear) * pixelsPerYear;
    yearMarkers.push(
      <YearMarker key={year} year={year} position={position} />
    );
  }

  // Tính chiều cao cần thiết cho container
  const maxRow = Math.max(...layout.map(item => item.row));
  const containerHeight = 120 + (maxRow + 1) * rowHeight;

  return (
    <div className="timeline-container">
      <h1>Timeline of Mathematics</h1>
      
      {/* Controls */}
      <div className="timeline-controls">
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="play-button"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={(e) => setCurrentYear(parseInt(e.target.value))}
          className="year-slider"
        />
        
        <span className="current-year">Year: {currentYear}</span>
      </div>

      {/* Timeline */}
      <div className="timeline-wrapper">
        <div 
          className="timeline-area" 
          style={{ 
            width: timelineWidth + 100,
            height: containerHeight
          }}
        >
          {/* Year markers */}
          <div className="year-markers">
            {yearMarkers}
          </div>

          {/* Current year indicator */}
          <div 
            className="current-year-line"
            style={{ 
              left: `${(currentYear - minYear) * pixelsPerYear}px` 
            }}
          />

          {/* Person cards */}
          <div className="persons-area">
            {layout.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                currentYear={currentYear}
                position={{ left: person.left, top: person.top }}
                width={person.width}
                pixelsPerYear={pixelsPerYear}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;