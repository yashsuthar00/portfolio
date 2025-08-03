import { PortfolioData } from "@/types";

export const portfolioData: PortfolioData = {
  personal: {
    name: "Yash Suthar",
    title: "Software Developer",
    email: "yash@example.com", // Replace with actual email
    location: "India",
    bio: "Passionate software developer with expertise in full-stack development, specializing in modern web technologies and creating innovative solutions.",
  },
  skills: [
    {
      category: "Programming Languages",
      items: ["JavaScript", "TypeScript", "Python", "Java", "C++", "Go"],
    },
    {
      category: "Frontend",
      items: [
        "React",
        "Next.js",
        "Vue.js",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "Three.js",
      ],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "FastAPI",
        "Django",
        "PostgreSQL",
        "MongoDB",
        "Redis",
      ],
    },
    {
      category: "DevOps & Tools",
      items: [
        "Docker",
        "Kubernetes",
        "AWS",
        "Git",
        "GitHub Actions",
        "Jenkins",
        "Nginx",
      ],
    },
    {
      category: "Other",
      items: [
        "GraphQL",
        "REST APIs",
        "Microservices",
        "WebSockets",
        "PWA",
        "Testing",
      ],
    },
  ],
  experience: [
    {
      company: "Tech Company",
      position: "Senior Software Developer",
      duration: "2022 - Present",
      description: [
        "Led development of scalable web applications serving 100k+ users",
        "Implemented microservices architecture reducing deployment time by 60%",
        "Mentored junior developers and conducted code reviews",
        "Collaborated with cross-functional teams to deliver high-quality products",
      ],
      technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"],
    },
    {
      company: "Startup Inc",
      position: "Full Stack Developer",
      duration: "2020 - 2022",
      description: [
        "Built responsive web applications from concept to deployment",
        "Developed RESTful APIs and integrated third-party services",
        "Optimized application performance and user experience",
        "Participated in agile development processes",
      ],
      technologies: ["Vue.js", "Python", "PostgreSQL", "Redis", "Git"],
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Technology in Computer Science",
      duration: "2016 - 2020",
      gpa: "8.5/10",
      achievements: [
        "Dean's List for academic excellence",
        "Final year project on AI-based recommendation systems",
        "Active member of coding club and hackathon participant",
      ],
    },
  ],
  projects: [
    {
      name: "Interactive Portfolio Terminal",
      description:
        "A unique portfolio website with Linux terminal interface and 3D interactive elements built with Next.js and Three.js",
      technologies: [
        "Next.js",
        "TypeScript",
        "Three.js",
        "Xterm.js",
        "Tailwind CSS",
      ],
      githubUrl: "https://github.com/yashsuthar/portfolio",
      liveUrl: "https://yashsuthar.com",
      featured: true,
    },
    {
      name: "E-Commerce Platform",
      description:
        "Full-stack e-commerce solution with modern UI, secure payments, and admin dashboard",
      technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
      githubUrl: "https://github.com/yashsuthar/ecommerce",
      featured: true,
    },
    {
      name: "Task Management App",
      description:
        "Collaborative task management application with real-time updates and team features",
      technologies: ["Vue.js", "Express.js", "Socket.io", "PostgreSQL"],
      githubUrl: "https://github.com/yashsuthar/taskmanager",
      featured: false,
    },
  ],
  certifications: [
    {
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023",
      url: "https://aws.amazon.com/certification/",
    },
    {
      name: "React Developer Certification",
      issuer: "Meta",
      date: "2022",
      url: "https://developers.facebook.com/certification/",
    },
  ],
  socialLinks: [
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/yashsuthar",
      username: "yashsuthar",
    },
    {
      platform: "GitHub",
      url: "https://github.com/yashsuthar",
      username: "yashsuthar",
    },
    {
      platform: "LeetCode",
      url: "https://leetcode.com/yashsuthar",
      username: "yashsuthar",
    },
    {
      platform: "Codeforces",
      url: "https://codeforces.com/profile/yashsuthar",
      username: "yashsuthar",
    },
    {
      platform: "HackerRank",
      url: "https://hackerrank.com/yashsuthar",
      username: "yashsuthar",
    },
  ],
};
