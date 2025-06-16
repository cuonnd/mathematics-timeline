import React from 'react';

const PersonCard = ({ person, currentYear, position, width, pixelsPerYear }) => {
  const age = currentYear >= person.birthYear && currentYear <= person.deathYear 
    ? currentYear - person.birthYear 
    : null;

  const isAlive = currentYear >= person.birthYear && currentYear <= person.deathYear;
  
  // Tính toán vị trí hiện tại của indicator
  const currentPosition = isAlive 
    ? (currentYear - person.birthYear) * pixelsPerYear 
    : 0;

  // Tính toán width tối thiểu để hiển thị tên
  const displayWidth = Math.max(width, 120);

  return (
    <div 
      className={`person-card ${isAlive ? 'alive' : 'not-alive'}`}
      style={{
        backgroundColor: person.color,
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${displayWidth}px`,
        opacity: isAlive ? 1 : 0.4
      }}
    >
      {/* Life span bar */}
      <div 
        className="life-span-bar"
        style={{
          width: `${width}px`,
          backgroundColor: 'rgba(255,255,255,0.3)',
          height: '4px',
          position: 'absolute',
          top: '2px',
          left: '0px',
          borderRadius: '2px'
        }}
      >
        {/* Current age indicator */}
        {isAlive && (
          <div 
            className="age-indicator"
            style={{
              position: 'absolute',
              left: `${currentPosition}px`,
              top: '-2px',
              width: '2px',
              height: '8px',
              backgroundColor: '#FFD700',
              borderRadius: '1px'
            }}
          />
        )}
      </div>

      {/* Person info */}
      <div className="person-content">
        <div className="person-image">
          <img src={person.image} alt={person.name} />
        </div>
        <div className="person-info">
          <div className="person-name">{person.name}</div>
          <div className="person-years">
            {person.birthYear} - {person.deathYear}
          </div>
          {age !== null && (
            <div className="person-age">Age: {age}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonCard;