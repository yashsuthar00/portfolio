import { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  name: 'Yash Suthar',
  title: 'Full Stack Developer',
  description: 'Passionate developer crafting digital experiences with modern technologies. Specialized in React, Node.js, and cloud architecture.',
  education: 'Computer Science Engineering',
  experience: '1+ years in web development',
  
  skills: [
    {
      name: 'Frontend',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Material-UI', 'Three.js', 'Framer Motion']
    },
    {
      name: 'Backend',
      skills: ['Node.js', 'Express.js', 'Python', 'Django', 'MongoDB', 'PostgreSQL']
    },
    {
      name: 'Tools & Technologies',
      skills: ['Git', 'Docker', 'AWS', 'Vercel', 'Netlify', 'Jest', 'Cypress']
    }
  ],
  
  projects: [
    {
      title: 'Interactive Terminal Portfolio',
      description: 'Built with Next.js, Three.js, and xterm.js. Features 3D graphics and real terminal functionality.',
      technologies: ['Next.js', 'Three.js', 'TypeScript', 'xterm.js', 'Tailwind CSS']
    },
    {
      title: 'Full-Stack Web Applications',
      description: 'E-commerce platforms with React and real-time chat applications.',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io']
    },
    {
      title: 'Open Source Contributions',
      description: 'Contributing to React ecosystem and building developer tools.',
      technologies: ['React', 'TypeScript', 'Open Source']
    }
  ],
  
  contact: {
    email: 'hello@yashsuthar.com',
    personalEmail: 'yashsuthar0309@gmail.com'
  },
  
  social: [
    {
      name: 'GitHub',
      url: 'https://github.com/yashsuthar00',
      command: 'github',
      icon: '🐙'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/yashsuthar00',
      command: 'linkedin',
      icon: '💼'
    },
    {
      name: 'LeetCode',
      url: 'https://leetcode.com/yashsuthar00',
      command: 'leetcode',
      icon: '🧩'
    },
    {
      name: 'CodeForces',
      url: 'https://codeforces.com/profile/yashsuthar00',
      command: 'codeforces',
      icon: '⚡'
    }
  ]
};