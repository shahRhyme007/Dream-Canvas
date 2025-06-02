# DreamCanvas - AI Image Editor

Transform your creative vision with AI-powered image editing. DreamCanvas is a Next.js application that provides powerful image transformation capabilities using Cloudinary AI.

## Features

- AI-powered image transformations (restore, remove background, object removal, recoloring, smart fill)
- User authentication with Clerk
- Credit-based system with Stripe payments
- MongoDB database for user and image management
- Modern, responsive UI with Tailwind CSS

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URL=your_mongodb_connection_string

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
WEBHOOK_SECRET=your_clerk_webhook_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

