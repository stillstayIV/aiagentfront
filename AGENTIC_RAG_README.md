# AI Agent Frontend with Agentic RAG Backend

This frontend application connects to an Agentic RAG (Retrieval-Augmented Generation) backend to provide intelligent text generation, data storage, and search capabilities.

## 🚀 Features

### Core Functionality
- **Text Generation**: AI-powered text generation using agentic RAG
- **Data Entry**: Store documents and data in the RAG system
- **Similarity Search**: Semantic search using vector embeddings
- **Text Search**: Traditional keyword-based search
- **History Management**: Track and replay previous interactions

### Technical Features
- **Backend Integration**: Seamless connection to agentic RAG backend at `http://localhost:5000`
- **Fallback Mode**: Graceful degradation with mock responses when backend is unavailable
- **Real-time Status**: Backend connection monitoring with retry functionality
- **Responsive UI**: Modern, mobile-friendly interface with glass morphism design
- **Toast Notifications**: User feedback for all operations

## 🛠 Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Agentic RAG backend running on `http://localhost:5000`

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd aiagentfront
   npm install
   ```

2. **Configure environment:**
   ```bash
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NODE_ENV=development
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open [http://localhost:3001](http://localhost:3001) in your browser

## 🔧 Backend Integration

### API Endpoints

The frontend connects to these backend endpoints:

#### Text Generation
- **POST** `/api/generate`
  ```json
  {
    "prompt": "Your prompt here"
  }
  ```

#### Data Storage
- **POST** `/api/data`
  ```json
  {
    "content": "Document content",
    "context": "Optional context"
  }
  ```

#### Similarity Search
- **POST** `/api/search/similar`
  ```json
  {
    "query": "Search query",
    "limit": 5
  }
  ```

#### Text Search
- **POST** `/api/search/text`
  ```json
  {
    "query": "Search keywords",
    "limit": 5
  }
  ```

#### Health Check
- **GET** `/health`
  Returns backend status and health information

### Backend Requirements

Your agentic RAG backend should implement these endpoints and return appropriate JSON responses. The frontend includes fallback mechanisms for when the backend is unavailable.

## 🎨 UI Components

### Navigation
- **Navbar**: Tab-based navigation between different features
- **Status Indicator**: Real-time backend connection status
- **Mobile Support**: Responsive hamburger menu

### Forms
- **TextGenerationForm**: Main AI interaction interface with history sidebar
- **DataEntryForm**: Document and data submission
- **SearchForm**: Unified search interface for both similarity and text search
- **HistoryForm**: Historical interaction management

### Features
- **Scrollable Areas**: Custom scrollbars with purple theme
- **Resizable Textarea**: Flexible input areas
- **Glass Morphism**: Modern translucent design elements
- **Purple Theme**: Consistent color scheme throughout

## 🔄 Data Flow

1. **User Input** → Frontend validates and processes
2. **API Call** → Request forwarded to agentic RAG backend
3. **Backend Processing** → Agentic RAG processes request
4. **Response** → Results displayed in UI
5. **History** → Interactions saved locally for replay

## 🛡 Error Handling

- **Network Errors**: Automatic fallback to mock responses
- **Backend Unavailable**: Clear status indication with retry option
- **Input Validation**: Client-side validation with user feedback
- **Toast Notifications**: Real-time operation status updates

## 🔧 Development

### Project Structure
```
aiagentfront/
├── app/
│   ├── api/           # API route handlers (proxy to backend)
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main application page
├── components/        # React components
├── lib/
│   └── api.ts         # API service layer
├── src/app/
│   └── globals.css    # Global styles and utilities
└── public/           # Static assets
```

### Key Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React Hot Toast**: Notification system
- **React Icons**: Icon library
- **Axios**: HTTP client for API calls

## 🚀 Deployment

### Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://your-backend-url:5000
NODE_ENV=production
```

### Build and Deploy
```bash
npm run build
npm start
```

## 📝 Usage Examples

### Text Generation
1. Navigate to "Text Generation" tab
2. Enter your prompt in the textarea
3. Press Enter or click generate
4. View results with full scrollable text
5. Access history from the sidebar

### Data Storage
1. Go to "Data Entry" tab
2. Enter content and optional context
3. Submit to store in RAG system
4. Receive confirmation with storage ID

### Search Operations
1. Select "Similarity Search" or "Text Search"
2. Enter your search query
3. View ranked results
4. Results are retrieved from RAG backend

## 🔍 Monitoring

The application includes built-in monitoring:
- Backend connection status
- API response times
- Error tracking
- User interaction history

## 🤝 Contributing

1. Ensure your agentic RAG backend is compatible with the API specification
2. Test all features with both connected and disconnected backend states
3. Follow the existing code style and component patterns
4. Update documentation for any new features

## 📞 Support

- Check backend connection status in the top-right indicator
- Use the retry button if backend becomes unavailable
- Monitor browser console for detailed error information
- Ensure backend is running on the configured port (default: 5000)
