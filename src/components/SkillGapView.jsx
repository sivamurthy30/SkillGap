import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { recommender } from '../utils/baselineRecommender';

const SkillGapView = ({ skillGaps, targetRole, learnerProfile, onSkillSelect }) => {
  const [animatedBars, setAnimatedBars] = useState(false);
  const [matchedSkills, setMatchedSkills] = useState([]);
  const importanceBarsRef = useRef([]);

  useEffect(() => {
    if (learnerProfile && targetRole) {
      const matched = recommender.getMatchedSkills(learnerProfile);
      setMatchedSkills(matched);
    }
  }, [learnerProfile, targetRole]);

  useEffect(() => {
    if (skillGaps && skillGaps.length > 0) {
      // Animate skill cards
      gsap.fromTo('.skill-gap-card', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      );

      // Animate importance bars
      setTimeout(() => {
        importanceBarsRef.current.forEach((bar, index) => {
          if (bar) {
            const importance = skillGaps[index]?.importance || 0;
            gsap.to(bar, {
              width: `${importance * 100}%`,
              duration: 1.2,
              delay: index * 0.15,
              ease: 'power2.out'
            });
          }
        });
        setAnimatedBars(true);
      }, 300);
    }
  }, [skillGaps]);

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
    if (skill.includes('r ') || skill === 'r') icons.push('📊');
    if (skill.includes('perl')) icons.push('🐪');
    if (skill.includes('shell') || skill.includes('bash')) icons.push('💻');
    
    // Web Technologies & Frameworks
    if (skill.includes('html')) icons.push('🌐');
    if (skill.includes('css') || skill.includes('sass') || skill.includes('scss')) icons.push('🎨');
    if (skill.includes('react')) icons.push('⚛️');
    if (skill.includes('vue')) icons.push('🟢');
    if (skill.includes('angular')) icons.push('🔺');
    if (skill.includes('node')) icons.push('🟩');
    if (skill.includes('express')) icons.push('🚂');
    if (skill.includes('next')) icons.push('▲');
    if (skill.includes('svelte')) icons.push('🧡');
    if (skill.includes('django')) icons.push('🎸');
    if (skill.includes('flask')) icons.push('🧪');
    if (skill.includes('spring')) icons.push('🍃');
    if (skill.includes('laravel')) icons.push('🔶');
    if (skill.includes('rails')) icons.push('🛤️');
    if (skill.includes('asp.net') || skill.includes('dotnet')) icons.push('🔵');
    
    // Databases
    if (skill.includes('mysql')) icons.push('🐬');
    if (skill.includes('postgresql') || skill.includes('postgres')) icons.push('🐘');
    if (skill.includes('mongodb')) icons.push('🍃');
    if (skill.includes('redis')) icons.push('🔴');
    if (skill.includes('sqlite')) icons.push('💾');
    if (skill.includes('oracle')) icons.push('🔶');
    if (skill.includes('cassandra')) icons.push('💿');
    if (skill.includes('elasticsearch')) icons.push('🔍');
    if (skill.includes('sql') && icons.length === 0) icons.push('🗄️');
    if (skill.includes('database') && icons.length === 0) icons.push('🗄️');
    
    // Cloud & Infrastructure
    if (skill.includes('aws')) icons.push('☁️');
    if (skill.includes('azure')) icons.push('🔷');
    if (skill.includes('gcp') || skill.includes('google cloud')) icons.push('🌥️');
    if (skill.includes('heroku')) icons.push('🟣');
    if (skill.includes('digitalocean')) icons.push('🌊');
    if (skill.includes('cloud') && icons.length === 0) icons.push('☁️');
    
    // DevOps & Tools
    if (skill.includes('docker')) icons.push('🐳');
    if (skill.includes('kubernetes') || skill.includes('k8s')) icons.push('☸️');
    if (skill.includes('jenkins')) icons.push('🔧');
    if (skill.includes('gitlab')) icons.push('🦊');
    if (skill.includes('github')) icons.push('🐙');
    if (skill.includes('git') && icons.length === 0) icons.push('📦');
    if (skill.includes('ci/cd') || skill.includes('cicd')) icons.push('🔄');
    if (skill.includes('terraform')) icons.push('🟣');
    if (skill.includes('ansible')) icons.push('🔴');
    if (skill.includes('vagrant')) icons.push('📦');
    
    // Data Science & AI
    if (skill.includes('machine learning') || skill.includes('ml')) icons.push('🤖');
    if (skill.includes('deep learning') || skill.includes('dl')) icons.push('🧠');
    if (skill.includes('ai') || skill.includes('artificial intelligence')) icons.push('🤖');
    if (skill.includes('data science')) icons.push('📊');
    if (skill.includes('analytics')) icons.push('📈');
    if (skill.includes('tensorflow')) icons.push('🟠');
    if (skill.includes('pytorch')) icons.push('🔥');
    if (skill.includes('pandas')) icons.push('🐼');
    if (skill.includes('numpy')) icons.push('🔢');
    if (skill.includes('scikit')) icons.push('🔬');
    if (skill.includes('jupyter')) icons.push('📓');
    
    // Testing & Quality
    if (skill.includes('jest')) icons.push('🃏');
    if (skill.includes('mocha')) icons.push('☕');
    if (skill.includes('selenium')) icons.push('🌐');
    if (skill.includes('cypress')) icons.push('🌲');
    if (skill.includes('pytest')) icons.push('🧪');
    if (skill.includes('junit')) icons.push('☕');
    if (skill.includes('test') && icons.length === 0) icons.push('✅');
    if (skill.includes('qa') || skill.includes('quality')) icons.push('✔️');
    
    // Design & UX
    if (skill.includes('figma')) icons.push('🎨');
    if (skill.includes('sketch')) icons.push('💎');
    if (skill.includes('adobe')) icons.push('🅰️');
    if (skill.includes('photoshop')) icons.push('🖼️');
    if (skill.includes('illustrator')) icons.push('✏️');
    if (skill.includes('ui') || skill.includes('ux')) icons.push('🎨');
    if (skill.includes('design') && icons.length === 0) icons.push('🎨');
    
    // Mobile Development
    if (skill.includes('ios')) icons.push('📱');
    if (skill.includes('android')) icons.push('🤖');
    if (skill.includes('flutter')) icons.push('🦋');
    if (skill.includes('react native')) icons.push('📱');
    if (skill.includes('xamarin')) icons.push('📱');
    if (skill.includes('ionic')) icons.push('⚡');
    
    // Security
    if (skill.includes('security')) icons.push('🔒');
    if (skill.includes('encryption')) icons.push('🔐');
    if (skill.includes('penetration')) icons.push('🛡️');
    if (skill.includes('firewall')) icons.push('🔥');
    
    // Soft Skills & Methodologies
    if (skill.includes('communication')) icons.push('💬');
    if (skill.includes('leadership')) icons.push('👥');
    if (skill.includes('agile')) icons.push('🔄');
    if (skill.includes('scrum')) icons.push('🏉');
    if (skill.includes('kanban')) icons.push('📋');
    if (skill.includes('problem solving')) icons.push('🧩');
    if (skill.includes('teamwork') || skill.includes('collaboration')) icons.push('🤝');
    if (skill.includes('management')) icons.push('📊');
    if (skill.includes('presentation')) icons.push('📊');
    
    // APIs & Integration
    if (skill.includes('rest') || skill.includes('api')) icons.push('🔌');
    if (skill.includes('graphql')) icons.push('◼️');
    if (skill.includes('soap')) icons.push('🧼');
    if (skill.includes('webhook')) icons.push('🪝');
    
    // Version Control & Collaboration
    if (skill.includes('version control') && icons.length === 0) icons.push('📚');
    if (skill.includes('jira')) icons.push('📋');
    if (skill.includes('confluence')) icons.push('📄');
    if (skill.includes('slack')) icons.push('💬');
    
    // Default by category if no icons found
    if (icons.length === 0) {
      if (skill.includes('programming')) return '💻';
      if (skill.includes('technical')) return '⚙️';
      if (skill.includes('business')) return '💼';
      if (skill.includes('soft')) return '💡';
      return '🔧';
    }
    
    return icons.join(' ');
  };

  if (!skillGaps || skillGaps.length === 0) {
    return (
      <div className="skill-gap-view">
        <h3>Skill Gap Analysis</h3>
        <div className="no-gaps">
          {targetRole ? (
            <div className="success-state">
              <div className="success-icon">✓</div>
              <h4>Excellent Progress!</h4>
              <p>You have all the required skills for this role. You're ready to apply!</p>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">○</div>
              <h4>Ready to Start?</h4>
              <p>Select your target role to discover which skills you need to develop.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const getImportanceColor = (importance) => {
    if (importance >= 0.8) return 'high-importance';
    if (importance >= 0.6) return 'medium-importance';
    return 'low-importance';
  };

  const getPriorityLabel = (index, importance) => {
    if (index === 0) return 'CRITICAL';
    if (importance >= 0.8) return 'HIGH';
    if (importance >= 0.6) return 'MEDIUM';
    return 'LOW';
  };

  const getSkillInsights = () => {
    const criticalSkills = skillGaps.filter(gap => gap.importance >= 0.8);
    const categories = [...new Set(skillGaps.slice(0, 3).map(gap => gap.category))];
    const avgImportance = skillGaps.reduce((sum, gap) => sum + gap.importance, 0) / skillGaps.length;
    
    return { criticalSkills, categories, avgImportance };
  };

  const { criticalSkills, categories, avgImportance } = getSkillInsights();

  return (
    <div className="skill-gap-view">
      <h3>Skill Gap Analysis</h3>
      
      {/* Show matched skills if any */}
      {matchedSkills.length > 0 && (
        <div className="matched-skills-section">
          <h4>✓ Skills You Already Have</h4>
          <div className="matched-skills-grid">
            {matchedSkills.map((skill) => (
              <div key={skill.skill} className="matched-skill-card">
                <div className="matched-skill-header">
                  <span className="skill-icon">{getSkillIcon(skill.displayName)}</span>
                  <div className="skill-info">
                    <h5 className="skill-name">{skill.displayName}</h5>
                    <span className="skill-input">"{skill.userInput}"</span>
                  </div>
                  <div className="skill-importance">
                    <span className="importance-score">{Math.round(skill.importance * 100)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="gap-summary">
        <div className="summary-content">
          <div className="summary-stat">
            <span className="stat-number">{skillGaps.length}</span>
            <span className="stat-label">Skills to Learn</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">{matchedSkills.length}</span>
            <span className="stat-label">Skills You Have</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">{criticalSkills.length}</span>
            <span className="stat-label">Critical Priority</span>
          </div>
          <div className="summary-stat">
            <span className="stat-number">{Math.round(avgImportance * 100)}%</span>
            <span className="stat-label">Avg Importance</span>
          </div>
        </div>
        <p className="summary-text">
          {matchedSkills.length > 0 
            ? `Great! You already have ${matchedSkills.length} required skills. Focus on the top ${Math.min(3, skillGaps.length)} remaining skills.`
            : `Focus on the top ${Math.min(3, skillGaps.length)} skills for maximum career impact`
          }
        </p>
      </div>
      
      <div className="skills-grid">
        {skillGaps.map((gap, index) => (
          <div 
            key={gap.skill} 
            className={`skill-gap-card ${getImportanceColor(gap.importance)}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onSkillSelect && onSkillSelect(gap)}
          >
            <div className="skill-header">
              <span className="skill-icon">{getSkillIcon(gap.displayName)}</span>
              <div className="skill-info">
                <h4 className="skill-name">{gap.displayName}</h4>
                <span className="skill-category">{gap.category}</span>
              </div>
              <div className="skill-priority">
                <span className="priority-label">{getPriorityLabel(index, gap.importance)}</span>
                <span className="skill-rank">#{index + 1}</span>
              </div>
            </div>
            
            <div className="skill-details">
              <div className="importance-container">
                <div className="importance-bar">
                  <div 
                    ref={(el) => importanceBarsRef.current[index] = el}
                    className={`importance-fill ${animatedBars ? 'animated' : ''}`}
                    style={{ width: '0%' }}
                  ></div>
                </div>
                <div className="importance-details">
                  <span className="importance-score">
                    {Math.round(gap.importance * 100)}% Impact
                  </span>
                  <span className="importance-description">
                    {gap.importance >= 0.9 ? 'Essential' :
                     gap.importance >= 0.8 ? 'Very Important' :
                     gap.importance >= 0.6 ? 'Important' : 'Nice to Have'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="gap-insights">
        <h4>Key Insights</h4>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-icon">▲</div>
            <div className="insight-content">
              <h5>Top Priority</h5>
              <p><strong>{skillGaps[0]?.displayName}</strong> - {Math.round(skillGaps[0]?.importance * 100)}% importance</p>
            </div>
          </div>
          
          {criticalSkills.length > 1 && (
            <div className="insight-card">
              <div className="insight-icon">!</div>
              <div className="insight-content">
                <h5>Critical Skills</h5>
                <p><strong>{criticalSkills.length}</strong> skills with 80%+ importance need immediate attention</p>
              </div>
            </div>
          )}
          
          <div className="insight-card">
            <div className="insight-icon">◊</div>
            <div className="insight-content">
              <h5>Focus Areas</h5>
              <p>Concentrate on <strong>{categories.join(', ')}</strong> skills first</p>
            </div>
          </div>
          
          <div className="insight-card">
            <div className="insight-icon">↗</div>
            <div className="insight-content">
              <h5>Learning Path</h5>
              <p>Master top 3 skills to become <strong>70% more competitive</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapView;