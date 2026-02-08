// Learning Resources Database
export const learningResources = {
  // Programming Languages
  python: {
    courses: [
      { name: 'Python for Everybody', platform: 'Coursera', duration: '8 weeks', level: 'Beginner' },
      { name: 'Complete Python Bootcamp', platform: 'Udemy', duration: '22 hours', level: 'All Levels' },
      { name: 'Python Documentation', platform: 'Official', duration: 'Self-paced', level: 'All Levels' }
    ],
    books: ['Python Crash Course', 'Automate the Boring Stuff with Python'],
    practice: ['LeetCode', 'HackerRank', 'Codewars']
  },
  javascript: {
    courses: [
      // eslint-disable-next-line no-script-url
      { name: 'JavaScript: The Complete Guide', platform: 'Udemy', duration: '52 hours', level: 'All Levels' },
      { name: 'JavaScript Algorithms', platform: 'freeCodeCamp', duration: '300 hours', level: 'Intermediate' },
      { name: 'MDN Web Docs', platform: 'Official', duration: 'Self-paced', level: 'All Levels' }
    ],
    books: ['Eloquent JavaScript', 'You Don\u0027t Know JS'],
    practice: ['JavaScript30', 'Exercism', 'CodePen']
  },
  html: {
    courses: [
      { name: 'HTML & CSS Complete Course', platform: 'freeCodeCamp', duration: '4 hours', level: 'Beginner' },
      { name: 'HTML5 and CSS3 Fundamentals', platform: 'Udemy', duration: '12 hours', level: 'Beginner' },
      { name: 'MDN HTML Documentation', platform: 'Official', duration: 'Self-paced', level: 'All Levels' }
    ],
    books: ['HTML and CSS: Design and Build Websites', 'Learning Web Design'],
    practice: ['Frontend Mentor', 'CodePen', 'CSS Battle']
  },
  css: {
    courses: [
      { name: 'CSS - The Complete Guide', platform: 'Udemy', duration: '23 hours', level: 'All Levels' },
      { name: 'Advanced CSS and Sass', platform: 'Udemy', duration: '28 hours', level: 'Advanced' },
      { name: 'CSS Tricks', platform: 'CSS-Tricks.com', duration: 'Self-paced', level: 'All Levels' }
    ],
    books: ['CSS Secrets', 'CSS: The Definitive Guide'],
    practice: ['CSS Battle', 'Frontend Mentor', 'CodePen']
  },
  react: {
    courses: [
      { name: 'React - The Complete Guide', platform: 'Udemy', duration: '48 hours', level: 'Intermediate' },
      { name: 'React Official Tutorial', platform: 'Official', duration: 'Self-paced', level: 'Beginner' },
      { name: 'Epic React', platform: 'Kent C. Dodds', duration: '12 weeks', level: 'Advanced' }
    ],
    books: ['Learning React', 'React Design Patterns'],
    practice: ['React Challenges', 'Frontend Mentor', 'CodeSandbox']
  },
  'machine learning': {
    courses: [
      { name: 'Machine Learning Specialization', platform: 'Coursera', duration: '3 months', level: 'Intermediate' },
      { name: 'Deep Learning Specialization', platform: 'Coursera', duration: '5 months', level: 'Advanced' },
      { name: 'Fast.ai', platform: 'fast.ai', duration: '7 weeks', level: 'Intermediate' }
    ],
    books: ['Hands-On Machine Learning', 'Pattern Recognition and Machine Learning'],
    practice: ['Kaggle', 'Google Colab', 'Papers with Code']
  },
  docker: {
    courses: [
      { name: 'Docker Mastery', platform: 'Udemy', duration: '19 hours', level: 'All Levels' },
      { name: 'Docker Documentation', platform: 'Official', duration: 'Self-paced', level: 'All Levels' }
    ],
    books: ['Docker Deep Dive', 'Docker in Action'],
    practice: ['Docker Hub', 'Play with Docker', 'Katacoda']
  },
  kubernetes: {
    courses: [
      { name: 'Kubernetes for Developers', platform: 'Linux Foundation', duration: '4 weeks', level: 'Intermediate' },
      { name: 'CKA Certification', platform: 'Linux Foundation', duration: '3 months', level: 'Advanced' }
    ],
    books: ['Kubernetes Up & Running', 'Kubernetes in Action'],
    practice: ['Minikube', 'Kind', 'Kubernetes Playground']
  },
  sql: {
    courses: [
      { name: 'SQL for Data Science', platform: 'Coursera', duration: '4 weeks', level: 'Beginner' },
      { name: 'Complete SQL Bootcamp', platform: 'Udemy', duration: '9 hours', level: 'All Levels' }
    ],
    books: ['SQL Cookbook', 'Learning SQL'],
    practice: ['SQLZoo', 'HackerRank SQL', 'LeetCode Database']
  },
  aws: {
    courses: [
      { name: 'AWS Certified Solutions Architect', platform: 'AWS', duration: '3 months', level: 'Intermediate' },
      { name: 'AWS Fundamentals', platform: 'Coursera', duration: '4 weeks', level: 'Beginner' }
    ],
    books: ['AWS Certified Solutions Architect Study Guide', 'Amazon Web Services in Action'],
    practice: ['AWS Free Tier', 'AWS Labs', 'CloudAcademy']
  }
};

