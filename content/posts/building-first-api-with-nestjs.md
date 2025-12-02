---
title: "Building Your First REST API with NestJS: A Step-by-Step Tutorial"
publishDate: 2025-10-23
description: "A beginner-friendly guide to creating your first REST API using NestJS and TypeScript. Learn how to set up a NestJS project from scratch, understand modules and controllers, create CRUD endpoints, validate data with DTOs, connect to a database using TypeORM, and implement basic authentication. This practical tutorial walks you through building a simple blog API while explaining NestJS core concepts in an approachable way, perfect for junior developers transitioning from Express.js or learning backend development."
category: "Backend Development"
tags: ["NestJS", "TypeScript", "REST API", "Node.js", "Backend", "Tutorial", "Getting Started"]
thumbnail: "/images/posts/building-first-api-with-nestjs.png"
author: "Putra Prassiesa Abimanyu"
---

# Building Your First REST API with NestJS: A Step-by-Step Tutorial

When I first heard about NestJS, I was a bit intimidated. Coming from Express.js, all the decorators, modules, and TypeScript syntax looked complicated. But after building my first API, I realized NestJS actually makes things easier—it just has a learning curve at the start.

In this guide, I'll show you how to build a simple blog API with NestJS. We'll cover the basics without overwhelming you with advanced concepts. By the end, you'll have a working API and understand how NestJS organizes code.

## What is NestJS and Why Use It?

NestJS is a framework built on top of Express.js (or Fastify) that adds structure to your Node.js applications. Think of it like this:

- **Express.js**: You decide how to organize everything
- **NestJS**: It gives you a proven structure to follow

The main benefits I've found:

- **TypeScript by default** - Catches errors before you run the code
- **Built-in organization** - No more wondering where to put files
- **Great for teams** - Everyone follows the same patterns
- **Lots of features** - Authentication, validation, database connections all included

If you're building something serious that will grow, NestJS is worth learning.

## What You'll Need

Before starting, make sure you have:

- Node.js installed (version 16 or higher)
- Basic TypeScript knowledge (don't worry if you're still learning)
- Familiarity with REST APIs
- A code editor (VS Code works great)

That's it! Let's build something.

## Setting Up Your First NestJS Project

NestJS has a CLI that makes setup super easy. Install it globally:

```bash
npm install -g @nestjs/cli
```

Now create a new project:

```bash
nest new blog-api
```

The CLI will ask which package manager you want. I use npm, but choose whatever you prefer. It'll create a project with this structure:

```
blog-api/
├── src/
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
├── package.json
└── tsconfig.json
```

Let's start the development server:

```bash
cd blog-api
npm run start:dev
```

Visit `http://localhost:3000` and you should see "Hello World!". Your NestJS app is running!

## Understanding the Basics

Before we build features, let's understand the key pieces:

### Modules

Modules organize your code into logical groups. Every app has at least one module (AppModule).

### Controllers

Controllers handle HTTP requests. They receive requests and return responses.

### Services

Services contain your business logic. Controllers call services to do the actual work.

This separation keeps code organized. Controllers are thin (just handle HTTP stuff), services are fat (contain the logic).

## Building a Posts Module

Let's build a simple blog posts API. We'll create endpoints to:

- Get all posts
- Get a single post
- Create a post
- Update a post
- Delete a post

Generate a new module using the CLI:

```bash
nest generate module posts
nest generate controller posts
nest generate service posts
```

The CLI creates files and automatically imports them. Nice!

## Creating Your First Endpoint

Open `src/posts/posts.controller.ts` and let's create a route:

```typescript
import { Controller, Get } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  @Get()
  findAll() {
    return { message: 'This will return all posts' };
  }
}
```

Visit `http://localhost:3000/posts` and you'll see the message. That's it! The `@Get()` decorator creates a GET endpoint.

## Adding a Service

