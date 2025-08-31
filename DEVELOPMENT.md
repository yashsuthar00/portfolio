# Development Setup Guide

This project follows industry-standard development practices with automated code quality checks, formatting, and CI/CD pipelines.

## 🛠️ Development Tools

### Code Quality

- **ESLint**: TypeScript and React code linting
- **Prettier**: Code formatting with Tailwind CSS support
- **TypeScript**: Static type checking
- **Husky**: Git hooks for pre-commit validation
- **lint-staged**: Run linters on staged files only
- **Commitlint**: Conventional commit message validation

### CI/CD Pipeline

- **GitHub Actions**: Automated testing and deployment
- **Quality Checks**: TypeScript, ESLint, Prettier, Build validation
- **Security Audit**: npm audit for vulnerabilities
- **Multi-Node Testing**: Node.js 18 & 20 compatibility

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

```bash
npm install
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check

# Type checking
npm run type-check

# Commit with conventional format
npm run commit
```

## 📝 Commit Guidelines

This project uses [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Types

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

### Examples

```bash
feat: add responsive navigation component
fix: resolve mobile layout overflow issue
docs: update development setup guide
style: format code with prettier
refactor: extract reusable hooks
```

## 🔄 Git Workflow

### Pre-commit Hooks

Automatically runs on every commit:

1. **lint-staged**: Runs ESLint and Prettier on staged files
2. **commitlint**: Validates commit message format

### Pre-push Hooks

- Type checking with TypeScript
- Full test suite execution
- Build validation

## 🎯 Code Standards

### File Structure

```
src/
├── app/           # Next.js app router
├── components/    # Reusable React components
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── data/          # Static data and configuration
```

### Naming Conventions

- **Components**: PascalCase (`TerminalComponent.tsx`)
- **Hooks**: camelCase with use prefix (`useResponsive.ts`)
- **Types**: PascalCase (`TerminalConfig`)
- **Files**: camelCase or kebab-case
- **Variables**: camelCase

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings, double for JSX attributes
- **Semicolons**: Always required
- **Trailing commas**: ES5 compatible
- **Line length**: 80 characters max

## 🔧 VSCode Setup

### Recommended Extensions

The `.vscode/extensions.json` file includes:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Hero
- Auto Rename Tag
- Path Intellisense
- GitLens

### Settings

Auto-formatting and linting on save is configured in `.vscode/settings.json`.

## 🚦 CI/CD Pipeline

### Quality Check Workflow

Runs on every push and pull request:

- **Multi-Node Testing**: Node.js 18 & 20
- **TypeScript Compilation**: `npm run type-check`
- **Code Linting**: `npm run lint`
- **Code Formatting**: `npm run format:check`
- **Build Validation**: `npm run build`
- **Security Audit**: `npm audit`

### Commit Message Validation

Validates all commit messages in pull requests against conventional commit format.

### Deployment

Production deployment is triggered automatically on pushes to the `main` branch after all quality checks pass.

## 🛡️ Security

### Automated Security Checks

- **npm audit**: Checks for known vulnerabilities
- **Dependency scanning**: GitHub Dependabot alerts
- **Code quality**: ESLint security rules

### Best Practices

- Regular dependency updates
- No secrets in code
- Environment variables for sensitive data
- Regular security audits

## 🐛 Troubleshooting

### Common Issues

**Husky hooks not running:**

```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

**ESLint errors:**

```bash
npm run lint:fix
```

**TypeScript errors:**

```bash
npm run type-check
```

**Formatting issues:**

```bash
npm run format
```

### Getting Help

1. Check this README
2. Review error messages carefully
3. Run `npm run type-check` for TypeScript issues
4. Use `npm run lint:fix` for auto-fixable ESLint issues
5. Create an issue for unresolved problems

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
