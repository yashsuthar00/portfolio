import {
  handleAboutCommand,
  handleContactCommand,
  handleHelpCommand,
  handleProjectsCommand,
  handleResumeCommand,
  handleSkillsCommand,
  handleSocialCommand,
  TerminalWriter,
} from './commandHandlers';

// Simple command router for testing
export const executeCommand = (command: string): string => {
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
      handleHelpCommand(mockWriter);
      break;
    case 'about':
      handleAboutCommand(mockWriter);
      break;
    case 'skills':
      handleSkillsCommand(mockWriter);
      break;
    case 'projects':
      handleProjectsCommand(mockWriter);
      break;
    case 'contact':
      handleContactCommand(mockWriter);
      break;
    case 'social':
      handleSocialCommand(mockWriter);
      break;
    case 'resume':
      handleResumeCommand(mockWriter);
      break;
    case 'clear':
      return 'CLEAR_TERMINAL';
    default:
      return `Command not found: ${command}. Type "help" for available commands.`;
  }

  return output;
};
