import { executeCommand } from '../testCommandRouter';
import { portfolioData } from '../../data/portfolio';

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
});

describe('Command Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('help command', () => {
    it('should return help text for help command', () => {
      const result = executeCommand('help');

      expect(result).toContain('Available commands:');
      expect(result).toContain('help');
      expect(result).toContain('about');
      expect(result).toContain('skills');
      expect(result).toContain('projects');
      expect(result).toContain('contact');
      expect(result).toContain('resume');
      expect(result).toContain('social');
    });
  });

  describe('about command', () => {
    it('should return about information', () => {
      const result = executeCommand('about');

      expect(result).toContain(portfolioData.name);
      expect(result).toContain(portfolioData.title);
      expect(result).toContain(portfolioData.description);
    });
  });

  describe('skills command', () => {
    it('should return skills information', () => {
      const result = executeCommand('skills');

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
    it('should return projects information', () => {
      const result = executeCommand('projects');

      expect(result).toContain('Recent Projects');
      portfolioData.projects.forEach(project => {
        expect(result).toContain(project.title);
        expect(result).toContain(project.description);
      });
    });
  });

  describe('contact command', () => {
    it('should return contact information', () => {
      const result = executeCommand('contact');

      expect(result).toContain('Contact Information');
      expect(result).toContain(portfolioData.contact.email);
    });
  });

  describe('social command', () => {
    it('should return social links', () => {
      const result = executeCommand('social');

      expect(result).toContain('Social Media Commands');
      portfolioData.social.forEach(social => {
        expect(result).toContain(social.name);
        expect(result).toContain(social.command);
      });
    });
  });

  describe('resume command', () => {
    it('should handle resume command', () => {
      const result = executeCommand('resume');

      expect(result.toLowerCase()).toMatch(/resume|cv/);
    });
  });

  describe('clear command', () => {
    it('should return clear command message', () => {
      const result = executeCommand('clear');

      expect(result).toBe('CLEAR_TERMINAL');
    });
  });

  describe('unknown command', () => {
    it('should return error message for unknown command', () => {
      const result = executeCommand('unknowncommand');

      expect(result).toContain('Command not found');
      expect(result).toContain('unknowncommand');
      expect(result).toContain('help');
    });

    it('should handle empty command', () => {
      const result = executeCommand('');

      expect(result).toContain('Command not found');
    });

    it('should handle whitespace-only command', () => {
      const result = executeCommand('   ');

      expect(result).toContain('Command not found');
    });

    it('should trim command input', () => {
      const result = executeCommand('  help  ');

      expect(result).toContain('Available commands:');
    });
  });

  describe('case sensitivity', () => {
    it('should handle uppercase commands', () => {
      const result = executeCommand('HELP');

      expect(result).toContain('Available commands:');
    });

    it('should handle mixed case commands', () => {
      const result = executeCommand('HeLp');

      expect(result).toContain('Available commands:');
    });
  });

  describe('command validation', () => {
    const validCommands = [
      'help',
      'about',
      'skills',
      'projects',
      'contact',
      'resume',
      'clear',
      'social',
    ];

    validCommands.forEach(command => {
      it(`should handle ${command} command correctly`, () => {
        const result = executeCommand(command);

        expect(result).toBeTruthy();
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    });
  });
});
