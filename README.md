# ScholarSync - Resume & Google Scholar Integration

A full-stack Next.js application that integrates resume parsing and Google Scholar profile data to suggest relevant projects based on your skills, education, and academic background.

## 🚀 Live Demo

The application is running at: **http://localhost:3001**

## 📋 Features

### 🔍 **Resume Parsing**
- Upload PDF/DOCX resume files
- Extract key information: name, contact details, skills, education, experience
- Secure file validation and size limits (max 5MB)
- Real-time parsing with progress indication

### 🎓 **Google Scholar Integration**
- Fetch Google Scholar profiles via URL input
- Extract research interests, publications, citations
- Display academic metrics (H-index, i10-index, total citations)
- Rate limiting for API protection

### 🚀 **AI-Powered Project Suggestions**
- Generate personalized project recommendations
- Match projects based on skills and research interests
- Categorize by difficulty level and estimated time
- Calculate match scores for better relevance

### 🛡️ **Security Features**
- Input validation and sanitization
- File upload security (type and size restrictions)
- Rate limiting on API endpoints
- CORS protection

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with server-side rendering
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Redux** - React bindings for Redux

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **pdf-parse** - PDF text extraction
- **mammoth.js** - DOCX text extraction
- **cheerio** - Web scraping for Google Scholar
- **express-rate-limit** - API rate limiting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/scholarsync-resume-integration.git
   cd scholarsync-resume-integration
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) (or 3001 if 3000 is in use)

## 📖 Usage Guide

### 1. Upload Resume
- Click on the file input in the "Upload Resume" section
- Select a PDF or DOCX file (max 5MB)
- Wait for parsing to complete
- Review extracted information

### 2. Add Google Scholar Profile
- Enter your Google Scholar profile URL
- Click "Fetch Profile" to retrieve academic data
- Review extracted research information

### 3. Generate Project Suggestions
- Upload resume and/or add Scholar profile
- Click "Generate Project Suggestions"
- Browse personalized recommendations
- Each suggestion includes difficulty, time estimate, and match score

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── parse-resume/
│   │   ├── fetch-scholar-profile/
│   │   └── generate-project-suggestions/
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                 # React components
│   ├── ResumeUploader.tsx
│   ├── ScholarProfileInput.tsx
│   ├── ProjectSuggestions.tsx
│   └── ReduxProvider.tsx
└── store/                      # Redux store
    ├── index.ts                # Store configuration
    ├── hooks.ts                # Typed Redux hooks
    ├── resumeSlice.ts          # Resume state management
    ├── scholarSlice.ts         # Scholar state management
    └── projectsSlice.ts        # Projects state management
```

## 🔒 Security Measures

### File Upload Security
- Strict file type validation (PDF/DOCX only)
- File size limits (5MB maximum)
- Buffer validation before processing

### API Protection
- Rate limiting on Scholar profile fetching
- Input sanitization and validation
- Error handling without information leakage

### Frontend Security
- XSS protection through React's built-in escaping
- Type safety with TypeScript
- Secure state management with Redux

## 🎨 Design Patterns

### Observer Pattern
- Redux store observes state changes
- Automatic component re-rendering

### Strategy Pattern
- Different parsing strategies for file types
- Modular file handling approach

### Factory Pattern
- Dynamic imports for parsing libraries
- Runtime module loading

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- Netlify
- Railway
- Heroku
- AWS

## 📊 API Endpoints

### `POST /api/parse-resume`
Parses uploaded resume files
- **Input**: FormData with resume file
- **Output**: Structured resume data

### `POST /api/fetch-scholar-profile`
Fetches Google Scholar profile
- **Input**: Scholar profile URL
- **Output**: Academic profile data

### `POST /api/generate-project-suggestions`
Generates project recommendations
- **Input**: Resume and/or Scholar data
- **Output**: Personalized project suggestions

## 🔮 Future Enhancements

- [ ] Enhanced NLP for better resume parsing
- [ ] Integration with more academic databases
- [ ] Machine learning for improved project matching
- [ ] User authentication and profile saving
- [ ] Project collaboration features
- [ ] Export functionality for suggestions

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ using Next.js, TypeScript, and Redux Toolkit**
