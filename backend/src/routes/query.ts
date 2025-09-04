import { Hono } from 'hono';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();
const query = new Hono();

// query.use("*", async (c : any, next : any) => {
//   console.log("🟢 Query route hit:", c.req.method, c.req.url);
//   await next();
// });

// GET /query/projects?skill=python
query.get('/projects', async (c: any) => {
  const skill = c.req.query('skill')?.toLowerCase();
  if (!skill) return c.json([], 200);

  // Fetch all profiles with their projects including pskills
  const profiles = await prisma.profile.findMany({
    select: { projects: true }
  });

  // Filter projects by pskills only
  const projects = profiles.flatMap(p =>
    p.projects.filter(proj =>
      proj.pskills?.some(s => s.toLowerCase() === skill)
    )
  );

  return c.json(projects, 200);
});

// GET /query/skills/top
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


// GET /query/search?q=...
query.get('/search', async (c: any) => {
  const q = c.req.query('q')?.toLowerCase().trim();
  if (!q) return c.json({}, 200);

  // Fetch the single profile
  const profile = await prisma.profile.findFirst();
  if (!profile) return c.json({}, 200);

  const result: any = {};

  // Name
  if (profile.name?.toLowerCase().includes(q)) result.name = profile.name;

  // Email
  if (profile.email?.toLowerCase().includes(q)) result.email = profile.email;

  // Education
  if (profile.education?.toLowerCase().includes(q)) result.education = profile.education;

  // Skills
  const matchedSkills = profile.skills?.filter(skill => skill.toLowerCase().includes(q));
  if (matchedSkills?.length) result.skills = matchedSkills;

  // Projects
  const matchedProjects = profile.projects
    ?.map(p => {
      const proj: any = {};
      if (p.title?.toLowerCase().includes(q)) proj.title = p.title;
      if (p.description?.toLowerCase().includes(q)) proj.description = p.description;
      if (p.link?.toLowerCase().includes(q)) proj.link = p.link;
      return Object.keys(proj).length ? proj : null;
    })
    .filter(Boolean);
  if (matchedProjects?.length) result.projects = matchedProjects;

  // Work
  const matchedWork = profile.work
    ?.map(w => {
      const work: any = {};
      if (w.role?.toLowerCase().includes(q)) work.role = w.role;
      if (w.company?.toLowerCase().includes(q)) work.company = w.company;
      if (w.duration?.toLowerCase().includes(q)) work.duration = w.duration;
      if (w.description?.toLowerCase().includes(q)) work.description = w.description;
      return Object.keys(work).length ? work : null;
    })
    .filter(Boolean);
  if (matchedWork?.length) result.work = matchedWork;

  // Links
  const matchedLinks: Record<string, string> = {};
  if (profile.links?.github?.toLowerCase().includes(q)) matchedLinks.github = profile.links.github;
  if (profile.links?.linkedin?.toLowerCase().includes(q)) matchedLinks.linkedin = profile.links.linkedin;
  if (profile.links?.portfolio?.toLowerCase().includes(q)) matchedLinks.portfolio = profile.links.portfolio;
  if (Object.keys(matchedLinks).length) result.links = matchedLinks;

  return c.json(result, 200);
});

export default query;
