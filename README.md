# YouTube Clone with AI Features

A full-featured YouTube clone built with modern web technologies, enhanced with AI-powered features for content creation and management.

![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)
![tRPC](https://img.shields.io/badge/tRPC-11-2596BE?logo=trpc)

## Features

### 🎬 Video Management
- **Video Upload** - Upload videos directly using Mux integration with real-time upload progress
- **Video Processing** - Automatic video transcoding and optimization via Mux
- **Thumbnail Generation** - Auto-generated thumbnails with AI-powered custom thumbnail creation
- **Video Preview** - Animated GIF previews for video hover states
- **Subtitles** - Auto-generated English subtitles for accessibility

### 🤖 AI-Powered Features
- **AI Title Generation** - Automatically generate engaging video titles
- **AI Description Generation** - Create compelling video descriptions using AI
- **AI Thumbnail Generation** - Generate custom thumbnails with text prompts
- Powered by Upstash Workflow for reliable background job processing

### 👤 User Features
- **Authentication** - Secure authentication with Clerk
- **User Profiles** - View user channels and their content
- **Subscriptions** - Subscribe to creators and manage subscriptions
- **Video History** - Track viewed videos

### 💬 Engagement
- **Comments** - Add, view, and manage comments on videos
- **Reactions** - Like and dislike videos
- **View Tracking** - Track video views per user
- **Subscriber Counts** - Real-time subscriber statistics

### 🎨 Creator Studio
- **Content Management** - Manage all uploaded videos in one place
- **Video Editor** - Update title, description, category, and visibility
- **Thumbnail Management** - Upload custom thumbnails or restore defaults
- **Analytics Dashboard** - View video performance metrics

### 📁 Content Organization
- **Categories** - Browse videos by category (Gaming, Music, Education, etc.)
- **Visibility Controls** - Set videos as public or private
- **Search & Filter** - Filter content with carousel-based category selection

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible UI components
- **Lucide React** - Icon library
- **React Hook Form** - Form handling with Zod validation

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Drizzle ORM** - TypeScript-first ORM
- **Neon Database** - Serverless PostgreSQL
- **Upstash Redis** - Rate limiting and caching
- **Upstash Workflow** - Background job processing for AI features

### Media & Storage
- **Mux** - Video hosting, streaming, and processing
- **UploadThing** - File uploads for thumbnails

### Authentication
- **Clerk** - Complete user management and authentication

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (sign-in, sign-up)
│   ├── (home)/            # Public-facing pages
│   ├── (studio)/          # Creator studio pages
│   └── api/               # API routes (tRPC, webhooks, uploads)
├── components/            # Shared UI components
│   └── ui/                # shadcn/ui components
├── db/                    # Database schema and connection
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries (Mux, Redis, etc.)
├── modules/               # Feature modules
│   ├── auth/              # Authentication components
│   ├── categories/        # Category management
│   ├── comments/          # Comment system
│   ├── home/              # Home page features
│   ├── studio/            # Creator studio
│   ├── subscriptions/     # Subscription management
│   ├── users/             # User profiles
│   ├── video-reactions/   # Like/dislike system
│   ├── video-views/       # View tracking
│   └── videos/            # Video management
├── scripts/               # Database seeding scripts
└── trpc/                  # tRPC configuration and routers
```

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database (Neon recommended)
- Mux account for video processing
- Clerk account for authentication
- UploadThing account for file uploads
- Upstash account for Redis and Workflow

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=

# Mux
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
MUX_WEBHOOK_SECRET=

# UploadThing
UPLOADTHING_TOKEN=

# Upstash
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
UPSTASH_WORKFLOW_URL=
QSTASH_TOKEN=

# OpenAI (for AI features)
OPENAI_API_KEY=
```

### Installation

```bash
# Install dependencies
bun install

# Push database schema
bun run db:push

# Seed categories
bun run db:seed

# Run development server
bun run dev
```

### Development with Webhooks

To test webhooks locally, use the provided ngrok integration:

```bash
# Run both dev server and ngrok tunnel
bun run dev:all
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run dev:all` | Start dev server with ngrok for webhooks |
| `bun run build` | Build for production |
| `bun run start` | Start production server |
| `bun run lint` | Run ESLint |

## Database Schema

Key entities in the database:

- **users** - User profiles synced with Clerk
- **videos** - Video metadata and Mux integration
- **categories** - Video categories
- **comments** - Video comments
- **subscriptions** - Creator-viewer relationships
- **videoViews** - View tracking
- **videoReactions** - Like/dislike tracking

## API Architecture

The application uses tRPC for type-safe API communication:

- **videos** - CRUD operations, AI generation triggers
- **studio** - Creator studio operations
- **categories** - Category listing
- **comments** - Comment management
- **subscriptions** - Subscription management
- **videoViews** - View tracking
- **videoReactions** - Reaction management

## Deployment

Deploy on Vercel for the best experience with Next.js:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/firasayari10/Youtube-AI)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js, tRPC, and AI
