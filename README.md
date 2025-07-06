# Shri Industries - Industrial Machinery Website

A modern React-based website for Shri Industries, showcasing industrial machinery and equipment.

## 🌐 Live Website
**Frontend**: [Your Netlify URL]  
**Backend**: [Your Railway URL]

## 🚀 Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes
- **Product Showcase**: Interactive product carousel and detailed product pages
- **Contact Form**: Integrated contact form with backend functionality
- **Modern UI**: Built with React and enhanced with Framer Motion animations
- **SEO Optimized**: Proper meta tags and sitemap for search engines

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **Framer Motion** - Smooth animations and transitions
- **React Icons** - Beautiful icon library
- **Lottie React** - Animated preloader and UI elements

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB object modeling
- **Nodemailer** - Email functionality
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
shri-industries/
├── public/                 # Static assets
│   ├── images/            # Product images and graphics
│   ├── index.html         # Main HTML file
│   └── manifest.json      # PWA manifest
├── src/                   # React source code
│   ├── components/        # Reusable React components
│   ├── App.js            # Main App component
│   └── index.js          # Entry point
├── backend/              # Node.js backend
│   ├── models/           # Database models
│   ├── server.js         # Express server
│   └── package.json      # Backend dependencies
└── package.json          # Frontend dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for backend functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd shri-industries
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Set up environment variables**
   
   **Frontend (.env file):**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```
   
   **Backend (.env file):**
   ```env
   MONGODB_URI=mongodb://localhost:27017/shri_industries
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

5. **Start the development servers**

   **Frontend (React):**
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the website.

   **Backend (Node.js):**
   ```bash
   cd backend
   node server.js
   ```
   The backend will run on [http://localhost:5000](http://localhost:5000)

## 📝 Available Scripts

### Frontend Scripts
- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

### Backend Scripts
- `node server.js` - Starts the Express server

## 🎨 Customization

### Adding New Products
1. Add product images to the `public/` directory
2. Update the product data in your components
3. Add product details and specifications

### Styling
- CSS files are organized alongside their corresponding components
- Use CSS variables for consistent theming
- Responsive design is implemented using media queries

## 🔧 Deployment

### Frontend Deployment (Netlify)
1. Build the production version:
   ```bash
   npm run build
   ```
2. Deploy the `build/` folder to Netlify
3. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app`

### Backend Deployment (Railway)
1. Deploy the `backend/` folder to Railway
2. Set up environment variables on Railway platform
3. Ensure MongoDB is accessible from your server

## 📞 Support

For any questions or issues, please contact the development team.

## 📄 License

This project is proprietary to Shri Industries.

---

**Built with ❤️ for Shri Industries**
