# Company Review Platform

A modern, responsive web application for managing and displaying company reviews with admin functionality.

## Features

### Public Interface
- Clean, professional homepage displaying company reviews in a responsive grid
- Individual review detail pages with full content display
- Star ratings and company information
- Direct links to company websites
- Mobile-responsive design

### Admin Interface
- Add new company reviews with comprehensive form validation
- Edit existing reviews with pre-populated data
- Delete reviews with confirmation
- Image upload functionality with preview
- Review management table with sorting and filtering
- Date picker for review dates
- Star rating selector

### Review Data Structure
Each review contains:
1. **Date** - When the review was created/published
2. **Company Name** - Name of the company being reviewed
3. **Paragraph Text** - Detailed review content (minimum 100 characters)
4. **Images** - Company photos/workspace images (optional)
5. **Website Link** - Direct link to company website
6. **Rating** - 1-5 star rating system

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Wouter** for client-side routing
- **Tailwind CSS** for styling
- **Shadcn/UI** for component library
- **TanStack Query** for data fetching and caching
- **React Hook Form** with Zod validation
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **Multer** for file upload handling
- **Zod** for request validation
- **In-memory storage** for data persistence
- **Drizzle ORM** for type-safe schema definitions

## Local Setup Instructions

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd company-review-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Homepage: `http://localhost:5000`
   - All Reviews: `http://localhost:5000/reviews`
   - Admin Panel: `http://localhost:5000/admin` (requires authentication)

## Authentication & Security

### Admin Access
The admin panel is protected by Replit's OpenID Connect authentication system. Only authenticated users can:
- Add new company reviews
- Edit existing reviews
- Delete reviews
- Upload company images

### Security Features
- **Protected Routes**: All admin operations require authentication
- **Session Management**: Secure session storage using PostgreSQL
- **File Upload Security**: Image uploads are validated and restricted
- **Error Handling**: Proper unauthorized access handling with redirects

### Accessing Admin Panel
1. Navigate to `/admin`
2. If not logged in, you'll be redirected to the login page
3. Log in with your Replit account
4. Access full admin functionality

## Database Schema

The application uses PostgreSQL with the following tables:

### Reviews Table
- `id` - Primary key (auto-increment)
- `company_name` - Company name (required)
- `review_date` - Review date (required)
- `content` - Review content (required, min 100 characters)
- `image_url` - Company image URL (optional)
- `website_url` - Company website URL (required)
- `rating` - Star rating 1-5 (required)
- `created_at` - Timestamp

### Users Table (Authentication)
- `id` - User ID from Replit
- `email` - User email
- `first_name` - First name
- `last_name` - Last name
- `profile_image_url` - Profile image
- `created_at` / `updated_at` - Timestamps

### Sessions Table
- Session management for authentication

## API Endpoints

### Public Endpoints
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get specific review

### Protected Endpoints (Admin Only)
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Authentication Endpoints
- `GET /api/login` - Initiate login
- `GET /api/logout` - Logout
- `GET /api/callback` - OAuth callback
- `GET /api/auth/user` - Get current user

## Features in Detail

### Homepage
- Clean grid layout displaying latest reviews
- Star ratings and company thumbnails
- Links to full review details
- Responsive design for all devices

### All Reviews Page (`/reviews`)
- **Search Functionality**: Search by company name or content
- **Filtering**: Filter by star rating (1-5 stars)
- **Sorting Options**:
  - Newest first
  - Oldest first
  - Highest rated
  - Lowest rated
  - Company name (alphabetical)
- **Pagination**: 12 reviews per page with navigation
- **Responsive Grid**: Adapts to screen size

### Review Detail Pages
- Full review content display
- Company information and ratings
- Direct links to company websites
- Professional formatting with proper spacing

### Admin Panel (Protected)
- **Authentication Required**: Automatic redirect to login
- **Review Management Table**: Edit and delete existing reviews
- **Add New Reviews**: Comprehensive form with validation
- **Image Upload**: Drag-and-drop interface with preview
- **Form Validation**: Client and server-side validation
- **Error Handling**: Proper error messages and auth redirects

## Sample Data

The application comes pre-populated with 18+ diverse company reviews including:
- Technology companies (TechCorp Solutions, AI Innovations Lab)
- Creative agencies (Creative Studio Inc, GameDev Studios)
- Financial services (FinanceFirst Group)
- Healthcare technology (HealthTech Solutions, BioTech Research)
- Startups and enterprises
- Various industries and company sizes
- Different rating levels (1-5 stars)

## File Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks (useAuth)
│   │   ├── lib/            # Utilities and API functions
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Express server
│   ├── db.ts              # Database connection
│   ├── storage.ts         # Data access layer
│   ├── routes.ts          # API route handlers
│   ├── replitAuth.ts      # Authentication middleware
│   └── index.ts           # Server entry point
├── shared/                 # Shared TypeScript types
│   └── schema.ts          # Database schema and validation
└── uploads/               # Image upload directory
```

## Development Notes

- **TypeScript**: Full type safety across frontend and backend
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Authentication**: Replit OpenID Connect integration
- **File Uploads**: Multer with image validation and size limits
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for data fetching and caching

## Production Deployment

The application is ready for deployment on Replit with:
- Database migrations handled automatically
- Environment variables configured
- Session storage using PostgreSQL
- File upload handling
- Secure authentication flow
   