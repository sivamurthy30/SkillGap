import rolesData from '../data/rolesSkills.json';

/**
 * Skill matching utility for fuzzy matching user input to known skills
 */
class SkillMatcher {
  constructor() {
    // Create skill aliases and variations
    this.skillAliases = {
      // Programming Languages
      'js': 'javascript',
      'javascript': 'javascript',
      'ts': 'typescript',
      'typescript': 'typescript',
      'py': 'python',
      'python': 'python',
      'java': 'java',
      
      // Databases & SQL
      'sql': 'sql',
      'mysql': 'sql',
      'postgresql': 'sql',
      'postgres': 'sql',
      'sqlite': 'sql',
      'database': 'databases',
      'databases': 'databases',
      'db': 'databases',
      
      // Frontend Technologies
      'react': 'react',
      'reactjs': 'react',
      'react.js': 'react',
      'html': 'html_css',
      'css': 'html_css',
      'html/css': 'html_css',
      'html_css': 'html_css',
      'frontend': 'html_css',
      
      // Backend Technologies
      'node': 'node_js',
      'nodejs': 'node_js',
      'node.js': 'node_js',
      'node_js': 'node_js',
      'django': 'django',
      'flask': 'flask',
      'fastapi': 'fastapi',
      'spring': 'spring_framework',
      'springboot': 'spring_boot',
      'spring boot': 'spring_boot',
      'spring_boot': 'spring_boot',
      
      // Data Science & ML
      'ml': 'machine_learning',
      'machine learning': 'machine_learning',
      'machine_learning': 'machine_learning',
      'ai': 'machine_learning',
      'pandas': 'pandas',
      'sklearn': 'scikit_learn',
      'scikit-learn': 'scikit_learn',
      'scikit_learn': 'scikit_learn',
      'statistics': 'statistics',
      'stats': 'statistics',
      'data viz': 'data_visualization',
      'data visualization': 'data_visualization',
      'data_visualization': 'data_visualization',
      'visualization': 'data_visualization',
      
      // DevOps & Tools
      'docker': 'docker',
      'git': 'git',
      'github': 'git',
      'version control': 'git',
      'kubernetes': 'kubernetes',
      'k8s': 'kubernetes',
      'aws': 'cloud_platforms',
      'azure': 'cloud_platforms',
      'gcp': 'cloud_platforms',
      'cloud': 'cloud_platforms',
      'cloud_platforms': 'cloud_platforms',
      
      // Testing
      'testing': 'testing',
      'test': 'testing',
      'junit': 'junit',
      'unit testing': 'testing',
      
      // Soft Skills
      'communication': 'communication',
      'leadership': 'communication',
      'teamwork': 'communication',
      'project management': 'project_management',
      'project_management': 'project_management',
      'pm': 'project_management',
      
      // Business Skills
      'product strategy': 'product_strategy',
      'product_strategy': 'product_strategy',
      'user research': 'user_research',
      'user_research': 'user_research',
      'market research': 'market_research',
      'market_research': 'market_research',
      'agile': 'agile_methodologies',
      'scrum': 'agile_methodologies',
      'agile_methodologies': 'agile_methodologies',
      
      // Data Engineering
      'spark': 'apache_spark',
      'apache spark': 'apache_spark',
      'apache_spark': 'apache_spark',
      'kafka': 'apache_kafka',
      'apache kafka': 'apache_kafka',
      'apache_kafka': 'apache_kafka',
      'etl': 'etl_pipelines',
      'etl_pipelines': 'etl_pipelines',
      'data warehouse': 'data_warehousing',
      'data_warehousing': 'data_warehousing',
      'airflow': 'airflow',
      'data modeling': 'data_modeling',
      'data_modeling': 'data_modeling',
      
      // System Design & Architecture
      'system design': 'system_design',
      'system_design': 'system_design',
      'architecture': 'system_design',
      'microservices': 'microservices',
      'api': 'api_design',
      'api design': 'api_design',
      'api_design': 'api_design',
      'rest': 'api_design',
      'restful': 'api_design',
      
      // Security
      'security': 'security',
      'cybersecurity': 'security',
      
      // Design
      'responsive': 'responsive_design',
      'responsive design': 'responsive_design',
      'responsive_design': 'responsive_design',
      'ui': 'responsive_design',
      'ux': 'user_research'
    };
  }

  /**
   * Match user input skill to known skills
   * @param {string} userSkill - User entered skill
   * @returns {string|null} Matched skill key or null
   */
  matchSkill(userSkill) {
    const normalized = userSkill.toLowerCase().trim();
    return this.skillAliases[normalized] || null;
  }

  /**
   * Get all possible variations for a skill
   * @param {string} skill - Skill key
   * @returns {Array} Array of variations
   */
  getSkillVariations(skill) {
    return Object.entries(this.skillAliases)
      .filter(([alias, mappedSkill]) => mappedSkill === skill)
      .map(([alias]) => alias);
  }
}

