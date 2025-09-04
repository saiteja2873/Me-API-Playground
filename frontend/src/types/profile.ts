export interface Project {
  title: string;
  description: string;
  link: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Links {
  github?: string;
  linkedin?: string;
  portfolio?: string;
}

export interface Profile {
  id? : string;
  name: string;
  email: string;
  education: string;
  skills: string[];
  projects: Project[];
  work: WorkExperience[];
  links: Links;
}
