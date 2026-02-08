import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { recommender } from '../utils/baselineRecommender';

const CustomDropdown = ({ value, onChange, options, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);
  const optionsRef = useRef(null);

  useEffect(() => {
    const selected = options.find(option => option.id === value);
    setSelectedOption(selected);
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (optionsRef.current) {
      if (isOpen) {
        // Add the open class for staggered animations
        optionsRef.current.classList.add('open');
        gsap.fromTo(optionsRef.current, 
          { opacity: 0, y: -15, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.id);
    setIsOpen(false);
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div 
        className={`dropdown-trigger ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
      >
        <span className="dropdown-text">
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <div className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}>▼</div>
      </div>
      
      {isOpen && (
        <div className="dropdown-options" ref={optionsRef}>
          {options.map((option) => (
            <div
              key={option.id}
              className={`dropdown-option ${selectedOption?.id === option.id ? 'selected' : ''}`}
              onClick={() => handleSelect(option)}
            >
              {option.name}
              {selectedOption?.id === option.id && <span className="check-mark">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LearnerProfile = ({ onProfileUpdate, isLoading }) => {
  const [targetRole, setTargetRole] = useState('');
  const [knownSkills, setKnownSkills] = useState([]);
  const [learningSpeed, setLearningSpeed] = useState('medium');
  const [skillInput, setSkillInput] = useState('');
  const completionBarRef = useRef(null);
  const skillsListRef = useRef(null);

  const availableRoles = recommender.getAvailableRoles();

  // Load saved profile on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('learnerProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setTargetRole(profile.targetRole || '');
      setKnownSkills(profile.knownSkills || []);
      setLearningSpeed(profile.learningSpeed || 'medium');
    }
  }, []);

  const handleAddSkill = () => {
    if (skillInput.trim() && !knownSkills.includes(skillInput.trim().toLowerCase())) {
      const newSkills = [...knownSkills, skillInput.trim().toLowerCase()];
      setKnownSkills(newSkills);
      setSkillInput('');
      updateProfile(targetRole, newSkills, learningSpeed);
      
      // Animate new skill tag
      setTimeout(() => {
        const newSkillTag = document.querySelector('.skill-tag:last-child');
        if (newSkillTag) {
          gsap.fromTo(newSkillTag, 
            { opacity: 0, scale: 0.8, y: 10 },
            { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
          );
        }
      }, 50);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const skillTag = document.querySelector(`[data-skill="${skillToRemove}"]`);
    if (skillTag) {
      gsap.to(skillTag, {
        opacity: 0,
        scale: 0.8,
        y: -10,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          const newSkills = knownSkills.filter(skill => skill !== skillToRemove);
          setKnownSkills(newSkills);
          updateProfile(targetRole, newSkills, learningSpeed);
        }
      });
    } else {
      const newSkills = knownSkills.filter(skill => skill !== skillToRemove);
      setKnownSkills(newSkills);
      updateProfile(targetRole, newSkills, learningSpeed);
    }
  };

  const updateProfile = (role, skills, speed) => {
    if (role && onProfileUpdate) {
      const profile = {
        targetRole: role,
        knownSkills: skills,
        learningSpeed: speed
      };
      onProfileUpdate(profile);
      // Save to localStorage
      localStorage.setItem('learnerProfile', JSON.stringify(profile));
    }
  };

  const handleRoleChange = (newRole) => {
    setTargetRole(newRole);
    updateProfile(newRole, knownSkills, learningSpeed);
  };

  const handleSpeedChange = (newSpeed) => {
    setLearningSpeed(newSpeed);
    updateProfile(targetRole, knownSkills, newSpeed);
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    if (targetRole) completed += 50;
    if (knownSkills.length > 0) completed += 50;
    return completed;
  };

  // Animate completion bar with GSAP
  useEffect(() => {
    if (completionBarRef.current) {
      const percentage = getCompletionPercentage();
      gsap.to(completionBarRef.current, {
        width: `${percentage}%`,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRole, knownSkills]);

  return (
    <div className="learner-profile">
      <div className="profile-header">
        <h2>Learning Profile</h2>
      </div>
      
      {/* Target Role Selection */}
      <div className="form-group">
        <label htmlFor="target-role">Target Role</label>
        <CustomDropdown
          value={targetRole}
          onChange={handleRoleChange}
          options={availableRoles}
          placeholder="Select your target role..."
          disabled={isLoading}
        />
      </div>

      {/* Known Skills Input */}
      <div className="form-group">
        <label htmlFor="skills">Current Skills</label>
        <div className="skill-input-container">
          <input
            id="skills"
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
            placeholder="Add your skills (e.g., python, react, leadership)"
            className="form-control"
            disabled={isLoading}
          />
          <button 
            onClick={handleAddSkill} 
            className="btn btn-secondary"
            disabled={!skillInput.trim() || isLoading}
          >
            Add
          </button>
        </div>
        
        {/* Display Known Skills */}
        <div className="skills-list" ref={skillsListRef}>
          {knownSkills.map((skill, index) => (
            <span 
              key={skill} 
              className="skill-tag"
              data-skill={skill}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {skill}
              <button 
                onClick={() => handleRemoveSkill(skill)}
                className="skill-remove"
                title="Remove skill"
                disabled={isLoading}
              >
                ×
              </button>
            </span>
          ))}
          {knownSkills.length === 0 && (
            <div className="empty-skills">
              <span>Start adding your skills to get personalized recommendations</span>
            </div>
          )}
        </div>
      </div>

      {/* Learning Speed */}
      <div className="form-group">
        <label htmlFor="learning-speed">Learning Pace</label>
        <CustomDropdown
          value={learningSpeed}
          onChange={handleSpeedChange}
          options={[
            { id: 'slow', name: 'Steady (1-2 skills per month)' },
            { id: 'medium', name: 'Balanced (2-3 skills per month)' },
            { id: 'fast', name: 'Intensive (3+ skills per month)' }
          ]}
          placeholder="Select learning pace..."
          disabled={isLoading}
        />
      </div>

      {/* Progress Indicator */}
      {targetRole && (
        <div className="profile-progress">
          <h4>Profile Status</h4>
          <div className="progress-item">
            <span className="progress-icon">•</span>
            <span className="progress-text">Role Selected</span>
            <span className="progress-check">✓</span>
          </div>
          <div className="progress-item">
            <span className="progress-icon">•</span>
            <span className="progress-text">{knownSkills.length} Skills Added</span>
            <span className="progress-check">{knownSkills.length > 0 ? '✓' : '○'}</span>
          </div>
          <div className="progress-item">
            <span className="progress-icon">•</span>
            <span className="progress-text">Pace Configured</span>
            <span className="progress-check">✓</span>
          </div>
          
          {isLoading && (
            <div className="processing-indicator">
              <div className="processing-animation">
                <div className="processing-dot"></div>
                <div className="processing-dot"></div>
                <div className="processing-dot"></div>
              </div>
              <span>Processing your profile...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LearnerProfile;