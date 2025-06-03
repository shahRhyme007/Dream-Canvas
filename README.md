<div align="center">
  <img src="public/assets/images/logo-text.svg" alt="DreamCanvas Logo" width="400"/>
  
  <h3>🎨 Transform Your Creative Vision with AI-Powered Image Editing</h3>
  
  <p>
    <strong>DreamCanvas</strong> is a cutting-edge AI-powered image editing platform that brings professional-grade transformations to your fingertips. Built with Next.js 14 and powered by Cloudinary AI.
  </p>

  <img src="public/landingPage.png" alt="DreamCanvas Logo" width="400"/>
  <p>
    <a href="#features"><strong>Features</strong></a> •
    <a href="#demo"><strong>Demo</strong></a> •
    <a href="#tech-stack"><strong>Tech Stack</strong></a> •
    <a href="#getting-started"><strong>Getting Started</strong></a> •
    <a href="#deployment"><strong>Deployment</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js 14"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  </p>
</div>

---

## ✨ Features

### **AI-Powered Transformations**
- **Image Restore** - Bring old photos back to life with cutting-edge AI restoration
- **Object Recolor** - Change colors of specific objects with precision and natural results
- **Generative Fill** - Intelligently expand and fill images with contextual AI-generated content
- **Object Removal** - Seamlessly remove unwanted objects while preserving image quality
- **Background Remove** - Create professional cutouts with perfect edges

### **Authentication & User Management**
- Secure user authentication with **Clerk**
- User profiles with credit balance tracking
- Session management and protected routes

###  **Credit System & Payments**
- **Credit-based pricing model**:
  - **Free Tier**: 20 credits
  - **Pro Plan**: 120 credits for $40
  - **Premium Plan**: 2000 credits for $199
- Secure payments with **Stripe**
- Real-time credit balance updates

###  **Modern UI/UX**
- **Beautiful Landing Page** with cursor trail effects
- **Interactive Book-Style** feature showcase with page turning animations
- **Responsive design** optimized for all devices
- **Framer Motion** animations for smooth interactions
- **Glass morphism** and gradient effects

### **Data Management**
- **MongoDB** database for scalable data storage
- User-specific image galleries
- Search and pagination functionality
- Image metadata and transformation history

---

## Demo

### Live Application
**[Visit DreamCanvas](http://localhost:3000)** *(Replace with your deployed URL)*

### Key Workflows

1. **Sign Up/Login** - Quick authentication with Clerk
2. **Upload Image** - Drag & drop or browse to upload
3. **Apply AI Magic** - Choose from 5 powerful AI transformations
4. **Save & Download** - Save to your gallery and download results
5. **Manage Credits** - Purchase credit packages as needed

---

## Tech Stack

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Shadcn/UI** - Modern component library

### **Backend & Services**
- **MongoDB** - NoSQL database with Mongoose ODM
- **Cloudinary AI** - Image processing and AI transformations
- **Clerk** - Authentication and user management
- **Stripe** - Payment processing
- **Webhooks** - Real-time event handling

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** 18+ and npm
- **MongoDB** database
- **Cloudinary** account
- **Clerk** account
- **Stripe** account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/dreamcanvas.git
cd dreamcanvas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/dreamcanvas

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
WEBHOOK_SECRET=whsec_...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## Project Structure

```
dreamcanvas/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (root)/            # Main application pages
│   ├── api/               # API routes and webhooks
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── shared/           # Shared components
│   └── ui/               # Shadcn/UI components
├── lib/                  # Utility functions and configurations
│   ├── actions/          # Server actions
│   ├── database/         # Database models and connection
│   └── utils.ts          # Helper functions
├── public/               # Static assets
│   └── assets/          # Images, icons, logos
├── types/                # TypeScript type definitions
└── constants/            # Application constants
```

---

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

---

## 🔧 Configuration

### Webhook Setup

#### Clerk Webhooks
1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`

#### Stripe Webhooks
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Subscribe to: `checkout.session.completed`

---

## Features Overview

| Feature | Description | Credits Cost |
|---------|-------------|--------------|
| 🔧 Image Restore | AI-powered photo restoration | -1 credit |
| 🎨 Object Recolor | Change object colors precisely | -1 credit |
| ✨ Generative Fill | Smart content-aware fill | -1 credit |
| 🗑️ Object Removal | Remove unwanted objects | -1 credit |
| 🖼️ Background Remove | Professional background removal | -1 credit |

---

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Cloudinary** for powerful AI image processing
- **Clerk** for seamless authentication
- **Stripe** for secure payment processing
- **Vercel** for excellent hosting platform
- **Next.js** team for the amazing framework

---

<div align="center">
  <p>Made by <strong>Shah Arifur Rahman Rhyme</strong></p>
  <p>
    <a href="https://github.com/shahRhyme007">GitHub</a> •
    <a href="https://www.linkedin.com/in/shah-rhyme">LinkedIn</a> •
    <a href="https://shahrhyme.vercel.app/">Portfolio</a>
  </p>
</div>

