# Development Setup & Code Quality

## Code Formatting & Quality Tools

This project uses a comprehensive code quality setup with automatic formatting and linting:

### Tools Used
- **Prettier**: Code formatting for consistent style
- **ESLint**: Code linting for error detection and best practices
- **TypeScript**: Static type checking
- **Jest**: Unit testing
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files only

### Available Scripts

#### Formatting
```bash
# Format all files
npm run format

# Check if files are properly formatted
npm run format:check

# Format all files + fix ESLint issues
npm run format:all

# Format only staged files (used by pre-commit hook)
npm run format:staged
```

#### Linting
```bash
# Run ESLint checks
npm run lint

# Run ESLint and auto-fix issues
npm run lint:fix
```

#### Type Checking
```bash
# Run TypeScript type checking
npm run type-check
```

#### Testing
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

#### Complete CI Pipeline
```bash
# Run all checks (type-check, lint, format-check, test, build)
npm run ci
```

## Pre-commit Hooks

The project uses Husky to run pre-commit hooks that automatically:

1. **Format staged files** with Prettier
2. **Fix ESLint issues** in staged files
3. **Run type checking** to catch TypeScript errors
4. **Run tests** to ensure nothing is broken

### What Happens on Commit

When you run `git commit`, the pre-commit hook will:

1. **lint-staged**: Format and fix only the files you're committing
2. **Type check**: Ensure no TypeScript errors
3. **Test**: Run the full test suite
4. **Prevent commit** if any step fails

### Manual Pre-commit Check

You can manually run the pre-commit checks:

```bash
# Run the exact same checks as the pre-commit hook
.husky/pre-commit
```

## File Formatting Rules

### Prettier Configuration
- 2 spaces for indentation
- Single quotes for strings
- Trailing commas where valid
- Automatic semicolon insertion
- Line width: 80 characters

### ESLint Rules
- TypeScript strict mode
- React best practices
- Next.js specific rules
- No console statements (warnings)
- Maximum 0 warnings allowed

## Troubleshooting

### Formatting Issues
If you see formatting errors:

```bash
# Fix all formatting issues at once
npm run format:all
```

### Pre-commit Hook Not Working
If the pre-commit hook isn't running:

```bash
# Reinstall Husky hooks
npm run prepare
```

### Bypassing Pre-commit (Not Recommended)
Only in emergency situations:

```bash
git commit --no-verify -m "emergency commit"
```

## IDE Setup

### VS Code
Install these extensions for the best development experience:

- Prettier - Code formatter
- ESLint
- TypeScript and JavaScript Language Features
- Jest

### Settings
Add to your VS Code settings.json:

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

This ensures code is automatically formatted and linted as you work!
