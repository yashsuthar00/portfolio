import {
  handleAboutCommand,
  handleCertificationsCommand,
  handleContactCommand,
  handleEducationCommand,
  handleExperienceCommand,
  handleHelpCommand,
  handleProjectsCommand,
  handleResumeCommand,
  handleSkillsCommand,
  handleSocialCommand,
  handleSudoCommand,
  handleWhoamiCommand,
  TerminalWriter,
} from './commandHandlers';

// Simple command router for testing
export const executeCommand = async (command: string): Promise<string> => {
  let output = '';
  const mockWriter: TerminalWriter = {
    write: (text: string) => {
      output += text;
    },
    clear: () => {
      output = '';
    },
  };

  const trimmedCommand = command.trim().toLowerCase();

  switch (trimmedCommand) {
    case 'help':
      await handleHelpCommand(mockWriter);
      break;
    case 'about':
      await handleAboutCommand(mockWriter);
      break;
    case 'skills':
      await handleSkillsCommand(mockWriter);
      break;
    case 'projects':
      await handleProjectsCommand(mockWriter);
      break;
    case 'contact':
      await handleContactCommand(mockWriter);
      break;
    case 'social':
      await handleSocialCommand(mockWriter);
      break;
    case 'experience':
      await handleExperienceCommand(mockWriter);
      break;
    case 'education':
      await handleEducationCommand(mockWriter);
      break;
    case 'certifications':
      await handleCertificationsCommand(mockWriter);
      break;
    case 'whoami':
      await handleWhoamiCommand(mockWriter);
      break;
    case 'sudo':
      await handleSudoCommand(mockWriter);
      break;
    case 'resume':
      await handleResumeCommand(mockWriter);
      break;
    case 'clear':
      return 'CLEAR_TERMINAL';
    default:
      return `Command not found: ${command}. Type "help" for available commands.`;
  }

  return output
    .replace(/\x1b\[[0-9;]*m/g, '') // Remove ANSI color codes
    .replace(/\r\n/g, '\n') // Convert CRLF to LF
    .replace(/\r/g, '\n') // Convert remaining CR to LF
    .replace(/·/g, ' ') // Replace middle dots with spaces
    .trim();
};
