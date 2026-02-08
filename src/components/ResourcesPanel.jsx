import React, { useState } from 'react';
import { getResourcesForSkill } from '../utils/learningResources';

const ResourcesPanel = ({ skill }) => {
  const [activeTab, setActiveTab] = useState('courses');
  
  if (!skill) {
    return (
      <div className="resources-panel empty">
        <p>Select a skill to view learning resources</p>
      </div>
    );
  }

  const resources = getResourcesForSkill(skill.displayName);

  return (
    <div className="resources-panel">
      <div className="resources-header">
        <h4>Learning Resources for {skill.displayName}</h4>
      </div>

      <div className="resources-tabs">
        <button
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          📚 Courses
        </button>
        <button
          className={`tab-button ${activeTab === 'books' ? 'active' : ''}`}
          onClick={() => setActiveTab('books')}
        >
          📖 Books
        </button>
        <button
          className={`tab-button ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          💻 Practice
        </button>
      </div>

      <div className="resources-content">
        {activeTab === 'courses' && (
          <div className="courses-list">
            {resources.courses.map((course, index) => (
              <div key={index} className="resource-card">
                <div className="resource-info">
                  <h5>{course.name}</h5>
                  <span className="resource-platform">{course.platform}</span>
                </div>
                <div className="resource-meta">
                  <span className="resource-duration">⏱️ {course.duration}</span>
                  <span className="resource-level">{course.level}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'books' && (
          <div className="books-list">
            {resources.books.map((book, index) => (
              <div key={index} className="resource-card">
                <span className="book-icon">📖</span>
                <span className="book-title">{book}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="practice-list">
            {resources.practice.map((platform, index) => (
              <div key={index} className="resource-card">
                <span className="practice-icon">💻</span>
                <span className="practice-platform">{platform}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPanel;
