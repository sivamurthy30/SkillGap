import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import LearnerProfile from './components/LearnerProfile';
import SkillGapView from './components/SkillGapView';
import RecommendationCard from './components/RecommendationCard';
import LearningRoadmap from './components/LearningRoadmap';
import ResourcesPanel from './components/ResourcesPanel';
import { recommender } from './utils/baselineRecommender';
import { exportAnalysisJSON } from './utils/learningResources';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(TextPlugin, ScrollTrigger);

function App() {
  const [learnerProfile, setLearnerProfile] = useState(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const titleRef = useRef(null);

  const scrambleText = (element, finalText) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const originalText = finalText;
    let iteration = 0;
    
    gsap.set(element, { textShadow: "0 0 8px rgba(37, 99, 235, 0.3)" });
    
    const interval = setInterval(() => {
      element.textContent = originalText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      
      if (iteration >= originalText.length) {
        clearInterval(interval);
        
        gsap.to(element, { 
          textShadow: "0 0 0px rgba(37, 99, 235, 0)", 
          duration: 0.3,
          onComplete: () => {
            element.innerHTML = 'DEV<sup>A</sup>';
            gsap.fromTo(element, 
              { scale: 1 }, 
              { scale: 1.02, duration: 0.5, yoyo: true, repeat: 1, ease: "power2.inOut" }
            );
          }
        });
      }
      
      iteration += 0.6;
    }, 250);
  };

  useEffect(() => {
    const savedProfile = localStorage.getItem('learnerProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setLearnerProfile(profile);
      updateAnalysis(profile);
    }
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.textContent = "DEVA";
      titleRef.current.style.opacity = "1";
      
      const tl = gsap.timeline();
      
      tl.fromTo(".App-header", 
        { opacity: 0, y: -20 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      )
      .fromTo(".app-subtitle", 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 
        "-=0.4"
      );
      
      setTimeout(() => {
        scrambleText(titleRef.current, "DEVA");
      }, 500);
      
      setTimeout(() => {
        gsap.fromTo(".container", 
          { opacity: 0, y: 30, scale: 0.98 }, 
          { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }
        );
        
        gsap.fromTo([".col-left", ".col-right"], 
          { opacity: 0, x: (index) => index === 0 ? -20 : 20 }, 
          { opacity: 1, x: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.3 }
        );
      }, 1000);
      
      gsap.utils.toArray('.skill-gap-card').forEach((card, index) => {
        gsap.fromTo(card, 
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1, 
            y: 0, 
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
          }
        );
      });
      
      gsap.utils.toArray('.form-control').forEach(input => {
        input.addEventListener('focus', () => {
          gsap.to(input, { scale: 1.02, duration: 0.2, ease: "power2.out" });
        });
        
        input.addEventListener('blur', () => {
          gsap.to(input, { scale: 1, duration: 0.2, ease: "power2.out" });
        });
      });
      
      gsap.utils.toArray('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
          gsap.to(btn, { 
            y: -3, 
            scale: 1.02,
            duration: 0.3, 
            ease: "power2.out",
            boxShadow: "0 10px 25px rgba(71, 85, 105, 0.2)"
          });
        });
        
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { 
            y: 0, 
            scale: 1,
            duration: 0.3, 
            ease: "power2.out",
            boxShadow: "0 4px 6px rgba(71, 85, 105, 0.1)"
          });
        });
        
        btn.addEventListener('mousedown', () => {
          gsap.to(btn, { scale: 0.95, duration: 0.1 });
        });
        
        btn.addEventListener('mouseup', () => {
          gsap.to(btn, { scale: 1.02, duration: 0.1 });
        });
      });
      
      gsap.utils.toArray('.skill-tag').forEach(tag => {
        tag.addEventListener('mouseenter', () => {
          gsap.to(tag, { 
            scale: 1.05, 
            y: -2,
            duration: 0.2, 
            ease: "back.out(1.7)" 
          });
        });
        
        tag.addEventListener('mouseleave', () => {
          gsap.to(tag, { 
            scale: 1, 
            y: 0,
            duration: 0.2, 
            ease: "power2.out" 
          });
        });
      });
    }
  }, []);

  const handleProfileUpdate = (profile) => {
    setIsLoading(true);
    setLearnerProfile(profile);
    
    gsap.to(".col-right", { opacity: 0.6, duration: 0.3 });
    
    setTimeout(() => {
      updateAnalysis(profile);
      setAnimationTrigger(prev => prev + 1);
      setIsLoading(false);
      
      gsap.to(".col-right", { opacity: 1, duration: 0.5 });
      
      gsap.fromTo(".skill-gap-card", 
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.2 }
      );
    }, 500);
  };

  const updateAnalysis = (profile) => {
    try {
      const gaps = recommender.computeSkillGaps(profile);
      setSkillGaps(gaps);

      const rec = recommender.getRecommendation(profile);
      setRecommendation(rec);
      
      // Set first skill as selected by default
      if (gaps.length > 0) {
        setSelectedSkill(gaps[0]);
      }
    } catch (error) {
      console.error('Error updating analysis:', error);
      setSkillGaps([]);
      setRecommendation(null);
      setSelectedSkill(null);
    }
  };

  const handleExportAnalysis = () => {
    if (learnerProfile && skillGaps.length > 0) {
      exportAnalysisJSON(learnerProfile, skillGaps, recommendation);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 ref={titleRef}>DEVA</h1>
      </header>

      <main className="App-main">
        <div className="container">
          <div className="row">
            <div className="col-left">
              <LearnerProfile 
                onProfileUpdate={handleProfileUpdate}
                isLoading={isLoading}
              />
            </div>

            <div className="col-right">
              <div className="analysis-header">
                {learnerProfile && skillGaps.length > 0 && (
                  <button 
                    className="btn btn-secondary export-btn"
                    onClick={handleExportAnalysis}
                    title="Export analysis as JSON"
                  >
                    📥 Export Analysis
                  </button>
                )}
              </div>
              
              <SkillGapView 
                skillGaps={skillGaps} 
                targetRole={learnerProfile?.targetRole}
                learnerProfile={learnerProfile}
                animationTrigger={animationTrigger}
                isLoading={isLoading}
                onSkillSelect={setSelectedSkill}
              />
              
              <RecommendationCard 
                recommendation={recommendation}
                learnerProfile={learnerProfile}
                animationTrigger={animationTrigger}
                isLoading={isLoading}
                skillGaps={skillGaps}
              />
              
              {learnerProfile && skillGaps.length > 0 && (
                <>
                  <LearningRoadmap 
                    skillGaps={skillGaps}
                    learningSpeed={learnerProfile.learningSpeed}
                  />
                  
                  <ResourcesPanel 
                    skill={selectedSkill}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
