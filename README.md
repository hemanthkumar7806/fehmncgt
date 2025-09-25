# HNMC Medical Website

A modern medical website built with Next.js and Sanity CMS, featuring a responsive design with a left sidebar navigation.

## 🏥 Features

- **Responsive Design** - Works on all devices
- **Left Sidebar Navigation** - Collapsible hamburger menu
- **Sanity CMS Integration** - Content management system
- **Medical-Themed Design** - Professional healthcare styling
- **Fast Performance** - Built with Next.js 15 and Turbopack

## 🚀 Quick Start
### Prerequisites
- Node.js 18+ 
- npm or yarn
- Sanity CMS account

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd hnmc-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env.local` file:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=rl2j4kml
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_TOKEN=your-api-token  # Optional
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Option 1: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Set environment variables in Vercel dashboard**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`: `rl2j4kml`
- `NEXT_PUBLIC_SANITY_DATASET`: `production`

### Option 2: Deploy to Netlify

1. **Build the project**
```bash
npm run build
```

2. **Deploy to Netlify** via their dashboard or CLI

### Option 3: Deploy to any hosting provider

1. **Build the project**
```bash
npm run build
```

2. **Start the production server**
```bash
npm start
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Homepage
│   ├── layout.tsx      # Root layout
│   └── test-sanity/    # Sanity connection test
├── components/         # React components
│   ├── Sidebar.tsx     # Navigation sidebar
│   ├── Hero.tsx        # Hero section
│   ├── Services.tsx    # Services section
│   ├── About.tsx       # About section
│   └── Contact.tsx     # Contact section
└── lib/               # Utility functions
    └── sanity.ts      # Sanity CMS configuration
```

## 🔧 Configuration

### Sanity CMS Setup

1. **Project ID**: `rl2j4kml`
2. **Dataset**: `production`
3. **API Version**: `2025-08-30`

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID | Yes |
| `NEXT_PUBLIC_SANITY_DATASET` | Your Sanity dataset | Yes |
| `SANITY_TOKEN` | API token for private content | No |

## 🎨 Customization

### Colors
The website uses a medical blue color scheme:
- Primary: `#2563eb` (blue-600)
- Secondary: `#1e40af` (blue-700)
- Background: `#f8fafc` (gray-50)

### Components
All components are modular and can be easily customized:
- Update colors in Tailwind classes
- Modify content through Sanity CMS
- Add new sections by creating new components

## 📱 Responsive Design

The website is fully responsive with:
- **Mobile**: Single column layout
- **Tablet**: Two column layout
- **Desktop**: Full layout with sidebar

## 🔍 Testing

### Sanity Connection Test
Visit `/test-sanity` to test the Sanity CMS connection and see available data.

### Development
```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
```

## 🚀 Performance

- **Next.js 15** with Turbopack for fast development
- **Image optimization** with Next.js Image component
- **Code splitting** for optimal loading
- **SEO optimized** with proper meta tags


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, please contact the development team or create an issue in the repository.
