---
title: "Setting Up a Production-Ready REST API with NestJS: A Complete Guide"
publishDate: 2025-11-08
description: "A comprehensive walkthrough of setting up a professional REST API project using NestJS from scratch. Learn how to structure your application, configure TypeScript, integrate with databases, implement authentication and validation, set up environment configuration, and establish best practices for controllers, services, and modules. This hands-on guide takes you from initial project creation to a fully functional, production-ready API with proper error handling, security measures, and deployment preparation."
category: "Backend Development"
tags: ["NestJS", "TypeScript", "REST API", "Node.js", "Backend", "API Development", "Project Setup"]
thumbnail: "/images/posts/nestjs-project-setup.png"
author: "Putra Prassiesa Abimanyu"
---

# Setting Up a Production-Ready REST API with NestJS: A Complete Guide

I've been using NestJS for backend development for the past few years, and it's genuinely transformed how I build APIs. Coming from Express.js, the structure and conventions that NestJS enforces felt restrictive at first. But after building several production applications, I've come to appreciate how its opinionated architecture prevents the maintenance nightmares that plague many Node.js projects.

In this guide, I'll walk you through setting up a production-ready NestJS REST API from scratch. We'll cover not just the basic setup, but also the configuration patterns and architectural decisions that will save you headaches later.

## Why NestJS for Your Next API Project

Before we dive into code, let me explain why I reach for NestJS for serious API projects. NestJS is built with TypeScript, uses decorators extensively, and follows Angular's modular architecture. This might sound like overkill for a simple API, but these features provide real benefits:

**Type Safety**: TypeScript catches errors at compile time that would crash your Express app in production. I've caught countless bugs before they ever reached staging.

**Dependency Injection**: Built-in DI makes testing easier and code more maintainable. You can swap implementations without touching your business logic.

**Modular Architecture**: The module system forces you to organize code logically from day one. As your API grows, this structure prevents chaos.

**Built-in Features**: Authentication, validation, configuration, database integration—NestJS has official packages for everything. No more choosing between dozens of community libraries.

**Scalability**: The architecture scales from MVPs to microservices without major restructuring.

For small personal projects, this might be overkill. But for anything you plan to maintain long-term or grow into a production service, NestJS provides a solid foundation.

## Initial Project Setup

Let's start by creating a new NestJS project. Make sure you have Node.js (v18 or higher) installed.

```bash
# Install NestJS CLI globally
npm install -g @nestjs/cli

# Create a new project
nest new product-api

# Navigate into the project
cd product-api
```

The CLI will ask you to choose a package manager. I prefer npm, but yarn and pnpm work fine too. The CLI generates a complete project structure:

```
product-api/
├── src/
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

Let's understand what each file does:

- **main.ts**: Application entry point, bootstraps the NestJS app
- **app.module.ts**: Root module that organizes the application
- **app.controller.ts**: Basic controller with a route handler
- **app.service.ts**: Service with business logic
- **app.controller.spec.ts**: Unit tests for the controller

Start the development server to verify everything works:

```bash
npm run start:dev
```

Visit `http://localhost:3000` and you should see "Hello World!". The `:dev` flag enables watch mode—the server restarts automatically when you change files.

## Configuring TypeScript for Strict Mode

The default TypeScript configuration is lenient. For production code, I always enable strict mode. Edit `tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "strictBindCallApply": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "strict": true
  }
}
```

The `strict: true` flag enables all strict type checking options. This catches potential bugs early but requires more explicit typing.

## Structuring Your Application

The default structure is fine for tiny APIs, but real applications need better organization. Here's the structure I use for production projects:

```
src/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   └── dto/
├── config/
│   └── configuration.ts
├── database/
│   └── database.module.ts
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/
│   │   ├── guards/
│   │   └── strategies/
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── dto/
│   │   └── entities/
│   └── products/
│       ├── products.controller.ts
│       ├── products.service.ts
│       ├── products.module.ts
│       ├── dto/
│       └── entities/
├── app.module.ts
└── main.ts
```

This structure separates concerns clearly:

