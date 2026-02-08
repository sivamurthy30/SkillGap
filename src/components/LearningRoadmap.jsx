import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { generateLearningRoadmap, estimateTotalTime } from '../utils/learningResources';

const LearningRoadmap = ({ skillGaps, learningSpeed }) => {
  const roadmapRef = useRef(null);

  useEffect(() => {
    if (roadmapRef.current && skillGaps.length > 0) {
      gsap.fromTo('.roadmap-item',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [skillGaps]);

  if (!skillGaps || skillGaps.length === 0) {
    return null;
  }

  const roadmap = generateLearningRoadmap(skillGaps, learningSpeed);
  const totalTime = estimateTotalTime(skillGaps, learningSpeed);

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'Priority': return '#dc2626';
      case 'Secondary': return '#d97706';
      case 'Optional': return '#475569';
      default: return '#475569';
    }
  };

  return (
    <div className="learning-roadmap" ref={roadmapRef}>
      <div className="roadmap-header">
        <h3>Learning Roadmap</h3>
        <div className="roadmap-summary">
          <span className="total-time">Total Time: {totalTime}</span>
          <span className="skill-count">{skillGaps.length} Skills</span>
        </div>
      </div>

      <div className="roadmap-timeline">
        {roadmap.map((item, index) => (
          <div key={item.skill} className="roadmap-item">
            <div className="roadmap-marker" style={{ borderColor: getPhaseColor(item.phase) }}>
              <span className="marker-number">{index + 1}</span>
            </div>
            <div className="roadmap-content">
              <div className="roadmap-skill-header">
                <h4>{item.skill}</h4>
                <span className="roadmap-phase" style={{ backgroundColor: getPhaseColor(item.phase) }}>
                  {item.phase}
                </span>
              </div>
              <div className="roadmap-details">
                <span className="roadmap-duration">📅 {item.duration} weeks</span>
                <span className="roadmap-timeline">Week {item.startWeek + 1} - {item.endWeek}</span>
                <span className="roadmap-importance">⭐ {Math.round(item.importance * 100)}% importance</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="roadmap-footer">
        <p>💡 This roadmap is optimized for your <strong>{learningSpeed}</strong> learning pace</p>
      </div>
    </div>
  );
};

export default LearningRoadmap;
