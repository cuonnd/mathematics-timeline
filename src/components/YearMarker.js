import React from 'react';

const YearMarker = ({ year, position }) => {
  return (
    <div 
      className="year-marker"
      style={{ left: `${position}px` }}
    >
      <div className="year-line"></div>
      <div className="year-label">{year}</div>
    </div>
  );
};

export default YearMarker;