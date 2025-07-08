# Claudia Mobile Terminal

A mobile web interface for terminal access via VSCode, providing a responsive and touch-friendly terminal experience on mobile devices.

## Description

Claudia Mobile Terminal is a React-based web application that enables mobile users to access and interact with terminal sessions through VSCode. Built with modern web technologies, it offers a seamless terminal experience optimized for touch interfaces and mobile screens.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Terminal Emulator**: xterm.js
- **Deployment**: Vercel
- **Package Manager**: npm/yarn/pnpm

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm, yarn, or pnpm package manager
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/claudia-mobile-terminal.git
cd claudia-mobile-terminal
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_URL=your_api_url
VITE_WS_URL=your_websocket_url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at `http://localhost:5173`.

## Build and Deployment

### Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

This will generate optimized files in the `dist` directory.

### Deploying to Vercel

#### Option 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Run the deployment command:
```bash
vercel
```

3. Follow the prompts to link your project and deploy.

#### Option 2: Using Git Integration

1. Push your code to a GitHub, GitLab, or Bitbucket repository.

2. Import your project on [Vercel](https://vercel.com/new):
   - Connect your Git provider
   - Select your repository
   - Configure build settings:
     - Framework Preset: Vite
     - Build Command: `npm run build` (or your package manager equivalent)
     - Output Directory: `dist`

3. Add environment variables in Vercel dashboard if needed.

4. Click "Deploy" and Vercel will automatically build and deploy your application.

### Environment Variables

For production deployment on Vercel, add the following environment variables in your Vercel project settings:

- `VITE_API_URL`: Your production API endpoint
- `VITE_WS_URL`: Your production WebSocket endpoint

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Project Structure

```
claudia-mobile-terminal/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and libraries
│   ├── styles/         # Global styles and Tailwind config
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── public/             # Static assets
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies and scripts
```

## Features

- Mobile-optimized terminal interface
- Touch-friendly controls and gestures
- Responsive design for various screen sizes
- WebSocket-based real-time communication
- Command history and auto-completion
- Customizable themes and appearance

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.