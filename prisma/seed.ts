import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { Plan, PostVisibility, type User } from "../generated/prisma/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const firstNames = [
  "Alice",
  "Bob",
  "Carol",
  "Dave",
  "Erin",
  "Frank",
  "Grace",
  "Hugo",
  "Ivy",
  "James",
  "Kira",
  "Liam",
  "Maya",
  "Noah",
  "Olivia",
  "Pete",
  "Quinn",
  "Rhea",
  "Sara",
  "Tariq",
  "Uma",
  "Victor",
  "Wendy",
  "Xavier",
  "Yara",
  "Zane",
  "Aiden",
  "Bella",
  "Caleb",
  "Diana",
  "Ethan",
  "Fiona",
  "Gabriel",
  "Hannah",
  "Isaac",
  "Julia",
  "Kevin",
  "Luna",
  "Mason",
  "Nina",
  "Oscar",
  "Penny",
  "Ray",
  "Sophie",
  "Tyler",
  "Ursula",
  "Vincent",
  "Willow",
  "Xander",
  "Yasmin",
  "Zara",
  "Adam",
  "Brooke",
  "Chris",
  "Daphne",
  "Eli",
  "Freya",
  "Gavin",
  "Holly",
  "Ian",
  "Jade",
  "Kyle",
  "Lily",
  "Max",
  "Nora",
  "Owen",
  "Piper",
  "Quinn",
  "Ruby",
  "Sam",
  "Tara",
  "Umar",
  "Vera",
  "Wade",
  "Xena",
  "Yuki",
  "Zoe",
  "Alex",
  "Blake",
  "Casey",
  "Drew",
  "Emery",
  "Finn",
  "Grey",
  "Harper",
  "Jordan",
  "Kai",
  "Logan",
  "Morgan",
  "Nico",
  "Parker",
  "Reese",
  "Sage",
  "Taylor",
  "Val",
  "Winter",
  "River",
];

const lastNames = [
  "Nguyen",
  "Hernandez",
  "Singh",
  "Okafor",
  "Patel",
  "Wong",
  "Kim",
  "Silva",
  "Zhang",
  "Baker",
  "Ivanova",
  "Olsen",
  "Rahman",
  "Adams",
  "Garcia",
  "Johnson",
  "Lewis",
  "Chung",
  "Lopez",
  "Hassan",
  "Martinez",
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Walker",
  "Hall",
  "Allen",
  "Young",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Mitchell",
  "Carter",
  "Roberts",
  "Turner",
  "Phillips",
  "Campbell",
  "Parker",
  "Evans",
  "Edwards",
  "Collins",
  "Stewart",
  "Morris",
  "Rogers",
  "Reed",
  "Cook",
  "Morgan",
  "Bell",
  "Murphy",
  "Bailey",
  "Rivera",
  "Cooper",
  "Richardson",
  "Cox",
  "Howard",
  "Ward",
  "Peterson",
  "Gray",
  "Ramirez",
  "James",
  "Watson",
  "Brooks",
  "Kelly",
  "Sanders",
  "Price",
  "Bennett",
  "Wood",
  "Barnes",
  "Ross",
  "Henderson",
  "Coleman",
  "Jenkins",
  "Perry",
  "Powell",
  "Long",
  "Patterson",
  "Hughes",
  "Flores",
  "Washington",
  "Butler",
  "Simmons",
];

