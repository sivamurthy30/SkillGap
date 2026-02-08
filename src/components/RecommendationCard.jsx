import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const RecommendationCard = ({ recommendation, learnerProfile, skillGaps = [] }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef(null);
  const metricsRef = useRef([]);

  const getSkillIcon = (skillName) => {
    const skill = skillName.toLowerCase();
    
    // Check for combined skills and return multiple icons
    const icons = [];
    
    // Programming Languages
    if (skill.includes('python')) icons.push('🐍');
    if (skill.includes('javascript') || skill.includes('js')) icons.push('🟨');
    if (skill.includes('java') && !skill.includes('javascript')) icons.push('☕');
    if (skill.includes('typescript') || skill.includes('ts')) icons.push('🔷');
    if (skill.includes('c++') || skill.includes('cpp')) icons.push('⚙️');
    if (skill.includes('c#') || skill.includes('csharp')) icons.push('🎯');
    if (skill.includes('ruby')) icons.push('💎');
    if (skill.includes('php')) icons.push('🐘');
    if (skill.includes('go') || skill.includes('golang')) icons.push('🔵');
    if (skill.includes('rust')) icons.push('🦀');
    if (skill.includes('swift')) icons.push('🔶');
    if (skill.includes('kotlin')) icons.push('🟣');
    if (skill.includes('scala')) icons.push('🔴');
    
    // Web Technologies
    if (skill.includes('html')) icons.push('🌐');
    if (skill.includes('css')) icons.push('🎨');
    if (skill.includes('react')) icons.push('⚛️');
    if (skill.includes('vue')) icons.push('🟢');
    if (skill.includes('angular')) icons.push('🔺');
    if (skill.includes('node')) icons.push('🟩');
    
    // Databases
    if (skill.includes('mysql')) icons.push('🐬');
    if (skill.includes('postgresql')) icons.push('🐘');
    if (skill.includes('mongodb')) icons.push('🍃');
    if (skill.includes('redis')) icons.push('🔴');
    if (skill.includes('sql') && !skill.includes('mysql') && !skill.includes('postgresql')) icons.push('🗄️');
    
    // Cloud & DevOps
    if (skill.includes('aws')) icons.push('☁️');
    if (skill.includes('azure')) icons.push('🔷');
    if (skill.includes('docker')) icons.push('🐳');
    if (skill.includes('kubernetes')) icons.push('☸️');
    if (skill.includes('git') && !skill.includes('hub') && !skill.includes('lab')) icons.push('📦');
    
    // Data & AI
    if (skill.includes('machine learning')) icons.push('🤖');
    if (skill.includes('data science')) icons.push('📊');
    if (skill.includes('tensorflow')) icons.push('🟠');
    if (skill.includes('pytorch')) icons.push('🔥');
    
    // Return icons or default
    if (icons.length > 0) {
      return icons.join(' ');
    }
    
    return '🔧';
  };

  useEffect(() => {
    if (recommendation && cardRef.current) {
      setIsVisible(true);
      // Animate card entrance
      gsap.fromTo(cardRef.current, 
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, [recommendation]);

  // Animate metric bars
  useEffect(() => {
    if (showDetails && metricsRef.current.length > 0) {
      metricsRef.current.forEach((bar, index) => {
        if (bar) {
          const width = bar.getAttribute('data-width');
          gsap.to(bar, {
            width: width,
            duration: 1,
            delay: index * 0.2,
            ease: 'power2.out'
          });
        }
      });
    }
  }, [showDetails]);

  if (!recommendation) {
    return (
      <div className="recommendation-card empty">
        <div className="empty-recommendation">
          <div className="empty-icon">○</div>
          <h3>Ready for Your Next Step?</h3>
          <p>Complete your learning profile to unlock personalized AI recommendations tailored to your career goals.</p>
          <div className="feature-list">
            <div className="feature-item">
              <span className="feature-icon">◊</span>
              <span>AI-Powered Analysis</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">■</span>
              <span>Data-Driven Insights</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">▲</span>
              <span>Personalized Learning Path</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation.skill) {
    return (
      <div className="recommendation-card success">
        <div className="success-celebration">
          <div className="celebration-icon">✓</div>
          <h3>Outstanding Achievement!</h3>
          <p>{recommendation.message}</p>
          <div className="next-steps">
            <h4>What's Next?</h4>
            <ul>
              <li>Start applying to your target roles</li>
              <li>Update your resume with these skills</li>
              <li>Consider advanced specializations</li>
              <li>Network with professionals in your field</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  const getEstimatedTime = (learningSpeed, importance) => {
    const baseWeeks = {
      slow: 6,
      medium: 4,
      fast: 2
    };
    
    const complexityMultiplier = importance > 0.8 ? 1.5 : 1;
    const weeks = Math.ceil(baseWeeks[learningSpeed] * complexityMultiplier);
    
    return weeks > 4 ? `${Math.ceil(weeks / 4)} months` : `${weeks} weeks`;
  };

  const getDifficultyLevel = (importance) => {
    if (importance >= 0.9) return { level: 'Expert', color: '#dc2626', icon: '▲' };
    if (importance >= 0.8) return { level: 'Advanced', color: '#d97706', icon: '◆' };
    if (importance >= 0.6) return { level: 'Intermediate', color: '#059669', icon: '●' };
    return { level: 'Beginner', color: '#2563eb', icon: '○' };
  };

  const getMotivationalMessage = (skill, importance) => {
    const messages = [
      `Mastering ${skill} will be a game-changer for your career.`,
      `${skill} is your ticket to the next level.`,
      `Focus on ${skill} and watch your opportunities multiply.`,
      `${skill} is exactly what top employers are looking for.`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const difficulty = getDifficultyLevel(recommendation.importance);

  const handleStartLearning = () => {
    try {
      const timeEstimate = getEstimatedTime(learnerProfile?.learningSpeed || 'medium', recommendation.importance);
      const message = `Learning path started for ${recommendation.displayName}!\n\nEstimated time: ${timeEstimate}\nDifficulty: ${difficulty.level}\nImportance: ${Math.round(recommendation.importance * 100)}%`;
      console.log('Start Learning:', { skill: recommendation.displayName, ...recommendation });
      alert(message);
    } catch (error) {
      console.error('Error starting learning:', error);
      alert('Error starting learning path. Please try again.');
    }
  };

  const handleSeeAlternatives = () => {
    try {
      if (!skillGaps || skillGaps.length <= 1) {
        alert('No alternative skills available at this time.');
        return;
      }
      const alternatives = skillGaps.slice(1, 4).map(s => `• ${s.displayName} (${Math.round(s.importance * 100)}% importance)`).join('\n');
      const message = `Alternative skills to consider:\n\n${alternatives}`;
      console.log('See Alternatives:', skillGaps.slice(1, 4));
      alert(message);
    } catch (error) {
      console.error('Error showing alternatives:', error);
      alert('Error loading alternatives. Please try again.');
    }
  };

  return (
    <div className={`recommendation-card ${isVisible ? 'visible' : ''}`} ref={cardRef}>
      <div className="recommendation-header">
        <h3>Next Strategic Move</h3>
        <button 
          className="details-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      <div className="recommendation-main">
        <div className="skill-spotlight">
          <div className="skill-badge">
            <span className="skill-icon">{getSkillIcon(recommendation.displayName)}</span>
            <div className="skill-text">
              <h4 className="recommended-skill">{recommendation.displayName}</h4>
              <p className="skill-subtitle">{difficulty.level} Level • {recommendation.category}</p>
            </div>
            <div className="impact-score">
              <span className="score-number">{Math.round(recommendation.importance * 100)}</span>
              <span className="score-label">Impact</span>
            </div>
          </div>
          
          <div className="motivation-message">
            <p>{getMotivationalMessage(recommendation.displayName, recommendation.importance)}</p>
          </div>
        </div>
        
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-icon">⏱</span>
            <div className="stat-content">
              <span className="stat-value">{getEstimatedTime(learnerProfile?.learningSpeed || 'medium', recommendation.importance)}</span>
              <span className="stat-label">Time to Learn</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">◊</span>
            <div className="stat-content">
              <span className="stat-value">{Math.round(recommendation.confidence * 100)}%</span>
              <span className="stat-label">Confidence</span>
            </div>
          </div>
          
          <div className="stat-item">
            <span className="stat-icon">▲</span>
            <div className="stat-content">
              <span className="stat-value">#1</span>
              <span className="stat-label">Priority</span>
            </div>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="recommendation-details expanded">
          <div className="detail-section">
            <h5>Performance Metrics</h5>
            <div className="metrics-grid">
              <div className="metric-item">
                <span className="metric-label">Career Impact</span>
                <div className="metric-bar">
                  <div 
                    ref={(el) => metricsRef.current[0] = el}
                    className="metric-fill high-impact"
                    data-width={`${recommendation.importance * 100}%`}
                    style={{ width: '0%' }}
                  ></div>
                </div>
                <span className="metric-value">{Math.round(recommendation.importance * 100)}%</span>
              </div>
              
              <div className="metric-item">
                <span className="metric-label">AI Confidence</span>
                <div className="metric-bar">
                  <div 
                    ref={(el) => metricsRef.current[1] = el}
                    className="metric-fill confidence-high"
                    data-width={`${recommendation.confidence * 100}%`}
                    style={{ width: '0%' }}
                  ></div>
                </div>
                <span className="metric-value">{Math.round(recommendation.confidence * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h5>Learning Strategy</h5>
            <div className="strategy-items">
              <div className="strategy-item">
                <span className="strategy-icon">■</span>
                <div className="strategy-content">
                  <strong>Difficulty Level:</strong> {difficulty.level}
                  <p>Based on industry standards and skill complexity</p>
                </div>
              </div>
              
              <div className="strategy-item">
                <span className="strategy-icon">▲</span>
                <div className="strategy-content">
                  <strong>Learning Path:</strong> {learnerProfile?.learningSpeed === 'fast' ? 'Intensive' : learnerProfile?.learningSpeed === 'medium' ? 'Balanced' : 'Steady'}
                  <p>Optimized for your {learnerProfile?.learningSpeed || 'medium'} learning pace</p>
                </div>
              </div>
              
              <div className="strategy-item">
                <span className="strategy-icon">◊</span>
                <div className="strategy-content">
                  <strong>Skill Category:</strong> {recommendation.category}
                  <p>Essential for your target role success</p>
                </div>
              </div>
            </div>
          </div>

          <div className="algorithm-info">
            <div className="algorithm-badge">
              <span className="algo-icon">◊</span>
              <div className="algo-content">
                <strong>Algorithm:</strong> Baseline Importance Ranking
                <p>Next: LinUCB Multi-Armed Bandit for personalized learning</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="recommendation-actions">
        <button 
          className="btn btn-primary action-primary"
          onClick={handleStartLearning}
          type="button"
          title="Start your personalized learning path"
        >
          Start Learning {recommendation.displayName}
        </button>
        <button 
          className="btn btn-secondary action-secondary"
          onClick={handleSeeAlternatives}
          type="button"
          title="View alternative skill recommendations"
        >
          See Alternative Skills
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;