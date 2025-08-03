import { CommandOutput, TerminalSession, CommandHandler } from '@/types';
import { portfolioData } from '@/data/portfolio';

export const commandHandlers: Record<string, CommandHandler> = {
  // Portfolio Commands
  help: () => ({
    type: 'text',
    content: `🎯 Yash Suthar Portfolio Terminal - Available Commands:

📋 PORTFOLIO COMMANDS:
  about         - About Yash Suthar
  skills        - Technical skills and expertise
  experience    - Professional work experience  
  education     - Educational background
  projects      - Portfolio projects and demos
  certifications- Professional certifications
  contact       - Contact information
  funfact       - Random fun facts

🖥️  SYSTEM COMMANDS:
  ls            - List directory contents
  pwd           - Show current directory
  cd [dir]      - Change directory
  cat [file]    - Display file contents
  grep [text]   - Search for text
  whoami        - Show current user
  date          - Show current date and time
  clear         - Clear terminal screen

🎮 FUN COMMANDS:
  neofetch      - System information with style
  cmatrix       - Digital rain effect
  figlet [text] - ASCII art text
  cowsay [text] - Make a cow say something
  fortune       - Random wisdom
  snake         - Play snake game

💡 HELP & NAVIGATION:
  man [cmd]     - Manual page for command
  history       - Show command history
  alias         - Show command aliases
  
Type any command to explore! Pro tip: Try 'neofetch' for a cool system overview.`,
    timestamp: new Date()
  }),

  about: () => ({
    type: 'text',
    content: `👨‍💻 About Yash Suthar
${'='.repeat(50)}

${portfolioData.personal.bio}

📍 Location: ${portfolioData.personal.location}
📧 Email: ${portfolioData.personal.email}
💼 Current Role: ${portfolioData.personal.title}

🚀 What I Do:
• Full-stack web development with modern technologies
• Building scalable applications and user experiences  
• Contributing to open source projects
• Continuous learning and experimenting with new tech

🎯 Passion:
I'm passionate about creating innovative solutions that make a difference. 
Always excited to tackle challenging problems and learn new technologies.

💡 Fun Fact: 
I believe great code is like poetry - it should be beautiful, efficient, and meaningful.

Type 'skills' to see my technical expertise!`,
    timestamp: new Date()
  }),

  skills: () => {
    const skillsText = portfolioData.skills.map(category => 
      `${category.category}:\n  ${category.items.join(' • ')}`
    ).join('\n\n');

    return {
      type: 'text',
      content: `💻 Technical Skills & Expertise
${'='.repeat(50)}

${skillsText}

🏆 Proficiency Levels:
⭐⭐⭐⭐⭐ Expert     ⭐⭐⭐⭐☆ Advanced
⭐⭐⭐☆☆ Intermediate ⭐⭐☆☆☆ Learning

Type 'experience' to see how I've applied these skills professionally!`,
      timestamp: new Date()
    };
  },

  experience: () => {
    const experienceText = portfolioData.experience.map((exp, index) => 
      `${index + 1}. ${exp.position} at ${exp.company}
   Duration: ${exp.duration}
   
   Key Achievements:
   ${exp.description.map(desc => `   • ${desc}`).join('\n')}
   
   Technologies: ${exp.technologies.join(', ')}`
    ).join('\n\n');

    return {
      type: 'text',
      content: `🏢 Professional Experience
${'='.repeat(50)}

${experienceText}

💼 Career Highlights:
• Successfully delivered projects serving 100k+ users
• Led development teams and mentored junior developers
• Implemented best practices for code quality and performance
• Collaborated with cross-functional teams on product strategy

Type 'projects' to see some of my featured work!`,
      timestamp: new Date()
    };
  },

  education: () => {
    const educationText = portfolioData.education.map((edu, index) => 
      `${index + 1}. ${edu.degree}
   Institution: ${edu.institution}
   Duration: ${edu.duration}
   ${edu.gpa ? `GPA: ${edu.gpa}` : ''}
   
   ${edu.achievements ? `Achievements:\n   ${edu.achievements.map(ach => `• ${ach}`).join('\n   ')}` : ''}`
    ).join('\n\n');

    return {
      type: 'text',
      content: `🎓 Educational Background
${'='.repeat(50)}

${educationText}

📚 Academic Focus:
• Computer Science fundamentals and algorithms
• Software engineering principles and practices
• Database systems and web technologies
• Project management and team collaboration

Type 'certifications' to see my professional certifications!`,
      timestamp: new Date()
    };
  },

  projects: () => {
    const featuredProjects = portfolioData.projects.filter(p => p.featured);
    const otherProjects = portfolioData.projects.filter(p => !p.featured);

    const projectText = (projects: typeof portfolioData.projects, title: string) => 
      `${title}:\n${projects.map((project, index) => 
        `${index + 1}. ${project.name}
   ${project.description}
   Tech Stack: ${project.technologies.join(', ')}
   ${project.githubUrl ? `🔗 GitHub: ${project.githubUrl}` : ''}
   ${project.liveUrl ? `🌐 Live: ${project.liveUrl}` : ''}`
      ).join('\n\n')}`;

    return {
      type: 'text',
      content: `🚀 Portfolio Projects
${'='.repeat(50)}

${projectText(featuredProjects, '⭐ Featured Projects')}

${otherProjects.length > 0 ? '\n' + projectText(otherProjects, '📁 Other Projects') : ''}

💡 Project Philosophy:
I believe in building projects that solve real problems and provide value.
Each project is an opportunity to learn new technologies and improve my skills.

Type 'contact' to discuss potential collaborations!`,
      timestamp: new Date()
    };
  },

  certifications: () => {
    const certsText = portfolioData.certifications.map((cert, index) => 
      `${index + 1}. ${cert.name}
   Issuer: ${cert.issuer}
   Year: ${cert.date}
   ${cert.url ? `🔗 Verify: ${cert.url}` : ''}`
    ).join('\n\n');

    return {
      type: 'text',
      content: `🏅 Professional Certifications
${'='.repeat(50)}

${certsText}

📈 Continuous Learning:
I believe in staying updated with the latest technologies and best practices.
These certifications represent my commitment to professional growth and excellence.

Type 'skills' to see how these certifications enhance my technical abilities!`,
      timestamp: new Date()
    };
  },

  contact: () => {
    const socialText = portfolioData.socialLinks.map(social => 
      `${social.platform}: ${social.url}`
    ).join('\n');

    return {
      type: 'text',
      content: `📱 Get In Touch
${'='.repeat(50)}

📧 Email: ${portfolioData.personal.email}
📍 Location: ${portfolioData.personal.location}

🌐 Social & Professional Links:
${socialText}

💼 Open to Opportunities:
• Full-time software development roles
• Freelance and consulting projects  
• Open source collaborations
• Speaking at tech events

📬 Preferred Contact Method:
For professional inquiries: Email
For quick questions: LinkedIn

Looking forward to connecting with you! 🤝`,
      timestamp: new Date()
    };
  },

  funfact: () => {
    const facts = [
      "I once debugged a issue that turned out to be a missing semicolon... after 3 hours 😅",
      "My first 'Hello World' program had a syntax error. Some things never change!",
      "I can type faster with my eyes closed than some people with their eyes open 👀",
      "Coffee consumption directly correlates with code quality in my case ☕",
      "I've probably googled 'how to center a div' more times than I care to admit",
      "My rubber duck debugging buddy has helped solve more bugs than Stack Overflow",
      "I once spent a day optimizing code only to realize the bottleneck was my internet connection",
      "The best code I've ever written was deleted by accident. Murphy's Law in action!"
    ];

    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    return {
      type: 'text',
      content: `🎭 Random Fun Fact
${'='.repeat(50)}

${randomFact}

Type 'funfact' again for another one! 🎲`,
      timestamp: new Date()
    };
  },

  // System Commands
  whoami: (_, session) => ({
    type: 'text',
    content: session.user,
    timestamp: new Date()
  }),

  pwd: (_, session) => ({
    type: 'text',
    content: session.currentDirectory,
    timestamp: new Date()
  }),

  date: () => ({
    type: 'text',
    content: new Date().toString(),
    timestamp: new Date()
  }),

  ls: () => ({
    type: 'text',
    content: `total 8
drwxr-xr-x 2 yash yash 4096 Aug  3 15:30 documents/
drwxr-xr-x 2 yash yash 4096 Aug  3 15:30 projects/
drwxr-xr-x 2 yash yash 4096 Aug  3 15:30 skills/
-rw-r--r-- 1 yash yash  256 Aug  3 15:30 about.txt
-rw-r--r-- 1 yash yash  512 Aug  3 15:30 resume.pdf
-rw-r--r-- 1 yash yash  128 Aug  3 15:30 contact.txt`,
    timestamp: new Date()
  }),

  clear: () => ({
    type: 'text',
    content: '',
    timestamp: new Date()
  }),

  // Fun Commands
  neofetch: () => ({
    type: 'text',
    content: `                   -\`                 yash@portfolio 
                  .o+\`                 -------------- 
                 \`ooo/                 OS: Portfolio Linux x86_64 
                \`+oooo:                Host: Yash Suthar Terminal 
               \`+oooooo:               Kernel: 6.5.0-portfolio 
               -+oooooo+:              Uptime: ${Math.floor(Date.now() / 86400000)} days 
             \`/:-:++oooo+:             Packages: 42 (skills) 
            \`/++++/+++++++:            Shell: portfolio-shell 
           \`/++++++++++++++:           Resolution: Full-stack 
          \`/+++ooooooooooooo/\`         DE: Terminal Interface 
         ./ooosssso++osssssso+\`        WM: Split Layout 
        .oossssso-\`\`\`\`/ossssss+\`       Theme: Matrix Green 
       -osssssso.      :ssssssso.      Icons: Font Awesome 
      :osssssss/        osssso+++.     Terminal: xterm.js 
     /ossssssss/        +ssssooo/-     CPU: Coffee Lake (8) @ 3.60GHz 
   \`/ossssso+/:-        -:/+osssso+-   GPU: Imagination Graphics 
  \`+sso+:-\`                 \`.-/+oso:  Memory: 16384MiB / 32768MiB 
 \`++:.                           \`-/+/
 .\`                                 \`/`,
    timestamp: new Date()
  }),

  figlet: (args) => {
    const text = args.join(' ') || 'Yash Suthar';
    // Simple ASCII art generation (basic implementation)
    const asciiText = text.split('').map(char => {
      if (char === ' ') return '     ';
      return `
 ██████ 
██    ██
██    ██
██    ██
 ██████ `.trim();
    }).join('\n');

    return {
      type: 'text',
      content: `ASCII Art for "${text}":
${asciiText}

Note: This is a simplified figlet implementation. Full ASCII art coming soon!`,
      timestamp: new Date()
    };
  },

  cowsay: (args) => {
    const message = args.join(' ') || 'Hello from Yash!';
    const messageLength = message.length;
    
    return {
      type: 'text',
      content: ` ${'_'.repeat(messageLength + 2)}
< ${message} >
 ${'-'.repeat(messageLength + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,
      timestamp: new Date()
    };
  },

  fortune: () => {
    const fortunes = [
      "The best way to predict the future is to implement it.",
      "Code never lies, comments sometimes do.",
      "A bug in the code is worth two in the documentation.",
      "Programming is the art of telling another human what one wants the computer to do.",
      "The most important property of a program is whether it accomplishes the intention of its user.",
      "Simplicity is the ultimate sophistication.",
      "Make it work, make it right, make it fast.",
      "Code is like humor. When you have to explain it, it's bad."
    ];

    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

    return {
      type: 'text',
      content: `🔮 Fortune Says:
"${randomFortune}"`,
      timestamp: new Date()
    };
  },

  snake: () => ({
    type: 'component',
    content: 'SNAKE_GAME_COMPONENT',
    timestamp: new Date()
  }),

  cmatrix: () => ({
    type: 'text',
    content: `🌊 Digital Rain Effect
${'='.repeat(50)}

Starting Matrix-style digital rain...
(This would show falling green characters in a real implementation)

01001000 01100101 01101100 01101100 01101111
01010111 01101111 01110010 01101100 01100100
01011001 01000001 01010011 01001000 00100000
01010011 01010101 01010100 01001000 01000001
01010010 00100000 01010000 01001111 01010010
01010100 01000110 01001111 01001100 01001001
01001111 00100000 01000101 01011000 01010000
01000101 01010010 01001001 01000101 01001110
01000011 01000101 00100000 01000101 01001110
01001000 01000001 01001110 01000011 01000101

Press Ctrl+C to stop the matrix effect.`,
    timestamp: new Date()
  }),

  history: (_, session) => ({
    type: 'text',
    content: session.history.map((cmd, index) => 
      `${index + 1}  ${cmd}`
    ).join('\n'),
    timestamp: new Date()
  }),

  man: (args) => {
    const command = args[0];
    const manPages: Record<string, string> = {
      help: 'help - Display available commands and their descriptions',
      about: 'about - Show information about Yash Suthar',
      skills: 'skills - Display technical skills and expertise',
      experience: 'experience - Show professional work experience',
      projects: 'projects - Display portfolio projects',
      contact: 'contact - Show contact information and social links',
      ls: 'ls - List directory contents',
      clear: 'clear - Clear the terminal screen',
      neofetch: 'neofetch - Display system information with ASCII art'
    };

    if (!command) {
      return {
        type: 'text',
        content: 'man: What manual page do you want?\nUsage: man [command]',
        timestamp: new Date()
      };
    }

    const manPage = manPages[command];
    if (manPage) {
      return {
        type: 'text',
        content: `Manual page for ${command}:
${manPage}

Type 'help' to see all available commands.`,
        timestamp: new Date()
      };
    }

    return {
      type: 'text',
      content: `No manual entry for ${command}`,
      timestamp: new Date()
    };
  }
};

export async function executeCommand(
  command: string,
  args: string[],
  session: TerminalSession
): Promise<CommandOutput> {
  const handler = commandHandlers[command.toLowerCase()];
  
  if (handler) {
    return handler(args, session);
  }

  // Command not found
  return {
    type: 'text',
    content: `Command '${command}' not found. Type 'help' for available commands.`,
    timestamp: new Date()
  };
}
