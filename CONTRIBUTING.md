# Contributing to Yash Suthar Portfolio

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or 20.x
- npm (comes with Node.js)
- Git

### Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/portfolio.git
   cd portfolio
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## 💻 Development Workflow

### Before Making Changes
1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Ensure all quality checks pass:
   ```bash
   npm run ci
   ```

### During Development
- Follow the existing code style and patterns
- Write descriptive commit messages
- Test your changes thoroughly
- Use TypeScript strictly (no `any` types)

### Quality Checks
Run these commands before committing:
```bash
npm run format        # Auto-format code
npm run lint:fix      # Fix linting issues
npm run type-check    # Verify TypeScript
npm run build         # Test production build
```

Or run all checks at once:
```bash
npm run ci
```

### Code Style Guidelines

#### TypeScript
- Use strict typing - no `any` types
- Define interfaces for all props and state
- Use proper return types for functions
- Enable all strict TypeScript compiler options

#### React Components
- Use functional components with hooks
- Follow the existing file structure
- Use proper TypeScript interfaces for props
- Include accessibility attributes (ARIA)

#### Styling
- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Test on multiple screen sizes

#### Terminal Commands
- Follow the existing command pattern in `commandHandlers.ts`
- Include help text for new commands
- Test commands on both desktop and mobile
- Ensure commands work with screen readers

## 🧪 Testing

### Current Test Setup
- Basic test placeholder exists
- Manual testing required for now
- Future: Unit tests with Jest/Testing Library

### Testing Checklist
- [ ] Desktop browser testing (Chrome, Firefox, Safari)
- [ ] Mobile browser testing (iOS Safari, Android Chrome)
- [ ] Terminal functionality on all devices
- [ ] Accessibility testing with screen readers
- [ ] Performance testing (Lighthouse)

## 📝 Commit Guidelines

### Commit Message Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples
```
feat(terminal): add new figlet command
fix(mobile): resolve terminal touch scrolling issue
docs(readme): update installation instructions
style: format code with prettier
```

## 🔄 Pull Request Process

1. **Create PR**: Submit a pull request to the `main` branch
2. **CI Checks**: Ensure all GitHub Actions pass
3. **Code Review**: Wait for code review feedback
4. **Address Feedback**: Make requested changes
5. **Merge**: PR will be merged after approval

### PR Checklist
- [ ] All CI checks pass
- [ ] Code follows style guidelines
- [ ] Changes are tested on desktop and mobile
- [ ] Documentation is updated if needed
- [ ] Commit messages follow the guidelines

## 🐛 Bug Reports

When reporting bugs, please include:
- Browser and version
- Device and OS
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/recordings if applicable

## 💡 Feature Requests

For new features:
- Check existing issues/PRs first
- Describe the use case clearly
- Consider implementation complexity
- Discuss before starting large changes

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [xterm.js Documentation](https://xtermjs.org/)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow professional communication standards

## 📞 Getting Help

- Create an issue for bugs or questions
- Check existing documentation first
- Use descriptive titles and details

Thank you for contributing! 🎉
