import { Hono } from 'hono';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();
const query = new Hono();


query.get('/projects', async (c: any) => {
  const skill = c.req.query('skill')?.toLowerCase();
  if (!skill) return c.json([], 200);

  const profiles = await prisma.profile.findMany({
    select: { projects: true }
  });

  const projects = profiles.flatMap(p =>
    p.projects.filter(proj =>
      proj.pskills?.some(s => s.toLowerCase() === skill)
    )
  );

  return c.json(projects, 200);
});

query.get('/skills/top', async (c: any) => {
  const profiles = await prisma.profile.findMany({
    select: { projects: true }
  });

  const skillCount: Record<string, number> = {};

  profiles.forEach(profile => {
    profile.projects?.forEach(project => {
      project.pskills?.forEach(skill => {
        const s = skill.toLowerCase();
        skillCount[s] = (skillCount[s] || 0) + 1;
      });
    });
  });

  const topSkills = Object.entries(skillCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([skill, count]) => ({ skill, count }));

  return c.json(topSkills, 200);
});


query.get('/search', async (c: any) => {
  const q = c.req.query('q')?.toLowerCase().trim();
  if (!q) return c.json({ profiles: [] }, 200);

  const profiles = await prisma.profile.findMany();

  const filteredProfiles = profiles.map(profile => {
    const matched: any = { id: profile.id };

    if (profile.name?.toLowerCase().includes(q)) matched.name = profile.name;
    if (profile.email?.toLowerCase().includes(q)) matched.email = profile.email;
    if (profile.education && profile.education.toLowerCase().includes(q)) matched.education = profile.education;
    const skills = profile.skills?.filter(skill => skill.toLowerCase().includes(q));
    if (skills && skills.length > 0) matched.skills = skills;

    const matchedProjects = profile.projects?.filter(p =>
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.link && p.link.toLowerCase().includes(q))
    );
    if (matchedProjects && matchedProjects.length > 0) matched.projects = matchedProjects;

    const matchedWork = profile.work?.filter(w =>
      (w.role && w.role.toLowerCase().includes(q)) ||
      (w.company && w.company.toLowerCase().includes(q)) ||
      (w.duration && w.duration.toLowerCase().includes(q)) ||
      (w.description && w.description.toLowerCase().includes(q))
    );
    if (matchedWork && matchedWork.length > 0) matched.work = matchedWork;

    const links: Record<string, string> = {};
    if (profile.links?.github && profile.links.github.toLowerCase().includes(q)) links.github = profile.links.github;
    if (profile.links?.linkedin && profile.links.linkedin.toLowerCase().includes(q)) links.linkedin = profile.links.linkedin;
    if (profile.links?.portfolio && profile.links.portfolio.toLowerCase().includes(q)) links.portfolio = profile.links.portfolio;
    if (Object.keys(links).length > 0) matched.links = links;

    return matched;
  }).filter(p =>
    Object.keys(p).length > 1 && (p.projects?.length > 0 || p.work?.length > 0 || p.name || p.email || p.skills)
  );

  return c.json({ profiles: filteredProfiles }, 200);
});


export default query;
