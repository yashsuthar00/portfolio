import { portfolioData } from '../../data/portfolio';
import { executeCommand } from '../testCommandRouter';

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
});

describe('Command Handlers (Async)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('help command', () => {
    it('should return help text for help command', async () => {
      const result = await executeCommand('help');

      expect(result).toContain('Available commands:');
      // 'help' intentionally isn't listed among the commands (you just ran it).
      expect(result).toContain('about');
      expect(result).toContain('skills');
      expect(result).toContain('projects');
      expect(result).toContain('contact');
      expect(result).toContain('resume');
      expect(result).toContain('social');
    });
  });

  describe('about command', () => {
    it('should return about information', async () => {
      const result = await executeCommand('about');

      expect(result).toContain(portfolioData.name);
      expect(result).toContain(portfolioData.title);
      expect(result).toContain(portfolioData.description);
    });
  });

  describe('skills command', () => {
    it('should return skills information', async () => {
      const result = await executeCommand('skills');

      expect(result).toContain('Technical Skills');
      portfolioData.skills.forEach(category => {
        expect(result).toContain(category.name);
        category.skills.forEach(skill => {
          expect(result).toContain(skill);
        });
      });
    });
  });

  describe('projects command', () => {
    it('should return projects information', async () => {
      const result = await executeCommand('projects');

      expect(result).toContain('Recent Projects');
      portfolioData.projects.forEach(project => {
        expect(result).toContain(project.title);
        expect(result).toContain(project.description);
      });
    });
  });

  describe('contact command', () => {
    it('should return contact information', async () => {
      const result = await executeCommand('contact');

      expect(result).toContain('Contact Information');
      expect(result).toContain(portfolioData.contact.email);
    });
  });

  describe('social command', () => {
    it('should return social links', async () => {
      const result = await executeCommand('social');

      expect(result).toContain('Social Media Commands');
      portfolioData.social.forEach(social => {
        expect(result).toContain(social.name);
        expect(result).toContain(social.command);
      });
    });
  });

  describe('resume command', () => {
    it('should handle resume command', async () => {
      const result = await executeCommand('resume');

      expect(result.toLowerCase()).toMatch(/resume|cv/);
    });
  });

  describe('clear command', () => {
    it('should return clear command message', async () => {
      const result = await executeCommand('clear');

      expect(result).toBe('CLEAR_TERMINAL');
    });
  });

  describe('unknown command', () => {
    it('should return error message for unknown command', async () => {
      const result = await executeCommand('unknown');

      expect(result).toContain('Command not found');
      expect(result).toContain('help');
    });

    it('should handle empty command', async () => {
      const result = await executeCommand('');

      expect(result).toContain('Command not found');
    });

    it('should handle whitespace-only command', async () => {
      const result = await executeCommand('   ');

      expect(result).toContain('Command not found');
    });

    it('should trim command input', async () => {
      const result = await executeCommand('  help  ');

      expect(result).toContain('Available commands:');
    });
  });

  describe('case sensitivity', () => {
    it('should handle uppercase commands', async () => {
      const result = await executeCommand('HELP');

      expect(result).toContain('Available commands:');
    });

    it('should handle mixed case commands', async () => {
      const result = await executeCommand('HeLp');

      expect(result).toContain('Available commands:');
    });
  });
});
