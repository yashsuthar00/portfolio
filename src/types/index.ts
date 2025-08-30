export interface ProjectData {
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ContactInfo {
  email: string;
  personalEmail: string;
}

export interface SocialLink {
  name: string;
  url: string;
  command: string;
  icon: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  description: string;
  education: string;
  experience: string;
  skills: SkillCategory[];
  projects: ProjectData[];
  contact: ContactInfo;
  social: SocialLink[];
}

export * from './terminal';