const postContents = [
  "Just shipped a new feature! 🚀",
  "Working on something exciting today.",
  "Coffee fuels my code ☕",
  "Who else loves debugging at 2am?",
  "Refactoring old code feels so good.",
  "Learning a new framework this week.",
  "Open source contributions are the best!",
  "Just hit a major milestone on my project.",
  "The satisfaction of fixing a bug that's been haunting me.",
  "Team collaboration makes everything better.",
  "Reading through documentation again...",
  "Pro tip: Always write tests first!",
  "Excited about the new API we're building.",
  "Performance optimization is oddly satisfying.",
  "Just discovered a great new library.",
  "Pair programming session was super productive.",
  "Nothing beats clean, readable code.",
  "Deployment day! Fingers crossed 🤞",
  "That feeling when your code works on the first try.",
  "Reviewing PRs and learning from the team.",
  "Working remotely has its perks.",
  "Setting up CI/CD pipelines today.",
  "Database optimization saved the day.",
  "Exploring microservices architecture.",
  "Just finished a great tech talk.",
  "Code review feedback is always valuable.",
  "Scaling challenges keep things interesting.",
  "The best code is code you don't have to write.",
  "Automated testing is a game changer.",
  "Learned something new about async/await today.",
  "Building user-friendly interfaces is an art.",
  "Security should always be a priority.",
  "Loving the TypeScript experience.",
  "REST vs GraphQL - both have their place.",
  "Docker containers make deployment easier.",
  "Monitoring and logging are crucial.",
  "Code comments are documentation.",
  "Accessibility matters in every project.",
  "Version control saves lives.",
  "Agile methodology works when done right.",
];

const commentTemplates = [
  "Great post!",
  "I totally agree with this.",
  "Thanks for sharing!",
  "This is really helpful.",
  "Interesting perspective!",
  "Love this! 🎉",
  "Well said!",
  "Can't wait to try this.",
  "Same here!",
  "Awesome work!",
  "This made my day.",
  "Super insightful.",
  "Thanks for the tip!",
  "Really appreciate this.",
  "Solid advice.",
  "This is gold.",
  "Couldn't agree more.",
  "Great idea!",
  "Nice work!",
  "Keep it up!",
];

const getRandomItem = <T>(list: T[]): T =>
  list[Math.floor(Math.random() * list.length)];

const getRandomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateUsername = (
  firstName: string,
  lastName: string,
  index: number,
) => {
  const variations = [
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${index}`,
    `${firstName.toLowerCase()}_${index}`,
    `${lastName.toLowerCase()}${index}`,
  ];
  return variations[index % variations.length];
};

let prismaClient: typeof import("../lib/prisma.js").prisma | null = null;

async function main() {
  const { prisma } = await import("../lib/prisma.js");
  prismaClient = prisma;
  console.log("🗑️  Cleaning up existing data...");
  await prisma.commentLike.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follower.deleteMany();
  await prisma.block.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Password123!", 10);
  
  // Create 2 consistent test accounts
  console.log("👥 Creating test accounts...");
  const testAccounts = [
    {
      username: "testuser1",
      email: "test1@example.com",
      firstName: "Test",
      lastName: "User One",
      password: passwordHash,
      plan: Plan.FREE,
    },
    {
      username: "testuser2",
      email: "test2@example.com",
      firstName: "Test",
      lastName: "User Two",
      password: passwordHash,
      plan: Plan.PRO,
      planStatus: "active",
      planStartedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  ];

  await prisma.user.createMany({
    data: testAccounts,
  });
  console.log("✅ Created 2 test accounts (test1@example.com / test2@example.com)");

  const TARGET_USERS = 20; // Additional random users

  console.log(`👥 Creating ${TARGET_USERS} random users...`);
  const usersData = [] as Array<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    plan?: Plan;
    planStatus?: string;
    planStartedAt?: Date;
  }>;

  for (let i = 0; i < TARGET_USERS; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName =
      lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const username = generateUsername(firstName, lastName, i);

    const userData = {
      username,
      email: `${username}@example.com`,
      firstName,
      lastName,
      password: passwordHash,
    } as (typeof usersData)[number];

    if (i % 20 === 0) {
      userData.plan = Plan.PRO;
      userData.planStatus = "active";
      userData.planStartedAt = new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      );
    }

    usersData.push(userData);
  }

  const BATCH_SIZE = 100;
  for (let i = 0; i < usersData.length; i += BATCH_SIZE) {
    await prisma.user.createMany({
      data: usersData.slice(i, i + BATCH_SIZE),
    });
  }

  const users: User[] = await prisma.user.findMany();
  console.log(`✅ Created ${users.length} total users (including 2 test accounts)`);

  console.log("📝 Creating posts...");
  const postsData = [] as Array<{
    authorId: string;
    content: string;
    visibility: PostVisibility;
    createdAt: Date;
  }>;
  for (const user of users) {
    const numPosts = getRandomInt(1, 3); // Reduced from 2-8
    for (let j = 0; j < numPosts; j++) {
      postsData.push({
        authorId: user.id,
        content: getRandomItem(postContents),
        visibility:
          Math.random() < 0.2 ? PostVisibility.PRIVATE : PostVisibility.PUBLIC,
        createdAt: new Date(
          Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
        ),
      });
    }
  }

  for (let i = 0; i < postsData.length; i += BATCH_SIZE) {
    await prisma.post.createMany({
      data: postsData.slice(i, i + BATCH_SIZE),
    });
  }

  const posts = await prisma.post.findMany();
  console.log(`✅ Created ${posts.length} posts`);

  console.log("❤️  Creating likes...");
  const likesData = [] as Array<{ userId: string; postId: string }>;
  const postLikeCounts = new Map<string, number>();
  for (const post of posts) {
    const numLikes = getRandomInt(2, 10); // Reduced from 5-30
    const likerIndices = new Set<number>();

    while (likerIndices.size < Math.min(numLikes, users.length - 1)) {
      likerIndices.add(Math.floor(Math.random() * users.length));
    }

    for (const index of likerIndices) {
      const likerId = users[index].id;
      if (likerId !== post.authorId) {
        likesData.push({ userId: likerId, postId: post.id });
        postLikeCounts.set(post.id, (postLikeCounts.get(post.id) || 0) + 1);
      }
    }
  }

  for (let i = 0; i < likesData.length; i += BATCH_SIZE) {
    await prisma.like.createMany({
      data: likesData.slice(i, i + BATCH_SIZE),
      skipDuplicates: true,
    });
  }
  console.log(`✅ Created ${likesData.length} likes`);

  console.log("💬 Creating comments with replies...");
  const allComments = [] as Array<{
    id: string;
    postId: string;
    authorId: string;
  }>;
  const postCommentCounts = new Map<string, number>();

  for (const post of posts) {
    const topLevelCount = getRandomInt(1, 3); // Reduced from 2-8
    const topLevel = [] as typeof allComments;

    for (let i = 0; i < topLevelCount; i++) {
      const author = getRandomItem(users);
      if (author.id === post.authorId) continue;
      const createdAt = new Date(
        post.createdAt.getTime() + Math.random() * 48 * 60 * 60 * 1000,
      );
      const comment = await prisma.comment.create({
        data: {
          authorId: author.id,
          postId: post.id,
          content: getRandomItem(commentTemplates),
          createdAt,
        },
      });
      topLevel.push({
        id: comment.id,
        postId: comment.postId,
        authorId: comment.authorId,
      });
      allComments.push({
        id: comment.id,
        postId: comment.postId,
        authorId: comment.authorId,
      });
      postCommentCounts.set(post.id, (postCommentCounts.get(post.id) || 0) + 1);
    }

    for (const parent of topLevel) {
      const replyCount = getRandomInt(0, 2); // Reduced from 0-4
      for (let j = 0; j < replyCount; j++) {
        const author = getRandomItem(users);
        if (author.id === parent.authorId) continue;
        const createdAt = new Date(
          post.createdAt.getTime() + Math.random() * 72 * 60 * 60 * 1000,
        );
        const reply = await prisma.comment.create({
          data: {
            authorId: author.id,
            postId: post.id,
            parentId: parent.id,
            content: getRandomItem(commentTemplates),
            createdAt,
          },
        });
        allComments.push({
          id: reply.id,
          postId: reply.postId,
          authorId: reply.authorId,
        });
        postCommentCounts.set(
          post.id,
          (postCommentCounts.get(post.id) || 0) + 1,
        );

        if (Math.random() < 0.35) {
          const subAuthor = getRandomItem(users);
          if (subAuthor.id !== reply.authorId) {
            const subReply = await prisma.comment.create({
              data: {
                authorId: subAuthor.id,
                postId: post.id,
                parentId: reply.id,
                content: getRandomItem(commentTemplates),
                createdAt: new Date(
                  post.createdAt.getTime() +
                    Math.random() * 96 * 60 * 60 * 1000,
                ),
              },
            });
            allComments.push({
              id: subReply.id,
              postId: subReply.postId,
              authorId: subReply.authorId,
            });
            postCommentCounts.set(
              post.id,
              (postCommentCounts.get(post.id) || 0) + 1,
            );
          }
        }
      }
    }
  }

  console.log(`✅ Created ${allComments.length} comments`);

  console.log("💗 Creating comment likes...");
  const commentLikesData = [] as Array<{ userId: string; commentId: string }>;
  const commentLikeCounts = new Map<string, number>();
  for (const comment of allComments) {
    const numLikes = getRandomInt(0, 12);
    const likerIndices = new Set<number>();

    while (likerIndices.size < Math.min(numLikes, users.length - 1)) {
      likerIndices.add(Math.floor(Math.random() * users.length));
    }

    for (const index of likerIndices) {
      const likerId = users[index].id;
      if (likerId !== comment.authorId) {
        commentLikesData.push({ userId: likerId, commentId: comment.id });
        commentLikeCounts.set(
          comment.id,
          (commentLikeCounts.get(comment.id) || 0) + 1,
        );
      }
    }
  }

  for (let i = 0; i < commentLikesData.length; i += BATCH_SIZE) {
    await prisma.commentLike.createMany({
      data: commentLikesData.slice(i, i + BATCH_SIZE),
      skipDuplicates: true,
    });
  }
  console.log(`✅ Created ${commentLikesData.length} comment likes`);

  console.log("🤝 Creating follower relationships...");
  const followerPairs = [] as Array<{
    followerId: string;
    followingId: string;
  }>;
  for (let i = 0; i < users.length; i++) {
    const numFollowing = getRandomInt(5, 15); // Reduced from 10-40
    const followingIndices = new Set<number>();

    while (followingIndices.size < Math.min(numFollowing, users.length - 1)) {
      const randomIndex = Math.floor(Math.random() * users.length);
      if (randomIndex !== i) {
        followingIndices.add(randomIndex);
      }
    }

    for (const index of followingIndices) {
      followerPairs.push({
        followerId: users[i].id,
        followingId: users[index].id,
      });
    }
  }

  for (let i = 0; i < followerPairs.length; i += BATCH_SIZE) {
    await prisma.follower.createMany({
      data: followerPairs.slice(i, i + BATCH_SIZE),
      skipDuplicates: true,
    });
  }
  console.log(`✅ Created ${followerPairs.length} follower relationships`);

  console.log("🚫 Creating blocks...");
  const blockPairs = [] as Array<{ blockerId: string; blockedId: string }>;
  for (let i = 0; i < users.length; i++) {
    const numBlocks = getRandomInt(1, 3); // Reduced from 2-10
    const blockedIndices = new Set<number>();

    while (blockedIndices.size < Math.min(numBlocks, users.length - 1)) {
      const randomIndex = Math.floor(Math.random() * users.length);
      if (randomIndex !== i) {
        blockedIndices.add(randomIndex);
      }
    }

    for (const index of blockedIndices) {
      blockPairs.push({
        blockerId: users[i].id,
        blockedId: users[index].id,
      });
    }
  }

  if (blockPairs.length > 0) {
    await prisma.block.createMany({
      data: blockPairs,
      skipDuplicates: true,
    });
  }
  console.log(`✅ Created ${blockPairs.length} blocks`);
  console.log("📊 Updating counts...");
  for (const post of posts) {
    await prisma.post.update({
      where: { id: post.id },
      data: {
        likesCount: postLikeCounts.get(post.id) || 0,
        commentsCount: postCommentCounts.get(post.id) || 0,
      },
    });
  }

  for (const comment of allComments) {
    await prisma.comment.update({
      where: { id: comment.id },
      data: { likesCount: commentLikeCounts.get(comment.id) || 0 },
    });
  }

  console.log("✅ All counts updated");
  console.log("\n🎉 Database seeded successfully!");
  console.log(`📊 Summary:
  - Users: ${users.length}
  - Posts: ${posts.length}
  - Comments: ${allComments.length}
  - Comment Likes: ${commentLikesData.length}
  - Likes: ${likesData.length}
  - Follows: ${followerPairs.length}
  - Blocks: ${blockPairs.length}
  `);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    if (prismaClient) {
      await prismaClient.$disconnect();
    }
  });