- **common/**: Shared utilities, decorators, filters, guards
- **config/**: Application configuration
- **database/**: Database connection and configuration
- **modules/**: Feature modules (users, products, auth, etc.)

Each feature module is self-contained with its own controllers, services, DTOs, and entities.

## Setting Up Environment Configuration

Never hardcode configuration values. Use environment variables for everything that changes between environments. Install the configuration package:

```bash
npm install @nestjs/config
```

Create a `.env` file in the project root:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=productdb

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

Create `src/config/configuration.ts`:

```typescript
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  cors: {
    origins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  },
});
```

Import the configuration in `app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
  ],
})
export class AppModule {}
```

The `isGlobal: true` option makes the configuration available everywhere without importing ConfigModule in every module.

## Database Integration with TypeORM

Most APIs need a database. I'll demonstrate with PostgreSQL and TypeORM, but NestJS supports Mongoose, Sequelize, and other ORMs too.

Install dependencies:

```bash
npm install @nestjs/typeorm typeorm pg
```

Create `src/database/database.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
  ],
})
export class DatabaseModule {}
```

**Important**: `synchronize: true` automatically creates database tables from your entities. This is convenient in development but dangerous in production—it can drop tables. Always use migrations in production.

Import DatabaseModule in `app.module.ts`:

```typescript
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
```

## Building Your First Feature Module: Products

Let's create a complete products module to demonstrate NestJS patterns.

Generate the module, controller, and service:

```bash
nest generate module modules/products
nest generate controller modules/products
nest generate service modules/products
```

### Creating the Entity

Entities represent database tables. Create `src/modules/products/entities/product.entity.ts`:

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

The decorators define the database schema. TypeORM creates a table with these columns.

### Creating DTOs for Validation

DTOs (Data Transfer Objects) define the shape of data coming into your API. Install validation packages:

```bash
npm install class-validator class-transformer
```

Create `src/modules/products/dto/create-product.dto.ts`:

```typescript
import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
```

Create `src/modules/products/dto/update-product.dto.ts`:

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
```

`PartialType` makes all fields optional, perfect for PATCH endpoints.

### Implementing the Service

Services contain business logic. Update `src/modules/products/products.service.ts`:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    Object.assign(product, updateProductDto);
    return await this.productsRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
  }
}
```

The `@InjectRepository` decorator injects the TypeORM repository. We use it to interact with the database.

### Building the Controller

Controllers handle HTTP requests. Update `src/modules/products/products.controller.ts`:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
```

Notice the decorators:
- `@Controller('products')`: Maps to `/products` route
- `@Get()`, `@Post()`, etc.: HTTP methods
- `@Body()`: Extracts request body
- `@Param('id')`: Extracts route parameters
- `@HttpCode()`: Sets response status code

### Registering Dependencies

Update `src/modules/products/products.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
```

`TypeOrmModule.forFeature([Product])` makes the Product repository available for injection.

## Enabling Global Validation

Enable validation globally in `src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Set global prefix
  app.setGlobalPrefix(configService.get('apiPrefix'));

  // Enable CORS
  app.enableCors({
    origin: configService.get('cors.origins'),
    credentials: true,
  });

  const port = configService.get('port');
  await app.listen(port);
  console.log(`Application running on: http://localhost:${port}`);
}
bootstrap();
```

The ValidationPipe options:
- `whitelist: true`: Strip properties not in the DTO
- `forbidNonWhitelisted: true`: Throw error if unknown properties are sent
- `transform: true`: Automatically transform payloads to DTO instances
- `enableImplicitConversion: true`: Convert types automatically (string to number, etc.)

## Implementing Authentication with JWT

Most APIs need authentication. Let's implement JWT-based auth.

Install dependencies:

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm install -D @types/passport-jwt @types/bcrypt
```

Generate auth module:

```bash
nest generate module modules/auth
nest generate service modules/auth
nest generate controller modules/auth
```

First, create the User entity in `src/modules/users/entities/user.entity.ts`:

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
```

Create the JWT strategy in `src/modules/auth/strategies/jwt.strategy.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
```

Implement the auth service in `src/modules/auth/auth.service.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(email: string, password: string, name: string) {
    const user = this.usersRepository.create({ email, password, name });
    await this.usersRepository.save(user);

    const payload = { sub: user.id, email: user.email };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
```

Create a JWT auth guard in `src/modules/auth/guards/jwt-auth.guard.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Configure the auth module in `src/modules/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

Now protect routes by applying the guard:

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  // Public route
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // Protected route
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }
}
```

## Error Handling and Logging

Create a global exception filter in `src/common/filters/http-exception.filter.ts`:

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    console.error('Exception:', exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
```

Apply it globally in `main.ts`:

```typescript
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // ... rest of bootstrap
}
```

## Testing Your API

NestJS includes testing setup out of the box. Here's how to test the products service:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should create a product', async () => {
    const dto = { name: 'Test', description: 'Test', price: 10 };
    mockRepository.create.mockReturnValue(dto);
    mockRepository.save.mockResolvedValue({ id: '1', ...dto });

    const result = await service.create(dto);
    expect(result.id).toBe('1');
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

Run tests with:

```bash
npm run test
```

## Preparing for Production

Before deploying, ensure you have:

**Environment configuration**: Separate `.env` files for development, staging, production

**Database migrations**: Use TypeORM migrations instead of `synchronize: true`

**Logging**: Implement proper logging (Winston or Pino)

**Health checks**: Add endpoints for load balancers

```typescript
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

**Documentation**: Add Swagger/OpenAPI docs

```bash
npm install @nestjs/swagger swagger-ui-express
```

**Security headers**: Install helmet

```bash
npm install helmet
```

Apply in main.ts:

```typescript
import helmet from 'helmet';

app.use(helmet());
```

## Conclusion

NestJS provides an excellent foundation for building production-grade REST APIs. The initial setup requires more boilerplate than Express, but this structure pays dividends as your application grows. You get TypeScript's type safety, dependency injection, modular architecture, and a rich ecosystem of official integrations.

The patterns I've shown—feature modules, DTOs for validation, services for business logic, guards for authentication—scale from small APIs to large microservice architectures. Start with these foundations, and you'll have a maintainable, testable API that's a pleasure to work with.

Remember, NestJS is opinionated by design. Embrace its conventions rather than fighting them, and you'll build better APIs faster.
