# 🎯 Yash Suthar Portfolio

A unique and interactive portfolio website featuring a Linux terminal interface and 3D interactive elements. Built with modern web technologies and following the highest code quality standards.

## ✨ Features

### 🖥️ **BIOS/Boot Loader**
- Full-screen boot animation with realistic BIOS simulation
- Sequential loading animations with typing effects and audio
- Resource loading progress bar
- Interactive "START" button to launch the portfolio

### 🎮 **Interactive Terminal**
- Full Linux terminal emulation with xterm.js
- Comprehensive command set including portfolio-specific commands
- System commands (ls, pwd, cd, grep, cat, etc.)
- Fun commands (neofetch, cowsay, figlet, fortune, cmatrix)
- **Snake Game** - Fully playable ASCII snake game within the terminal
- Command history, tab completion, and help system
- Mobile-friendly with swipe gestures and touch controls

### 📦 **Portfolio Commands**
- `help` - Complete command reference
- `about` - Personal information and bio
- `skills` - Technical skills and expertise
- `experience` - Professional work history
- `education` - Educational background
- `projects` - Portfolio projects with links
- `certifications` - Professional certifications
- `contact` - Contact information and social links
- `funfact` - Random developer fun facts

### 🎨 **3D Interactive Card**
- Placeholder component ready for custom 3D implementation
- Responsive design with hover effects
- Prepared for Three.js integration
- Interactive rotation and animation support

### 📱 **Responsive Design**
- **Desktop**: Split-screen layout (40% 3D card, 60% terminal)
- **Mobile**: Full-screen swipe navigation between panels
- Touch controls for games and navigation
- Optimized performance across all devices

### 🎵 **Audio & Visual Effects**
- Custom tick sounds for terminal typing
- Glowing UI elements and borders
- Matrix-style background effects
- Smooth animations and transitions

## 🛠️ **Technology Stack**

### **Core Technologies**
- **Next.js 15.3.4** - React framework with App Router
- **TypeScript** - Type-safe development with strict configuration
- **Tailwind CSS 4** - Utility-first styling
- **React 19** - Latest React with concurrent features

### **Terminal & 3D**
- **@xterm/xterm** - Full-featured terminal emulator
- **react-three-fiber** - Three.js React integration (ready)
- **framer-motion** - Smooth animations
- **react-type-animation** - Typing effects

### **Code Quality & CI/CD**
- **ESLint** - Strict linting with TypeScript rules
- **Prettier** - Code formatting with Tailwind support
- **GitHub Actions** - Automated CI/CD pipeline
- **TypeScript Strict Mode** - Maximum type safety

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ or 20+
- npm or yarn

### **Installation**

```bash
# Clone the repository
git clone https://github.com/yashsuthar/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server with Turbopack

# Building
npm run build        # Create production build
npm run start        # Start production server

# Code Quality & Development Scripts
npm run lint         # Run ESLint with strict rules
npm run lint:fix     # Auto-fix ESLint issues
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run ci          # Run all quality checks + build
npm run prepare     # Format and fix before commit

# Testing
npm test             # Run tests (placeholder)
```

## 📁 **Project Structure**

```
portfolio/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── terminal/        # Terminal-related components
│   │   ├── Loader.tsx       # BIOS boot loader
│   │   ├── Navbar.tsx       # Navigation bar
│   │   ├── Footer.tsx       # Footer with social links
│   │   ├── ThreeDCard.tsx   # 3D card placeholder
│   │   └── SnakeGame.tsx    # Snake game component
│   ├── hooks/               # Custom React hooks
│   │   ├── useTerminal.ts   # Terminal state management
│   │   └── useResponsive.ts # Responsive layout handling
│   ├── utils/               # Utility functions
│   │   └── commandHandlers.ts # Terminal command implementations
│   ├── data/                # Static data
│   │   └── portfolio.ts     # Portfolio content
│   └── types/               # TypeScript definitions
│       └── index.ts         # All type definitions
├── public/                  # Static assets
├── .github/workflows/       # CI/CD pipelines
└── docs/                    # Documentation
```

## 🎮 **Games & Interactive Features**

### **Snake Game**
- Full ASCII snake game implementation
- Score tracking with localStorage high scores
- Mobile touch controls and desktop keyboard controls
- Pause/resume functionality
- Game over screen with restart options

### **Terminal Commands**
- **System**: ls, pwd, cd, cat, grep, whoami, date, clear
- **Portfolio**: about, skills, experience, projects, contact
- **Fun**: neofetch, cowsay, figlet, fortune, cmatrix, snake
- **Help**: help, man [command], history

