import { Hono } from 'hono';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();
const profile = new Hono();

// Get the first profile (or null)
profile.get('/', async (c: any) => {
  const profiles = await prisma.profile.findMany();
  return c.json(profiles[0] || null);
});

// Create a new profile
profile.post('/', async (c: any) => {
  const data = await c.req.json();

  if ('id' in data) delete data.id;

  data.skills = data.skills || [];
  data.projects = data.projects || [];
  data.work = data.work || [];
  data.links = data.links || {};

  await prisma.profile.deleteMany(); // optional, if you want only one profile
  const created = await prisma.profile.create({ data });

  return c.json(created);
});

// Update an existing profile
profile.put('/:id', async (c: any) => {
  const id = c.req.param('id');
  const data = await c.req.json();

  if ('id' in data) delete data.id;

  if (data.skills === undefined) data.skills = [];
  if (data.projects === undefined) data.projects = [];
  if (data.work === undefined) data.work = [];
  if (data.links === undefined) data.links = {};

  const updated = await prisma.profile.update({
    where: { id },
    data,
  });

  return c.json(updated);
});

// ✅ Delete profile
profile.delete('/:id', async (c: any) => {
  const id = c.req.param('id');

  try {
    await prisma.profile.delete({
      where: { id },
    });
    return c.json({ message: 'Profile deleted successfully' });
  } catch (err) {
    return c.json({ error: 'Profile not found' }, 404);
  }
});

export default profile;
