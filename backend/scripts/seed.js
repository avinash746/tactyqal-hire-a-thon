import 'dotenv/config';
import '../src/models/Post.js';
import Post from '../src/models/Post.js';
import { connectDb, disconnectDb } from '../src/db.js';
import { createPostsRepo } from '../src/postsRepo.js';

const posts = [
  {
    title: 'The elevator pitch for business entrepreneurs',
    publishedAt: '2024-05-01T09:00:00.000Z',
    tags: ['Pitching', 'Founders'],
    coverImage: 'https://www.tactyqal.com/application/assets/images/blog-ele.png',
    content: `An elevator pitch is the fastest way to describe what your startup does, who it is for, and why it matters. You have about thirty seconds, so every sentence has to earn its place.

## A simple structure

1. **The problem.** Name the pain in one sentence a stranger would recognise.
2. **Your solution.** Say what you built, not how it works.
3. **Proof.** One number, one customer, or one result.
4. **The ask.** A call, a coffee, an intro.

> If your pitch needs a diagram to be understood, it is not ready yet.

## Practise out loud

Record yourself, then cut a third of the words. Repeat until it sounds like a conversation.`
  },
  {
    title: 'How to build a tech startup team?',
    publishedAt: '2024-04-20T09:00:00.000Z',
    tags: ['Teams', 'Founders'],
    coverImage: 'https://www.tactyqal.com/application/assets/images/blog-startup.png',
    content: `In the early days, the fewer employees, the better. Managing people takes up a lot of time that a young product needs for learning from customers.

## Start with complementary skills

A builder, a seller and someone who cares deeply about the customer is a strong trio. Two people with identical skills duplicate effort; two people with different skills multiply it.

## Hire slowly, test with real work

Before committing to a cofounder, work on a small paid project together for a few weeks. You will learn more than from ten interviews.`
  },
  {
    title: '11 reasons why startups fail at the idea stage',
    publishedAt: '2024-04-10T09:00:00.000Z',
    tags: ['Validation', 'Startup Ideas'],
    coverImage: 'https://www.tactyqal.com/application/assets/images/blog-fail.png',
    content: `The default state of a startup is failure, and many failures are decided long before any code is written.

## The most common causes

- Solving a problem nobody has
- Building before talking to customers
- Choosing a market that is too small
- Falling in love with the solution instead of the problem
- No plan for how customers will find you

Each of these can be tested in a week with ten honest conversations and a simple landing page.`
  },
  {
    title: '50 No-code startup app ideas',
    publishedAt: '2025-07-09T09:00:00.000Z',
    tags: ['No-code', 'Startup Ideas'],
    coverImage: 'https://www.tactyqal.com/application/assets/images/50-No-Code-Startup-Ideas-You-Can-Build-Without-Programming-Skills.webp',
    content: `Modern no-code tools let you launch a real product without writing code. Here are directions worth exploring.

## Marketplaces and directories

- A local tutor marketplace
- A directory of verified home bakers

## Community and learning

- A study-group matching app
- A micro-course platform for one skill

Pick one idea, talk to five potential users this week, and build the smallest version that solves their problem.`
  },
  {
    title: '30 Startup ideas to solve food waste problems',
    publishedAt: '2024-03-15T09:00:00.000Z',
    tags: ['Startup Ideas', 'Impact'],
    coverImage: 'https://www.tactyqal.com/application/assets/images/30-startup-ideas-for-food-waste-problems.jpg',
    content: `Food waste is a massive problem. Every year, we throw away one-third of all food produced, which is also a large opportunity for builders.

## Ideas to start from

- Surplus meal alerts from restaurants near closing time
- A household app that suggests recipes from what is about to expire
- Matching farms with food banks

Look for the step where food is lost, then design a tool for the person standing at that step.`
  },
  {
    title: '50 Startup ideas for Gen-Z entrepreneurs',
    publishedAt: '2024-03-05T09:00:00.000Z',
    tags: ['Startup Ideas', 'Gen-Z'],
    coverImage: 'https://www.tactyqal.com/application/assets/images/50-Startup-Ideas-for-Generation-Z-Entrepreneurs.jpg',
    content: `Looking at the opportunities ahead, Generation Z entrepreneurs have advantages: they grew up with the tools and understand their peers better than any outsider.

## Where Gen-Z has an edge

- Creator tools and short-form video services
- Digital-first education and exam prep
- Sustainable fashion and second-hand resale

Start with a problem you personally have, then check whether your friends have it too.`
  }
];

await connectDb();
const repo = createPostsRepo();
let created = 0;
for (const p of posts) {
  const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (await Post.exists({ slug })) continue;
  await repo.create({ ...p, slug, author: 'Tactyqal', status: 'published' });
  created++;
}
console.log(`Seeded ${created} new post(s) (${posts.length - created} already existed).`);
await disconnectDb();