## 📱 **Mobile Experience**

- **Swipe Navigation**: Vertical swipes to switch between terminal and 3D card
- **Touch Controls**: Snake game supports swipe gestures
- **Responsive UI**: Command suggestions and mobile-optimized terminal
- **Panel Indicators**: Clear visual feedback for active panels

## 🔧 **Development Standards**

### **Code Quality**
- **TypeScript Strict Mode**: No implicit any, strict null checks
- **ESLint Rules**: Maximum code quality enforcement
- **Prettier Integration**: Consistent code formatting
- **Zero Warnings Policy**: Build fails on any warnings

### **Performance**
- **Dynamic Imports**: Code splitting for terminal and 3D components
- **Lazy Loading**: Components loaded on demand
- **Memory Management**: Proper cleanup of timers and event listeners
- **Optimized Builds**: Next.js production optimizations

### **Accessibility**
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Sufficient color contrast ratios
- **Focus Management**: Proper focus handling

## 🚀 **Deployment**

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Manual Deployment**
```bash
# Build the project
npm run build

# The 'out' directory contains the static files
# Upload to your hosting provider
```

## 🛠️ **Customization**

### **Portfolio Data**
Edit `src/data/portfolio.ts` to update:
- Personal information
- Skills and technologies
- Work experience
- Projects and certifications
- Social media links

### **3D Card Integration**
The `ThreeDCard` component is ready for your custom 3D implementation:
1. Install Three.js dependencies
2. Replace the placeholder content
3. Add your 3D scene and animations

### **Terminal Commands**
Add new commands in `src/utils/commandHandlers.ts`:
```typescript
export const commandHandlers = {
  'your-command': (args, session) => ({
    type: 'text',
    content: 'Your command output',
    timestamp: new Date()
  })
};
```

## 🎨 **Design Philosophy**

- **Terminal Aesthetic**: Linux/Unix terminal feel with modern web technologies
- **Green Matrix Theme**: Nostalgic hacker/developer aesthetic
- **Interactive Experience**: Portfolio as an explorable environment
- **Performance First**: Optimized for speed and user experience
- **Code Quality**: Enterprise-level development standards

## 📈 **CI/CD Pipeline**

### GitHub Actions Workflows

#### **Main CI Workflow** (`.github/workflows/ci.yml`)
- **Multi-Node Testing**: Tests on Node.js 18.x and 20.x
- **Type Checking**: Strict TypeScript validation with `tsc --noEmit --strict`
- **Linting**: ESLint with zero warnings policy (`--max-warnings=0`)
- **Code Formatting**: Prettier consistency checks
- **Testing**: Automated test execution
- **Build Verification**: Ensures production builds succeed
- **Security Auditing**: npm audit for vulnerabilities
- **Build Artifacts**: Uploads build files for inspection

#### **Auto-Format Workflow** (`.github/workflows/format.yml`)
- **Automatic Code Formatting**: Detects and fixes formatting issues
- **Auto-Commit**: Commits formatting changes back to the branch
- **Pull Request Support**: Works on both pushes and PRs

### Quality Standards
- **Zero ESLint Warnings**: Strict code quality enforcement
- **100% TypeScript Coverage**: All code is strictly typed
- **Prettier Formatting**: Consistent code style across the project
- **Pre-commit Hooks**: Local quality checks before commits

### Development Workflow
```bash
# Local development with quality checks
npm run ci          # Run full CI pipeline locally
npm run prepare     # Auto-format and fix issues
npm run lint:fix    # Fix ESLint issues automatically
```

## 🔧 **Code Quality Tools**

### **TypeScript Configuration**
- Strict mode enabled with comprehensive type checking
- Zero implicit any types allowed
- Strict null checks and unused variable detection

### **ESLint Configuration**
- Extends Next.js recommended rules
- TypeScript-specific linting rules
- Custom rules for consistent code style
- Integration with Prettier for formatting

### **Prettier Configuration**
- Tailwind CSS class sorting
- Consistent indentation and formatting
- Automatic trailing commas and semicolons
- Cross-platform line ending normalization

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Follow the coding standards
4. Ensure all tests pass
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 **Contact**

- **Email**: hello@yashsuthar.com
- **LinkedIn**: [linkedin.com/in/yashsuthar](https://linkedin.com/in/yashsuthar)
- **GitHub**: [github.com/yashsuthar](https://github.com/yashsuthar)

---

**Built with ❤️ and modern web technologies**

*This portfolio showcases the intersection of classic terminal interfaces with modern web development, creating a unique and memorable user experience.*
