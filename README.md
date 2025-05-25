# Connections Tracker Frontend

A modern React.js single-page application for managing professional and personal connections with an intuitive, responsive interface.

## 🚀 Technology Stack

- **React** (v19.1.0) - JavaScript library for building user interfaces
- **Bootstrap** - CSS framework for responsive design
- **Bootstrap Icons** - Icon library for UI elements
- **React Context API** - State management
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Custom styling with dark/light mode support

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- Backend API server running (see backend README.md)

## 🛠️ Installation & Setup

1. **Clone the repository and navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the frontend root directory:

   ```env
   REACT_APP_API_BASE=http://localhost:4000/api
   ```

   For production, update the API base URL to your deployed backend.

4. **Start the development server:**

   ```bash
   npm start
   ```

   The application will open at `http://localhost:3000`

5. **Build for production:**
   ```bash
   npm run build
   ```

## 🏗️ Application Architecture

### Component Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Auth.js                    # Login/Register forms
│   │   └── FirstUserSetup.js          # Initial admin setup
│   ├── layout/
│   │   ├── Header.js                  # Navigation header
│   │   ├── Footer.js                  # Application footer
│   │   └── ServerLoading.js           # Backend connectivity check
│   ├── lists/
│   │   ├── ConnectionList.js          # Display all connections
│   │   ├── CompanyList.js             # Display all companies
│   │   └── PositionList.js            # Display all positions
│   ├── modals/
│   │   ├── ConnectionModal.js         # Add/Edit connections
│   │   ├── CompanyModal.js            # Add/Edit companies
│   │   ├── PositionModal.js           # Add/Edit positions
│   │   ├── UserManagementModal.js     # Admin user management
│   │   └── ModalBackdrop.js           # Modal overlay component
│   └── pages/
│       ├── ConnectionDetails.js       # Individual connection view
│       └── CompanyDetails.js          # Individual company view
├── context/
│   ├── AppContext.js                  # Global state management
│   ├── apiUtils.js                    # HTTP request utilities
│   ├── authService.js                 # Authentication services
│   ├── connectionService.js           # Connection API calls
│   ├── companyService.js              # Company API calls
│   └── positionService.js             # Position API calls
└── App.js                             # Main application component
```

### State Management

The application uses React Context API for global state management, providing:

- **Authentication State**: User login status, JWT tokens, user info
- **Data State**: Connections, companies, and positions
- **UI State**: Dark mode, current view, modal states
- **Loading States**: API call status and server connectivity

## 🎨 Features

### Core Functionality

- **🔐 Authentication System**

  - First-time setup for admin user
  - Secure login/logout
  - JWT token management
  - Admin user creation capabilities

- **👥 Connection Management**

  - Add, edit, delete personal/professional connections
  - Store contact details (name, email, phone)
  - Social media integration (LinkedIn, GitHub)
  - Personal notes and relationship tracking

- **🏢 Company Management**

  - Add, edit, delete company information
  - Industry categorization
  - Website links
  - Integration with connection positions

- **💼 Position Tracking**

  - Link connections to companies with specific roles
  - Track employment history with start/end dates
  - Current position indicators
  - Position-specific notes

- **🔍 Advanced Views**
  - Detailed connection profiles with career history
  - Company profiles with employee listings
  - Cross-referenced data relationships

### UI/UX Features

- **🌓 Dark/Light Mode Toggle**
- **📱 Fully Responsive Design** (Mobile, Tablet, Desktop)
- **⚡ Real-time Data Updates**
- **🎯 Intuitive Navigation**
- **📊 Organized Data Display**
- **🔄 Server Health Monitoring**

## 🔗 API Integration

The frontend communicates with the backend API through service modules:

### Authentication Flow

1. **Health Check**: Verifies backend connectivity
2. **User Existence Check**: Determines if setup is needed
3. **Login/Register**: JWT token acquisition
4. **Protected Routes**: Token-based API access

### Data Flow

1. **Fetch**: Load user's connections, companies, and positions
2. **CRUD Operations**: Create, read, update, delete through API
3. **State Updates**: Real-time UI updates after API calls
4. **Error Handling**: User-friendly error messages

## 🎯 Usage Guide

### First Time Setup

1. Access the application
2. Complete admin user setup (first launch only)
3. Login with created credentials

### Managing Connections

1. Click "Add Connection" to create new contacts
2. Fill in contact details and notes
3. View connection details by clicking on names
4. Edit or delete connections as needed

### Managing Companies

1. Use "Add Company" to create company profiles
2. Include industry and website information
3. View company details and associated employees

### Managing Positions

1. Create positions to link connections with companies
2. Specify job titles, dates, and employment status
3. Track career progression and company relationships

### Navigation

- **Main View**: Overview of all data with quick actions
- **Detail Views**: Deep dive into specific connections or companies
- **Modals**: Quick add/edit functionality
- **Dark Mode**: Toggle in header for preferred theme

## 🔧 Configuration

### Environment Variables

| Variable             | Description          | Default                     |
| -------------------- | -------------------- | --------------------------- |
| `REACT_APP_API_BASE` | Backend API base URL | `http://localhost:4000/api` |

### Customization

The application supports easy customization through:

- **CSS Variables**: Modify colors and spacing in `index.css`
- **Bootstrap Classes**: Leverage Bootstrap's utility classes
- **Component Props**: Configurable component behavior

## 🚀 Deployment

### Build Process

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

### Deployment Platforms

**Recommended**: Vercel, Netlify, or GitHub Pages

#### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Netlify Deployment

1. Build the project: `npm run build`
2. Upload the `build/` directory to Netlify
3. Configure environment variables

### Environment Variables for Production

```env
REACT_APP_API_BASE=https://your-backend-api.com/api
```

## 🔒 Security Considerations

- **JWT Storage**: Tokens stored in localStorage with automatic cleanup
- **Protected Routes**: Authentication checks before API calls
- **Input Validation**: Form validation and sanitization
- **Error Handling**: Secure error messages without sensitive data exposure

## 🔧 Development Scripts

```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run eject    # Eject from Create React App (irreversible)
```

## 🐛 Troubleshooting

### Common Issues

1. **Backend Connection Issues**

   - Verify backend server is running
   - Check API base URL in environment variables
   - Monitor browser console for network errors

2. **Authentication Problems**

   - Clear localStorage and retry login
   - Verify JWT token validity
   - Check backend authentication endpoints

3. **Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Verify Node.js version compatibility

## 📄 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Harikesh Kushwaha**

---

For backend API documentation, see the backend README.md file.
