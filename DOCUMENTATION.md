# 📰 NewsMania - Complete Project Documentation

## 📑 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Tech Stack](#architecture--tech-stack)
3. [Features Overview](#features-overview)
4. [Project Structure](#project-structure)
5. [Core Modules](#core-modules)
6. [API Integration](#api-integration)
7. [Database & Authentication](#database--authentication)
8. [Setup & Installation](#setup--installation)
9. [Environment Configuration](#environment-configuration)
10. [Features Deep Dive](#features-deep-dive)
11. [UI/UX Components](#uiux-components)
12. [Internationalization](#internationalization)
13. [Deployment Guide](#deployment-guide)
14. [Contact Information](#contact-information)

---

## 🎯 Project Overview

**NewsMania** is a modern, AI-powered multi-perspective news aggregation platform that provides balanced, credible news insights from various sources. The platform leverages cutting-edge technologies to deliver personalized news experiences with advanced features like AI-powered summaries, sentiment analysis, multi-language support, and interactive discussions.

### Key Highlights
- 🤖 **AI-Powered Summaries** using Google Gemini
- 📊 **Sentiment Analysis** on news articles
- 🌍 **Multi-language Support** (10+ languages)
- 🔥 **Real-time Trending News**
- 💬 **Community Discussions**
- 📖 **Reading List & Bookmarks**
- 🎯 **Personalized News Feed**
- 🔐 **Secure Authentication** with Firebase

---

## 🏗️ Architecture & Tech Stack

### Frontend Architecture

```
┌─────────────────────────────────────────────────┐
│                  User Interface                  │
│         (React 18 + Vite + Tailwind CSS)        │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
┌───────▼────────┐   ┌────────▼─────────┐
│  State Mgmt    │   │   Routing        │
│  (Context API) │   │  (React Router)  │
└───────┬────────┘   └────────┬─────────┘
        │                     │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │   Service Layer      │
        │  (API Integrations)  │
        └──────────┬──────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼────┐  ┌──────▼─────┐  ┌────▼─────┐
│NewsAPI │  │Google      │  │Firebase  │
│        │  │Gemini AI   │  │Services  │
└────────┘  └────────────┘  └──────────┘
```

### Technology Stack

#### Core Technologies
- **Framework:** React 18.3.1
- **Build Tool:** Vite 8.2.2
- **Language:** JavaScript (ES6+)
- **Styling:** Tailwind CSS 4.1.4
- **Animations:** Framer Motion 12.7.4

#### Key Libraries & Dependencies

**UI Components:**
- `@radix-ui/*` - Accessible UI components
- `lucide-react` - Icon library
- `react-icons` - Additional icons
- `@fortawesome/*` - Font Awesome icons

**AI & APIs:**
- `@google/generative-ai` - Google Gemini AI integration
- `axios` - HTTP client
- `openai` - OpenAI API integration

**Firebase Services:**
- `firebase` 11.6.0 - Complete Firebase SDK
  - Authentication
  - Firestore Database
  - Cloud Storage
  - Analytics

**State Management & Routing:**
- `react-router-dom` 7.5.1 - Client-side routing
- React Context API - Global state management

**Internationalization:**
- `i18next` 24.2.3 - Internationalization framework
- `react-i18next` 15.4.1 - React bindings for i18next
- `i18next-browser-languagedetector` - Auto language detection

**Additional Features:**
- `sentiment` - Sentiment analysis
- `react-confetti` - Celebration effects
- `react-hot-toast` / `sonner` - Toast notifications
- `swr` - Data fetching & caching

---

## ✨ Features Overview

### 1. 🏠 Home Page
- Hero section with search functionality
- Featured news cards
- Category-based news filtering
- Trending topics showcase
- Achievements display

### 2. 📰 News Aggregation
- Multi-source news fetching from NewsAPI
- Trusted source prioritization system (5-tier)
- Real-time news updates
- Article categorization (Politics, Technology, Climate, Health, Economy, Sports)

### 3. 🤖 AI-Powered Features
- **Smart Summaries:** AI-generated article summaries
- **Key Points Extraction:** Bullet-point highlights
- **Sentiment Analysis:** Positive/Negative/Neutral classification
- **Impact Analysis:** Long-term implications assessment
- **Related Topics:** AI-suggested related articles
- **Ask AI:** Interactive Q&A about articles

### 4. 🔥 Trending News
- Real-time trending topics
- Popularity-based sorting
- Category-wise trending
- Share count tracking

### 5. 📚 Categories
Organized news by categories:
- **Politics** - Government, elections, policies
- **Technology** - Tech innovations, startups, gadgets
- **Climate** - Environmental news, sustainability
- **Health** - Medical updates, wellness
- **Economy** - Financial markets, business
- **Sports** - Sports events, scores, updates

### 6. 💬 Discussion Forum
- Create discussion threads on articles
- Comment system with nested replies
- Real-time updates via Firestore
- User profile integration
- Moderation system

### 7. 📖 Reading List & Bookmarks
- Save articles for later reading
- Organize bookmarks by category
- Personal reading history
- Progress tracking

### 8. 🎯 Personalization
- User preferences storage
- Customized news feed
- Language preferences
- Category interests

### 9. 🔐 Authentication System
- Google OAuth integration
- GitHub authentication
- Email/Password login
- Profile management
- Secure session handling

### 10. 🌍 Multi-language Support
Supported Languages:
- English
- Hindi (हिंदी)
- Spanish (Español)
- French (Français)
- German (Deutsch)
- Chinese (中文)
- Japanese (日本語)
- Arabic (العربية)
- Portuguese (Português)
- Russian (Русский)

### 11. 🎨 Premium Features
- Ad-free experience
- Advanced AI insights
- Priority news updates
- Exclusive content access
- Custom themes

### 12. 🎮 Gamification
- Spin the wheel rewards
- Quiz competitions on news
- Achievement system
- Points & badges

---

## 📁 Project Structure

```
AI_NEWSMANIA/
├── public/                          # Static assets
│   ├── logo.svg
│   ├── images/
│   └── icons/
│
├── src/
│   ├── AiSummary/                  # AI Summary Module
│   │   ├── AiSummary.jsx           # Main AI summary component
│   │   ├── geminiApi.js            # Google Gemini integration
│   │   ├── newsApi.js              # News API integration
│   │   ├── CategoriesInfo.jsx      # Category-based news
│   │   ├── TrendingInfo.jsx        # Trending news component
│   │   └── SummaryAndImpacts.jsx   # Summary & impact analysis
│   │
│   ├── components/
│   │   ├── custom/                 # Custom components
│   │   │   ├── Header.jsx          # Main header
│   │   │   ├── Header2.jsx         # Alternative header
│   │   │   ├── Footer.jsx          # Footer with contact info
│   │   │   ├── Hero.jsx            # Hero section
│   │   │   ├── Aboutus.jsx         # About page
│   │   │   ├── Login.jsx           # Login component
│   │   │   ├── Register.jsx        # Registration
│   │   │   ├── Profile.jsx         # User profile
│   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   ├── Discussion.jsx      # Discussion forum
│   │   │   ├── BookmarksPage.jsx   # Bookmarks management
│   │   │   ├── ReadingList.jsx     # Reading list
│   │   │   ├── Preferences.jsx     # User preferences
│   │   │   ├── Analytics.jsx       # Analytics dashboard
│   │   │   ├── QuizComponent.jsx   # News quiz
│   │   │   ├── SpinWheel.jsx       # Reward wheel
│   │   │   ├── AiAssistant.jsx     # AI chat assistant
│   │   │   └── PremiumFeatures.jsx # Premium features
│   │   │
│   │   ├── ui/                     # UI Components (Radix UI)
│   │   │   ├── button.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── dropdown-menu.jsx
│   │   │   ├── input.jsx
│   │   │   ├── avatar.jsx
│   │   │   └── sonner.jsx
│   │   │
│   │   ├── layout/
│   │   │   └── RootLayout.jsx      # Root layout wrapper
│   │   │
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── NewsCard.jsx            # News article card
│   │   └── ClientDiscussion.jsx    # Client-side discussions
│   │
│   ├── constants/
│   │   └── options.jsx             # App configuration constants
│   │
│   ├── context/                    # React Context
│   │   └── AuthContext.jsx         # Authentication context
│   │
│   ├── hooks/                      # Custom React Hooks
│   │   ├── useAuth.js              # Authentication hook
│   │   ├── useNews.js              # News fetching hook
│   │   └── useBookmarks.js         # Bookmarks management
│   │
│   ├── lib/
│   │   └── utils.js                # Utility functions
│   │
│   ├── pages/                      # Page components
│   │   ├── Home.jsx
│   │   ├── Categories.jsx
│   │   ├── Trending.jsx
│   │   └── About.jsx
│   │
│   ├── proxy/                      # API proxy configuration
│   │
│   ├── service/
│   │   ├── AIModel.jsx             # AI model service
│   │   ├── openaiClient.js         # OpenAI integration
│   │   └── GlobalApi.jsx           # Global API functions
│   │
│   ├── styles/                     # CSS styles
│   │
│   ├── App.jsx                     # Main App component
│   ├── main.jsx                    # Entry point
│   ├── i18n.js                     # i18n configuration
│   └── index.css                   # Global styles
│
├── server/                         # Backend (Optional)
│   ├── middleware/
│   │   ├── auth.js                 # Auth middleware
│   │   └── rateLimit.js            # Rate limiting
│   │
│   ├── models/
│   │   ├── User.js                 # User model
│   │   └── Comment.js              # Comment model
│   │
│   └── routes/
│       ├── auth.js                 # Auth routes
│       └── comments.js             # Comments routes
│
├── .env                            # Environment variables
├── firebase.js                     # Firebase configuration
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind configuration
├── package.json                    # Dependencies
└── README.md                       # Project readme
```

---

## 🔧 Core Modules

### 1. News API Module (`src/AiSummary/newsApi.js`)

**Purpose:** Fetch and manage news articles from NewsAPI.org

**Key Features:**
- Multi-source news aggregation
- Trusted source prioritization (5-tier system)
- Language-specific news fetching
- CORS proxy support for production
- Error handling & retry logic

**Source Priority System:**
```javascript
Tier 1 (Most Trusted): Reuters, AP, BBC, NYT, The Guardian
Tier 2 (Highly Trusted): The Hindu, Times of India, Hindustan Times
Tier 3 (Reliable): Al Jazeera, CNN, NPR, Bloomberg
Tier 4 (Regional): Scroll.in, The Wire, India Today
Tier 5 (Others): Default sources
```

**Main Functions:**
- `fetchNewsArticles(query, lang)` - Fetch news by query
- `getSourcePriority(sourceName)` - Get source trust level
- `sortByRelevanceAndSource(articles)` - Sort articles by relevance

### 2. AI Gemini Module (`src/AiSummary/geminiApi.js`)

**Purpose:** AI-powered content analysis using Google Gemini

**Key Features:**
- Article summarization
- Key points extraction
- Sentiment analysis
- Impact assessment
- Related topics suggestion
- Interactive Q&A

**Main Functions:**
```javascript
- generateSummary(article, lang)
- extractKeyPoints(article, lang)
- analyzeSentiment(article, lang)
- generateImpactAssessment(article, lang)
- generateRelatedTopics(article, lang)
- answerQuestion(article, question, lang)
```

**Fallback Strategy:**
- Primary: AI-generated content
- Fallback: Rule-based heuristics
- Supports 10+ languages

### 3. Firebase Integration (`firebase.js`)

**Services Used:**

**Authentication:**
- Google OAuth
- GitHub OAuth
- Email/Password
- Session management

**Firestore Database:**
- User profiles
- Bookmarks
- Comments & discussions
- Reading history
- Preferences

**Storage:**
- User avatars
- Media uploads

**Analytics:**
- User behavior tracking
- Feature usage analytics

**Offline Support:**
- IndexedDB persistence
- Offline data caching
- Network status monitoring

---

## 🔌 API Integration

### NewsAPI Configuration

**Base URL:** `https://newsapi.org/v2/everything`

**API Key:** Set in `.env` as `VITE_NEWS_API_KEY`

**Current Key:** `4d9ec4d7869a4862a82dabc81cf0e00c`

**Rate Limits:**
- Free Tier: 100 requests/day
- Requests are cached for optimization

**Endpoints Used:**
```javascript
GET /v2/everything?q={query}&apiKey={key}&language={lang}
```

### Google Gemini AI

**Model:** `gemini-1.5-flash`

**API Key:** Set in `.env` as `VITE_GEMINI_API_KEY`

**Features:**
- Text generation
- Content analysis
- Multi-turn conversations
- Temperature: 0.7 (balanced creativity)

**Rate Handling:**
- Exponential backoff on 429 errors
- Max 3 retries
- Fallback to heuristics

### Firebase Configuration

**Project:** `newsmania-v1-85756`

**Services:**
- Authentication
- Firestore
- Storage
- Analytics

**Environment Variables:**
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

---

## 🗄️ Database & Authentication

### Firestore Collections

**Users Collection:**
```javascript
users/{userId}
  - uid: string
  - email: string
  - displayName: string
  - photoURL: string
  - preferences: object
  - createdAt: timestamp
  - lastLogin: timestamp
```

**Bookmarks Collection:**
```javascript
bookmarks/{bookmarkId}
  - userId: string
  - articleId: string
  - title: string
  - description: string
  - url: string
  - imageUrl: string
  - source: string
  - publishedAt: timestamp
  - savedAt: timestamp
  - category: string
  - tags: array
```

**Comments Collection:**
```javascript
comments/{commentId}
  - userId: string
  - userName: string
  - userPhoto: string
  - articleId: string
  - content: string
  - createdAt: timestamp
  - likes: number
  - replies: array
  - parentId: string (for nested comments)
```

**Discussions Collection:**
```javascript
discussions/{discussionId}
  - title: string
  - description: string
  - category: string
  - createdBy: string
  - createdAt: timestamp
  - views: number
  - replies: number
  - lastActivity: timestamp
```

### Authentication Flow

```
User Action → Auth Provider → Firebase Auth → Success/Error
                                    ↓
                              Create/Update User Doc
                                    ↓
                              Set Auth Context
                                    ↓
                              Redirect to Dashboard
```

**Supported Auth Methods:**
1. Google OAuth (Primary)
2. GitHub OAuth
3. Email/Password
4. Anonymous (Guest mode)

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Firebase account
- NewsAPI account
- Google Cloud account (for Gemini API)

### Installation Steps

1. **Clone the Repository**
```bash
git clone <repository-url>
cd AI_NEWSMANIA
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the root directory:
```env
# News API
VITE_NEWS_API_KEY=your_newsapi_key

# Google APIs
VITE_GOOGLE_PLACE_API_KEY=your_google_places_key
VITE_GOOGLE_GEMINI_AI_API_KEY=your_gemini_key
VITE_GEMINI_API_KEY=your_gemini_key

# OpenAI (Optional)
VITE_OPENAI_API_KEY=your_openai_key

# Google OAuth
VITE_GOOGLE_AUTH_CLIENT_ID=your_oauth_client_id

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Open in Browser**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 🔐 Environment Configuration

### Current Configuration

**News API:**
- Key: `4d9ec4d7869a4862a82dabc81cf0e00c`
- Source: https://newsapi.org/

**Firebase Project:**
- Project ID: `newsmania-v1-85756`
- Auth Domain: `newsmania-v1-85756.firebaseapp.com`

**Contact Information:**
- Email: `pranavkapratwar106@gmail.com`
- Phone: `+91 8262820855`
- Address: `KIT College, Gokul Shirgaon, Kolhapur`

### Getting API Keys

**NewsAPI:**
1. Visit https://newsapi.org/register
2. Sign up for free account
3. Get API key (100 requests/day free)

**Google Gemini AI:**
1. Visit https://makersuite.google.com/app/apikey
2. Create API key
3. Enable Gemini API

**Firebase:**
1. Visit https://console.firebase.google.com/
2. Create new project
3. Enable Authentication, Firestore, Storage
4. Get configuration from Project Settings

---

## 🎯 Features Deep Dive

### AI Summary Feature

**How It Works:**

1. **Article Selection:** User clicks "Get AI Summary" on article
2. **API Request:** Frontend sends article data to Gemini API
3. **AI Processing:**
   - Analyzes article content
   - Generates concise summary
   - Extracts key points
   - Determines sentiment
   - Assesses impact
4. **Response Formatting:** AI response formatted in user's language
5. **Caching:** Summary cached for 24 hours
6. **Fallback:** If AI fails, heuristic-based summary generated

**Example Output:**
```javascript
{
  summary: "Concise 2-3 sentence overview...",
  keyPoints: ["Point 1", "Point 2", "Point 3"],
  sentiment: "Positive" | "Negative" | "Neutral",
  sentimentScore: 0.75,
  impactAssessment: "Long-term implications...",
  relatedTopics: ["Topic 1", "Topic 2"]
}
```

### Sentiment Analysis

**Algorithm:**
1. Text preprocessing (tokenization, stemming)
2. Sentiment dictionary lookup
3. Score calculation (-1 to +1)
4. Classification:
   - Positive: score > 0.2
   - Negative: score < -0.2
   - Neutral: -0.2 ≤ score ≤ 0.2

**Visual Indicators:**
- 😊 Positive (Green)
- 😐 Neutral (Gray)
- ☹️ Negative (Red)

### Discussion Forum

**Architecture:**
```
Article → Discussion Thread → Comments → Replies
```

**Features:**
- Nested comments (2 levels)
- Real-time updates
- Like/Dislike system
- User mentions
- Rich text formatting
- Moderation tools

**Real-time Sync:**
- Firestore listeners for live updates
- Optimistic UI updates
- Conflict resolution

### Bookmarks System

**Storage:**
- Firestore collection per user
- Indexed by category and date
- Metadata cached locally

**Features:**
- Quick save from article card
- Organize by folders
- Search within bookmarks
- Export functionality
- Share bookmarks

### Reading List

**Smart Tracking:**
- Reading progress (percentage)
- Time spent on article
- Completion detection
- Reading speed calculation
- Personalized recommendations

---

## 🎨 UI/UX Components

### Design System

**Color Palette:**
```css
Primary: Blue (#3B82F6)
Secondary: Purple (#8B5CF6)
Accent: Pink (#EC4899)
Success: Green (#10B981)
Warning: Yellow (#F59E0B)
Error: Red (#EF4444)
```

**Typography:**
- Font Family: Inter, system-ui, sans-serif
- Headings: 700 weight
- Body: 400 weight
- Code: monospace

**Spacing Scale:**
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
```

### Component Library

**Base Components (Radix UI):**
- Button
- Dialog/Modal
- Dropdown Menu
- Avatar
- Input
- Toast Notifications

**Custom Components:**
- NewsCard - Article display card
- Header - Navigation header
- Footer - Site footer
- Hero - Hero section
- Discussion - Comment thread

**Animations (Framer Motion):**
- Page transitions
- Card hover effects
- Scroll animations
- Loading states
- Skeleton screens

---

## 🌍 Internationalization

### Supported Languages

1. **English** (en) - Default
2. **Hindi** (hi) - हिंदी
3. **Spanish** (es) - Español
4. **French** (fr) - Français
5. **German** (de) - Deutsch
6. **Chinese** (zh) - 中文
7. **Japanese** (ja) - 日本語
8. **Arabic** (ar) - العربية
9. **Portuguese** (pt) - Português
10. **Russian** (ru) - Русский

### Translation Structure

```javascript
// i18n/en/translation.json
{
  "nav": {
    "home": "Home",
    "categories": "Categories",
    "trending": "Trending"
  },
  "hero": {
    "title": "Stay Informed with AI-Powered News",
    "subtitle": "Get balanced perspectives..."
  },
  "features": {
    "aiSummary": "AI Summary",
    "sentiment": "Sentiment Analysis"
  }
}
```

### Language Detection

**Priority:**
1. User preference (saved in localStorage)
2. Browser language
3. Default to English

**Switching:**
- Dropdown in header
- Persists across sessions
- Updates all content dynamically

---

## 📱 Responsive Design

### Breakpoints

```javascript
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

### Mobile Optimizations
- Touch-friendly buttons (min 44px)
- Swipe gestures
- Mobile navigation drawer
- Optimized images
- Lazy loading
- Progressive Web App (PWA) ready

---

## 🚀 Deployment Guide

### Build Process

1. **Optimize Assets**
```bash
npm run build
```

2. **Output Directory**
```
dist/
├── assets/
├── index.html
└── ...
```

### Deployment Platforms

**Vercel (Recommended):**
```bash
npm i -g vercel
vercel deploy
```

**Netlify:**
```bash
npm run build
# Drag dist/ folder to Netlify dashboard
```

**Firebase Hosting:**
```bash
firebase init hosting
firebase deploy
```

### Environment Variables

**Production:**
- Set all `.env` variables in hosting platform
- Use different API keys for production
- Enable CORS for production domain

### Performance Optimization

**Implemented:**
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- CDN for static assets

**Lighthouse Scores (Target):**
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

---

## 🧪 Testing

### Testing Strategy

**Unit Tests:**
- Component testing with React Testing Library
- Utility function tests
- API integration tests

**E2E Tests:**
- User flows with Cypress
- Authentication flows
- Booking and payment flows

**Manual Testing Checklist:**
- [ ] News fetching works
- [ ] AI summaries generate correctly
- [ ] Authentication flows work
- [ ] Bookmarks save and retrieve
- [ ] Comments post successfully
- [ ] Multi-language switching
- [ ] Responsive on mobile
- [ ] Performance acceptable

---

## 🐛 Known Issues & Limitations

### Current Limitations

1. **NewsAPI Free Tier:**
   - 100 requests/day limit
   - 1-month old articles only
   - Consider paid plan for production

2. **AI Rate Limits:**
   - Gemini API has rate limits
   - Implement request queuing for scale

3. **Offline Support:**
   - Limited offline functionality
   - Improve with service workers

4. **Real-time Updates:**
   - Firestore listeners consume reads
   - Optimize with pagination

---

## 📊 Analytics & Monitoring

### Tracked Events

**User Interactions:**
- Page views
- Article reads
- Search queries
- Bookmark actions
- Comment posts
- Share actions

**Performance Metrics:**
- Page load time
- API response time
- Error rates
- User retention

### Tools
- Firebase Analytics
- Google Analytics (optional)
- Sentry (error tracking)

---

## 🔒 Security

### Implemented Security Measures

1. **Authentication:**
   - Secure Firebase Auth
   - JWT tokens
   - HTTPS only

2. **Data Protection:**
   - Firestore security rules
   - Input sanitization
   - XSS prevention

3. **API Keys:**
   - Environment variables
   - Not exposed in client code
   - Rotating keys periodically

4. **Rate Limiting:**
   - API request throttling
   - User action limits

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Style

- Use ESLint configuration
- Follow React best practices
- Write meaningful commit messages
- Document complex logic

---

## 📞 Contact Information

### Support

**Email:** pranavkapratwar106@gmail.com  
**Phone:** +91 8262820855  
**Address:** KIT College, Gokul Shirgaon, Kolhapur

### Social Media

- Twitter: @newsmania
- Facebook: /newsmania
- Instagram: @newsmania
- LinkedIn: /company/newsmania
- YouTube: /newsmania

---

## 📜 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite** - For blazing fast build tool
- **Firebase** - For backend services
- **Google Gemini** - For AI capabilities
- **NewsAPI** - For news aggregation
- **Tailwind CSS** - For utility-first CSS
- **Radix UI** - For accessible components
- **Framer Motion** - For animations

---

## 📝 Changelog

### Version 1.0.0 (Current)
- Initial release
- AI-powered summaries
- Multi-language support
- Discussion forum
- Bookmarks & reading list
- Authentication system
- Responsive design

### Future Roadmap

**v1.1.0:**
- [ ] Push notifications
- [ ] Email newsletters
- [ ] Advanced search filters
- [ ] User following system

**v1.2.0:**
- [ ] Mobile apps (React Native)
- [ ] Voice news reading
- [ ] Podcast integration
- [ ] Video news support

**v2.0.0:**
- [ ] AI-powered news writing
- [ ] Fact-checking integration
- [ ] Blockchain verification
- [ ] Decentralized storage

---

## 🎓 Learning Resources

### For Developers

**React:**
- [React Documentation](https://react.dev/)
- [React Router](https://reactrouter.com/)

**Firebase:**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)

**AI Integration:**
- [Google Gemini AI](https://ai.google.dev/)
- [OpenAI API](https://platform.openai.com/)

**Styling:**
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 💡 Tips & Best Practices

### Performance Tips
1. Use React.memo for expensive components
2. Implement virtual scrolling for long lists
3. Optimize images (WebP format)
4. Use CDN for static assets
5. Enable code splitting

### SEO Tips
1. Add meta tags for social sharing
2. Implement schema.org markup
3. Create sitemap.xml
4. Use semantic HTML
5. Optimize page titles

### Accessibility Tips
1. Use ARIA labels
2. Ensure keyboard navigation
3. Provide text alternatives
4. Maintain color contrast
5. Test with screen readers

---

## 🎉 Thank You!

Thank you for using NewsMania! We hope this documentation helps you understand and contribute to the project. For any questions or suggestions, please reach out to us.

**Stay informed, stay empowered!** 📰✨

---

*Last Updated: December 2024*  
*Version: 1.0.0*  
*Maintained by: NewsMania Team*