// Get resources for a skill
export const getResourcesForSkill = (skillName) => {
  const skill = skillName.toLowerCase();
  
  // Direct match
  if (learningResources[skill]) {
    return learningResources[skill];
  }
  
  // Check for combined skills (e.g., "Html Css")
  const words = skill.split(/[\s_-]+/);
  const matchedResources = [];
  
  for (const word of words) {
    for (const [key, value] of Object.entries(learningResources)) {
      if (word.includes(key) || key.includes(word)) {
        matchedResources.push(value);
        break;
      }
    }
  }
  
  // If we found resources for combined skills, merge them
  if (matchedResources.length > 0) {
    const merged = {
      courses: [],
      books: [],
      practice: []
    };
    
    matchedResources.forEach(resource => {
      merged.courses.push(...resource.courses);
      merged.books.push(...resource.books);
      merged.practice.push(...resource.practice);
    });
    
    // Remove duplicates
    merged.courses = [...new Set(merged.courses.map(c => JSON.stringify(c)))].map(c => JSON.parse(c));
    merged.books = [...new Set(merged.books)];
    merged.practice = [...new Set(merged.practice)];
    
    return merged;
  }
  
  // Partial match for single word
  for (const [key, value] of Object.entries(learningResources)) {
    if (skill.includes(key) || key.includes(skill)) {
      return value;
    }
  }
  
  // Default resources
  return {
    courses: [
      { name: 'Search on Coursera', platform: 'Coursera', duration: 'Varies', level: 'All Levels' },
      { name: 'Search on Udemy', platform: 'Udemy', duration: 'Varies', level: 'All Levels' },
      { name: 'Official Documentation', platform: 'Official', duration: 'Self-paced', level: 'All Levels' }
    ],
    books: ['Check Amazon for books', 'Check O\'Reilly Media'],
    practice: ['GitHub Projects', 'Personal Projects', 'Open Source Contributions']
  };
};

// Generate learning roadmap
export const generateLearningRoadmap = (skillGaps, learningSpeed) => {
  const speedMultiplier = {
    slow: 1.5,
    medium: 1,
    fast: 0.7
  };
  
  const multiplier = speedMultiplier[learningSpeed] || 1;
  let currentWeek = 0;
  
  return skillGaps.map((skill, index) => {
    const baseWeeks = skill.importance >= 0.8 ? 8 : skill.importance >= 0.6 ? 6 : 4;
    const weeks = Math.ceil(baseWeeks * multiplier);
    
    const roadmapItem = {
      skill: skill.displayName,
      startWeek: currentWeek,
      endWeek: currentWeek + weeks,
      duration: weeks,
      importance: skill.importance,
      phase: index < 3 ? 'Priority' : index < 6 ? 'Secondary' : 'Optional'
    };
    
    currentWeek += weeks;
    return roadmapItem;
  });
};

// Calculate completion percentage
export const calculateProgress = (completedSkills, totalSkills) => {
  if (totalSkills === 0) return 0;
  return Math.round((completedSkills / totalSkills) * 100);
};

// Estimate total learning time
export const estimateTotalTime = (skillGaps, learningSpeed) => {
  const roadmap = generateLearningRoadmap(skillGaps, learningSpeed);
  const totalWeeks = roadmap[roadmap.length - 1]?.endWeek || 0;
  
  const months = Math.floor(totalWeeks / 4);
  const remainingWeeks = totalWeeks % 4;
  
  if (months === 0) {
    return `${totalWeeks} weeks`;
  } else if (remainingWeeks === 0) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  } else {
    return `${months} ${months === 1 ? 'month' : 'months'} ${remainingWeeks} ${remainingWeeks === 1 ? 'week' : 'weeks'}`;
  }
};

// Export analysis as JSON
export const exportAnalysisJSON = (learnerProfile, skillGaps, recommendation) => {
  const data = {
    profile: learnerProfile,
    skillGaps: skillGaps,
    recommendation: recommendation,
    exportDate: new Date().toISOString(),
    totalSkillsToLearn: skillGaps.length,
    estimatedTime: estimateTotalTime(skillGaps, learnerProfile.learningSpeed)
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `career-gap-analysis-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

// Get skill difficulty description
export const getSkillDifficulty = (importance) => {
  if (importance >= 0.9) {
    return {
      level: 'Expert',
      description: 'Requires significant time and advanced understanding',
      estimatedHours: '200-300 hours'
    };
  } else if (importance >= 0.8) {
    return {
      level: 'Advanced',
      description: 'Requires solid foundation and practice',
      estimatedHours: '100-200 hours'
    };
  } else if (importance >= 0.6) {
    return {
      level: 'Intermediate',
      description: 'Moderate complexity with structured learning',
      estimatedHours: '50-100 hours'
    };
  } else {
    return {
      level: 'Beginner',
      description: 'Foundational concepts, easier to grasp',
      estimatedHours: '20-50 hours'
    };
  }
};