/**
 * Baseline recommendation algorithm - simple importance-based ranking
 * This will be replaced by LinUCB in later iterations
 */
export class BaselineRecommender {
  constructor() {
    this.rolesData = rolesData;
    this.skillMatcher = new SkillMatcher();
  }

  /**
   * Normalize and match user skills to known skills
   * @param {Array} userSkills - Array of user entered skills
   * @returns {Array} Array of matched skill keys
   */
  normalizeUserSkills(userSkills) {
    const matchedSkills = new Set();
    
    userSkills.forEach(userSkill => {
      const matched = this.skillMatcher.matchSkill(userSkill);
      if (matched) {
        matchedSkills.add(matched);
      }
    });
    
    return Array.from(matchedSkills);
  }

  /**
   * Compute skill gaps for a learner profile
   * @param {Object} learnerProfile - { targetRole, knownSkills, learningSpeed }
   * @returns {Array} Array of missing skills with importance scores
   */
  computeSkillGaps(learnerProfile) {
    const { targetRole, knownSkills } = learnerProfile;
    
    if (!this.rolesData.roles[targetRole]) {
      throw new Error(`Role ${targetRole} not found`);
    }

    const requiredSkills = this.rolesData.roles[targetRole].skills;
    const normalizedUserSkills = this.normalizeUserSkills(knownSkills);
    const skillGaps = [];

    // Find missing skills
    Object.entries(requiredSkills).forEach(([skill, details]) => {
      if (!normalizedUserSkills.includes(skill)) {
        skillGaps.push({
          skill,
          importance: details.importance,
          category: details.category,
          displayName: this.formatSkillName(skill)
        });
      }
    });

    // Sort by importance (descending)
    return skillGaps.sort((a, b) => b.importance - a.importance);
  }

  /**
   * Get top recommendation based on importance
   * @param {Object} learnerProfile - Learner context
   * @returns {Object} Top recommended skill
   */
  getRecommendation(learnerProfile) {
    const skillGaps = this.computeSkillGaps(learnerProfile);
    
    if (skillGaps.length === 0) {
      return {
        skill: null,
        message: "You already have all required skills for this role!",
        confidence: 1.0
      };
    }

    const topSkill = skillGaps[0];
    return {
      skill: topSkill.skill,
      displayName: topSkill.displayName,
      importance: topSkill.importance,
      category: topSkill.category,
      confidence: topSkill.importance, // Simple baseline confidence
      message: `Focus on ${topSkill.displayName} - highest impact for ${this.rolesData.roles[learnerProfile.targetRole].name}`
    };
  }

  /**
   * Format skill names for display
   * @param {string} skill - Snake_case skill name
   * @returns {string} Human readable name
   */
  formatSkillName(skill) {
    return skill
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get all available roles
   * @returns {Array} Array of role objects
   */
  getAvailableRoles() {
    return Object.entries(this.rolesData.roles).map(([key, role]) => ({
      id: key,
      name: role.name
    }));
  }

  /**
   * Get matched skills for display (what the user knows)
   * @param {Object} learnerProfile - Learner profile
   * @returns {Array} Array of matched skills with details
   */
  getMatchedSkills(learnerProfile) {
    const { targetRole, knownSkills } = learnerProfile;
    
    if (!this.rolesData.roles[targetRole]) {
      return [];
    }

    const requiredSkills = this.rolesData.roles[targetRole].skills;
    const normalizedUserSkills = this.normalizeUserSkills(knownSkills);
    const matchedSkills = [];

    normalizedUserSkills.forEach(skill => {
      if (requiredSkills[skill]) {
        matchedSkills.push({
          skill,
          displayName: this.formatSkillName(skill),
          importance: requiredSkills[skill].importance,
          category: requiredSkills[skill].category,
          userInput: knownSkills.find(userSkill => 
            this.skillMatcher.matchSkill(userSkill) === skill
          )
        });
      }
    });

    return matchedSkills.sort((a, b) => b.importance - a.importance);
  }

  /**
   * Get skill matching suggestions for user input
   * @param {string} userInput - User's skill input
   * @returns {Object} Matching information
   */
  getSkillMatchInfo(userInput) {
    const matched = this.skillMatcher.matchSkill(userInput);
    if (matched) {
      return {
        matched: true,
        skillKey: matched,
        displayName: this.formatSkillName(matched),
        variations: this.skillMatcher.getSkillVariations(matched)
      };
    }
    return { matched: false };
  }

  /**
   * Get all skills for a role (for UI purposes)
   * @param {string} roleId - Role identifier
   * @returns {Array} Array of skills with details
   */
  getRoleSkills(roleId) {
    if (!this.rolesData.roles[roleId]) return [];
    
    return Object.entries(this.rolesData.roles[roleId].skills).map(([skill, details]) => ({
      skill,
      displayName: this.formatSkillName(skill),
      importance: details.importance,
      category: details.category
    }));
  }
}

// Export singleton instance
export const recommender = new BaselineRecommender();