Controllers should be simple. Let's move the logic to a service. Open `src/posts/posts.service.ts`:

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  private posts = [
    { id: 1, title: 'First Post', content: 'Hello World!' },
    { id: 2, title: 'Second Post', content: 'Learning NestJS' },
  ];

  findAll() {
    return this.posts;
  }

  findOne(id: number) {
    return this.posts.find(post => post.id === id);
  }
}
```

Now update the controller to use the service:

```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }
}
```

Notice the `constructor`? That's dependency injection. NestJS automatically gives us an instance of PostsService. Cool, right?

## Creating Posts

Let's add the ability to create posts. First, we need a DTO (Data Transfer Object) to define what data we expect.

Create `src/posts/dto/create-post.dto.ts`:

```typescript
export class CreatePostDto {
  title: string;
  content: string;
}
```

Add validation by installing class-validator:

```bash
npm install class-validator class-transformer
```

Update the DTO:

```typescript
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}
```

Enable validation globally in `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
}
bootstrap();
```

Now add the create method to your service:

```typescript
create(createPostDto: CreatePostDto) {
  const newPost = {
    id: this.posts.length + 1,
    ...createPostDto,
  };
  this.posts.push(newPost);
  return newPost;
}
```

And to your controller:

```typescript
import { Controller, Get, Post, Body, Param } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  // ... existing code ...

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }
}
```

Test it with curl:

```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "My Post", "content": "This is my post content"}'
```

If you send invalid data (like an empty title), you'll get a validation error. That's the validation working!

## Adding Update and Delete

Let's complete our CRUD operations:

```typescript
// In posts.service.ts
update(id: number, updatePostDto: CreatePostDto) {
  const postIndex = this.posts.findIndex(post => post.id === id);
  if (postIndex === -1) {
    return null;
  }
  this.posts[postIndex] = { ...this.posts[postIndex], ...updatePostDto };
  return this.posts[postIndex];
}

delete(id: number) {
  const postIndex = this.posts.findIndex(post => post.id === id);
  if (postIndex === -1) {
    return false;
  }
  this.posts.splice(postIndex, 1);
  return true;
}
```

```typescript
// In posts.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException } from '@nestjs/common';

@Controller('posts')
export class PostsController {
  // ... existing code ...

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: CreatePostDto) {
    const post = this.postsService.update(+id, updatePostDto);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const deleted = this.postsService.delete(+id);
    if (!deleted) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return { message: 'Post deleted successfully' };
  }
}
```

Now you have a complete CRUD API!

## Adding a Database

Storing data in memory is fine for learning, but it disappears when you restart the server. Let's add a real database with TypeORM.

Install the packages:

```bash
npm install @nestjs/typeorm typeorm sqlite3
```

I'm using SQLite because it's simple—no database server to set up. For production, you'd use PostgreSQL or MySQL.

Create `src/posts/entities/post.entity.ts`:

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;
}
```

Update `src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'blog.db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Only for development!
    }),
    PostsModule,
  ],
})
export class AppModule {}
```

Update `src/posts/posts.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

Finally, update the service to use the database:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async findAll(): Promise<Post[]> {
    return await this.postsRepository.find();
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  async update(id: number, updatePostDto: CreatePostDto): Promise<Post> {
    await this.postsRepository.update(id, updatePostDto);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}
```

Now your data persists! Restart the server and your posts will still be there.

## What You've Learned

Congratulations! You just built a REST API with NestJS. Let's recap:

- **Project setup** with the NestJS CLI
- **Modules** organize your code
- **Controllers** handle HTTP requests
- **Services** contain business logic
- **DTOs** define and validate data
- **TypeORM** connects to databases
- **Decorators** like `@Get()`, `@Post()`, etc.

## Next Steps

You've got the basics down. Here's what to learn next:

- **Authentication** - JWT tokens for securing endpoints
- **Environment variables** - Using @nestjs/config
- **Relations** - Connecting posts to users
- **Error handling** - Custom exception filters
- **Testing** - Writing unit and e2e tests

## My Tips for Learning NestJS

**1. Don't compare it to Express too much**

NestJS is different. Embrace the structure instead of fighting it.

**2. Use the CLI**

The `nest generate` command saves so much time and follows best practices.

**3. Read the docs**

NestJS has excellent documentation at docs.nestjs.com. It's actually readable!

**4. Start simple**

Don't try to learn everything at once. Build basic APIs first, then add complexity.

**5. Practice with real projects**

Theory only goes so far. Build small projects to solidify your understanding.

## Final Thoughts

NestJS felt weird at first, but now I appreciate the structure it provides. When I go back to Express projects, I actually miss having a clear place for everything.

The learning curve is real, but it's not as steep as it looks. Start with what we covered here, build a few simple APIs, and gradually explore more features.

Remember: every expert was once a beginner who didn't give up. You've got this!

Happy coding!
