import { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  name: 'Yash Suthar',
  title: 'Software Engineer',
  description:
    'Passionate developer crafting digital experiences with modern technologies. Specialized in React, Node.js, and cloud architecture.',
  education: 'Computer Science Engineering',
  experience: '1+ years in Software Engineering',

  skills: [
    {
      name: 'Programming Languages',
      skills: ['C++', 'Java', 'Python', 'JavaScript'],
    },
    {
      name: 'Frameworks and Libraries',
      skills: [
        'Node.js',
        'Express.js',
        'React.js',
        'Redux',
        'Socket.io',
        'threeJs',
        'R3F',
      ],
    },
    {
      name: 'Database Management',
      skills: ['MongoDB', 'MySQL', 'Hibernate ORM'],
    },
    {
      name: 'Version Control',
      skills: ['Git', 'GitHub'],
    },
    {
      name: 'DevOps & Automation',
      skills: ['CI/CD', 'Docker', 'kafka', 'RabbitMQ', 'AWS'],
    },
    {
      name: 'Other',
      skills: ['Microservices', 'OOPs', 'Data Structures', 'Algorithms'],
    },
  ],

  projects: [
    {
      title: 'NextGen-HR',
      description:
        'AI-interview system (Jan–Apr 2025). AI-based recruitment platform that scores resumes (ATS) and conducts AI-driven interviews. Utilized a microservices architecture to handle the full job application lifecycle from apply → screening → interview.',
      technologies: ['Microservices', 'MERN', 'Flask', 'Docker', 'AWS'],
    },
    {
      title: 'Collab-IDE',
      description:
        'Code collaboration platform (Apr–May 2025). A real-time collaborative coding environment with an online editor, shared rooms, file explorer, and friend connections; supports live editing and remote compilation.',
      technologies: ['MERN', 'Monaco Editor', 'Piston', 'WebSockets'],
    },
  ],

  contact: {
    email: 'hello@yashsuthar.com',
    personalEmail: 'yashsuthar0309@gmail.com',
  },

  social: [
    {
      name: 'GitHub',
      url: 'https://github.com/yashsuthar00',
      command: 'github',
      icon: '🐙',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/yashsuthar00',
      command: 'linkedin',
      icon: '💼',
    },
    {
      name: 'LeetCode',
      url: 'https://leetcode.com/yashsuthar00',
      command: 'leetcode',
      icon: '🧩',
    },
    {
      name: 'CodeForces',
      url: 'https://codeforces.com/profile/yashsuthar00',
      command: 'codeforces',
      icon: '⚡',
    },
  ],
};
