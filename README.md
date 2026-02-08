# 🎯 DEVA - Career Gap Analyzer

A modern, AI-powered career development tool that helps professionals identify skill gaps and create personalized learning roadmaps to achieve their career goals.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react)
![GSAP](https://img.shields.io/badge/GSAP-3.12.5-88CE02?style=flat&logo=greensock)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## ✨ Features

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

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sivamurthy30/SkillGap.git
cd SkillGap/cga
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Open your browser**
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `build/` directory.

## 📖 How to Use

### 1. Create Your Profile
- Select your **target role** from the dropdown
- Add your **current skills** (e.g., python, react, sql)
- Choose your **learning pace** (slow, medium, or fast)

### 2. Analyze Your Gaps
- View your **skill gaps** ranked by importance
- See **matched skills** you already have
- Get **insights** on critical priorities

### 3. Get Recommendations
- Receive your **top strategic move**
- View **performance metrics** and confidence scores
- See **estimated learning time** and difficulty level

### 4. Plan Your Journey
- Explore the **learning roadmap** with week-by-week breakdown
- Browse **curated resources** (courses, books, practice platforms)
- **Export your analysis** for future reference

## 🏗️ Project Structure

```
cga/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── LearnerProfile.jsx      # Profile input and management
│   │   ├── SkillGapView.jsx        # Skill gap visualization
│   │   ├── RecommendationCard.jsx  # AI recommendations
│   │   ├── LearningRoadmap.jsx     # Timeline view
│   │   └── ResourcesPanel.jsx      # Learning resources
│   ├── data/
│   │   └── rolesSkills.json        # Role definitions and skills
│   ├── utils/
│   │   ├── baselineRecommender.js  # Recommendation algorithm
│   │   └── learningResources.js    # Resource database
│   ├── App.js                      # Main application
│   ├── App.css                     # Styles
│   └── index.js                    # Entry point
├── package.json
└── README.md
```

## 🎨 Tech Stack

- **Frontend Framework**: React 18.3.1
- **Animation Library**: GSAP 3.12.5
- **Styling**: Custom CSS with CSS Variables
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Local Storage**: Browser localStorage for persistence
- **Build Tool**: Create React App

## 🔧 Available Roles

1. **Data Scientist** - Python, ML, Statistics, SQL
2. **Frontend Developer** - JavaScript, React, HTML/CSS, TypeScript
3. **Backend Developer** - Python, Databases, API Design, Docker
4. **Fullstack Developer** - JavaScript, React, Node.js, Databases
5. **Python Developer** - Python, Django, Flask, SQL
6. **Java Developer** - Java, Spring Boot, Hibernate, SQL
7. **Data Engineer** - Python, SQL, Spark, Kafka, ETL
8. **Product Manager** - Strategy, Research, Communication

## 📚 Learning Resources

The app includes curated resources for:
- **Programming Languages**: Python, JavaScript, Java, etc.
- **Web Technologies**: React, HTML/CSS, Node.js
- **Databases**: SQL, MongoDB, PostgreSQL
- **Cloud & DevOps**: AWS, Docker, Kubernetes
- **Data Science & AI**: Machine Learning, TensorFlow, PyTorch

## 🎯 Roadmap

### Current Version (v1.0)
- ✅ Baseline importance ranking algorithm
- ✅ 8 predefined career roles
- ✅ Learning roadmap generation
- ✅ Resource recommendations
- ✅ Export functionality

### Future Enhancements
- 🔄 LinUCB Multi-Armed Bandit algorithm for personalized learning
- 🔄 User authentication and cloud sync
- 🔄 Progress tracking with completion status
- 🔄 Community-contributed resources
- 🔄 Integration with learning platforms (Coursera, Udemy)
- 🔄 Mobile app version
- 🔄 AI-powered skill assessment quizzes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Shivamurthy**
- GitHub: [@sivamurthy30](https://github.com/sivamurthy30)

## 🙏 Acknowledgments

- GSAP for amazing animation capabilities
- React community for excellent documentation
- All contributors and users of this project

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for career growth and continuous learning**
