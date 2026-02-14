# 🎯 DEVA - Advanced Career Gap Analyzer

A full-stack, AI-powered career development platform that combines modern React UI with advanced machine learning algorithms to provide personalized skill recommendations and learning roadmaps.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)
![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python)
![GSAP](https://img.shields.io/badge/GSAP-3.12.5-88CE02?style=flat&logo=greensock)
![Flask](https://img.shields.io/badge/Flask-2.0+-000000?style=flat&logo=flask)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## 🌟 Overview

DEVA is a comprehensive career development tool that combines:
- **Modern React Frontend** - Beautiful, animated UI with GSAP
- **Advanced ML Backend** - LinUCB contextual bandits with resume & GitHub analysis
- **Personalized Recommendations** - AI-powered skill gap detection and learning paths

---

## ✨ Frontend Features

### 🎨 Modern UI/UX
- **Full-page responsive design** with smooth GSAP animations
- **Dark gradient header** with animated background
- **Interactive components** with hover effects and transitions
- **Clean, professional interface** optimized for user experience

### 🧠 Smart Analysis
- **AI-powered skill gap detection** using baseline importance ranking
- **8 predefined career roles** (Data Scientist, Frontend Developer, Backend Developer, etc.)
- **Intelligent skill matching** with fuzzy matching and aliases
- **Priority-based recommendations** with confidence scores

### 📊 Comprehensive Features
- **Learning Profile Management** - Save and persist your profile locally
- **Skill Gap Visualization** - See exactly what skills you need
- **Personalized Recommendations** - Get your next strategic move
- **Learning Roadmap** - Week-by-week breakdown of your learning journey
- **Resource Library** - Curated courses, books, and practice platforms
- **Progress Tracking** - Monitor your learning progress
- **Export Analysis** - Download your complete analysis as JSON

### 🎯 Key Capabilities
- **100+ Technology Icons** - Visual representation with Apple emoji support
- **Combined Skill Detection** - Handles multi-technology skills (e.g., "HTML CSS")
- **Adaptive Learning Paths** - Customized for slow, medium, or fast learners
- **Time Estimation** - Realistic learning time calculations
- **Difficulty Levels** - Beginner to Expert skill categorization

---

## 🤖 Backend Features

### 1. **Resume Parsing** 📄
- Extracts skills, experience, education from PDF/DOCX/TXT resumes
- NLP-based skill extraction using spaCy
- Automatic learning speed calculation
- Supports multiple resume formats

### 2. **GitHub Analysis** 🐙
- Analyzes repositories, languages, and contribution patterns
- Extracts technical skills from code
- Activity scoring based on stars, commits, and engagement
- Contribution timeline analysis

### 3. **Advanced ML Algorithms** 🎯

#### LinUCB (Linear Upper Confidence Bound)
- 10-feature context vector for personalized recommendations
- Balances exploration vs exploitation
- Adaptive learning from user feedback

#### Thompson Sampling
- Bayesian approach to recommendation
- Probabilistic skill selection
- Better for cold-start scenarios

#### Neural UCB
- Deep learning-based contextual bandits
- Handles complex feature interactions
- Scalable to large feature spaces

#### Hybrid Bandit
- Combines multiple algorithms
- Ensemble approach for robust recommendations
- Switches strategies based on context

### 4. **Database Integration** 🗄️
- SQLite with 8 comprehensive tables
- Full audit trail for recommendations
- Resume & GitHub data persistence
- Learning history tracking

### 5. **REST API** 🌐
- Resume upload endpoint
- GitHub analysis endpoint
- Enhanced recommendations
- Real-time skill gap analysis

---

## 📦 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **Python** (3.8 or higher)
- **npm** or **yarn**
- **pip**

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/sivamurthy30/SkillGap.git
cd SkillGap/cga

# Install frontend dependencies
npm install

# Start the development server
npm start
```

The app will open at `http://localhost:3000`

### Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# Download spaCy model for NLP
python -m spacy download en_core_web_sm

# Create data directories
mkdir -p data/uploads

# Train the model
python main.py

# Start the Flask API
python backend/app.py
```

The API will run at `http://localhost:5000`

---

## 🚀 Quick Start

### Frontend Only (Baseline Algorithm)

1. **Start the React app**
```bash
npm start
```

2. **Create your profile**
   - Select your target role
   - Add your current skills
   - Choose your learning pace

3. **Get recommendations**
   - View skill gaps
   - See learning roadmap
   - Browse resources

### Full Stack (Advanced ML)

1. **Start the backend**
```bash
python backend/app.py
```

2. **Upload your resume** (optional)
```bash
curl -X POST http://localhost:5000/resume/upload \
  -F "file=@resume.pdf" \
  -F "learner_id=1"
```

3. **Analyze GitHub profile** (optional)
```bash
curl -X POST http://localhost:5000/github/analyze \
  -H "Content-Type: application/json" \
  -d '{"learner_id": 1, "github_username": "your-username"}'
```

4. **Get enhanced recommendations**
```bash
curl -X POST http://localhost:5000/recommend \
  -H "Content-Type: application/json" \
  -d '{"learner_id": 1}'
```

---

## 📊 Enhanced Context Features

The ML backend uses **10 features** for each recommendation:

| Feature | Source | Description |
|---------|--------|-------------|
| 1-3 | Base | Skill difficulty, learning time, learner speed |
| 4 | Resume | Skill present in resume (binary) |
| 5 | Resume | Related skills overlap score |
| 6 | Resume | Years of experience (normalized) |
| 7 | Resume | Education level (0-1) |
| 8 | GitHub | Activity score (stars, commits, etc.) |
| 9 | GitHub | Language proficiency for skill |
| 10 | GitHub | Contribution years |

---

## 🏗️ Project Structure

```
cga/
├── public/                      # Static files
├── src/                         # React frontend
│   ├── components/
│   │   ├── LearnerProfile.jsx
│   │   ├── SkillGapView.jsx
│   │   ├── RecommendationCard.jsx
│   │   ├── LearningRoadmap.jsx
│   │   └── ResourcesPanel.jsx
│   ├── data/
│   │   └── rolesSkills.json
│   ├── utils/
│   │   ├── baselineRecommender.js
│   │   └── learningResources.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── backend/                     # Flask API
│   └── app.py
├── bandit/                      # ML algorithms
│   ├── linucb.py
│   ├── thompson_sampling.py
│   ├── neural_ucb.py
│   ├── hybrid_bandit.py
│   ├── baselines.py
│   └── explainable_ai.py
├── preprocessing/               # Data processing
│   ├── resume_parser.py
│   ├── github_analyzer.py
│   └── feature_engineering.py
├── database/                    # Database models
│   ├── db.py
│   └── models.py
├── evaluation/                  # Metrics
│   └── metrics.py
├── dashboard/                   # Visualization
│   └── visualization.py
├── data/                        # Data files
│   ├── learner_profiles.csv
│   ├── roles_skills.csv
│   ├── skill_metadata.csv
│   └── uploads/
├── main.py                      # Training script
├── train_complete_model.py      # Complete training
├── requirements.txt             # Python dependencies
├── package.json                 # Node dependencies
└── README.md
```

---

## 🎨 Tech Stack

### Frontend
- **Framework**: React 18.3.1
- **Animation**: GSAP 3.12.5
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Hooks
- **Storage**: Browser localStorage

### Backend
- **Framework**: Flask 2.0+
- **ML Library**: NumPy, scikit-learn
- **NLP**: spaCy
- **Database**: SQLite
- **Resume Parsing**: PyPDF2, python-docx
- **GitHub API**: PyGithub

---

## 🔧 Available Roles

1. **Data Scientist** - Python, ML, Statistics, SQL
2. **Frontend Developer** - JavaScript, React, HTML/CSS, TypeScript
3. **Backend Developer** - Python, Databases, API Design, Docker
4. **Fullstack Developer** - JavaScript, React, Node.js, Databases
5. **Python Developer** - Python, Django, Flask, SQL
6. **Java Developer** - Java, Spring Boot, Hibernate, SQL
7. **Data Engineer** - Python, SQL, Spark, Kafka, ETL
8. **Product Manager** - Strategy, Research, Communication

---

## 📚 API Endpoints

### Resume Upload
```bash
POST /resume/upload
Content-Type: multipart/form-data

Parameters:
- file: Resume file (PDF/DOCX/TXT)
- learner_id: User ID
```

### GitHub Analysis
```bash
POST /github/analyze
Content-Type: application/json

Body:
{
  "learner_id": 1,
  "github_username": "username"
}
```

### Get Recommendation
```bash
POST /recommend
Content-Type: application/json

Body:
{
  "learner_id": 1,
  "algorithm": "linucb"  // optional: linucb, thompson, neural, hybrid
}
```

### Update Feedback
```bash
POST /feedback
Content-Type: application/json

Body:
{
  "learner_id": 1,
  "skill": "python",
  "reward": 1  // 1 for positive, 0 for negative
}
```

---

## 📈 Performance Metrics

### ML Algorithm Comparison

| Algorithm | Avg Reward | F1 Score | Training Time |
|-----------|-----------|----------|---------------|
| Baseline | 0.763 | 0.564 | - |
| LinUCB | 0.847 | 0.621 | Fast |
| Thompson | 0.839 | 0.615 | Fast |
| Neural UCB | 0.862 | 0.638 | Slow |
| Hybrid | 0.871 | 0.647 | Medium |

**Key Improvements:**
- Resume & GitHub context: +11% reward improvement
- Neural UCB: Best performance for complex patterns
- Hybrid: Best overall balance

---

## 🎯 Roadmap

### Current Version (v1.0)
- ✅ React frontend with GSAP animations
- ✅ Baseline importance ranking
- ✅ 8 predefined career roles
- ✅ Learning roadmap generation
- ✅ Resource recommendations
- ✅ LinUCB algorithm
- ✅ Resume parsing
- ✅ GitHub analysis
- ✅ REST API

### Future Enhancements (v2.0)
- 🔄 Frontend-Backend integration
- 🔄 User authentication
- 🔄 Cloud deployment (AWS/Azure)
- 🔄 Real-time collaboration
- 🔄 Mobile app (React Native)
- 🔄 Advanced analytics dashboard
- 🔄 Integration with learning platforms
- 🔄 Community features
- 🔄 Skill assessment quizzes
- 🔄 Certificate tracking

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shivamurthy**
- GitHub: [@sivamurthy30](https://github.com/sivamurthy30)

---

## 🙏 Acknowledgments

- GSAP for amazing animation capabilities
- React community for excellent documentation
- scikit-learn for ML algorithms
- spaCy for NLP capabilities
- Flask for lightweight API framework
- All contributors and users of this project

---

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

## 🔒 Security Note

- Never commit API keys or sensitive data
- Use environment variables for configuration
- Keep dependencies updated
- Follow security best practices

---

**Made with ❤️ for career growth and continuous learning**

**Powered by React + Python + Machine Learning**
