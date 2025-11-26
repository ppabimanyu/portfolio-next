---
title: "MongoDB Best Practices: Building Scalable NoSQL Applications"
publishDate: 2025-11-01
description: "An in-depth exploration of MongoDB best practices for building production-ready applications. Learn proven strategies for schema design, indexing optimization, query performance, data modeling patterns, aggregation pipelines, and security hardening. Discover how to handle relationships in NoSQL, implement effective backup strategies, manage replica sets, and scale horizontally with sharding. This comprehensive guide combines theoretical foundations with real-world examples to help you avoid common pitfalls and build robust, high-performance MongoDB applications."
category: "Database"
tags: ["MongoDB", "NoSQL", "Database Design", "Performance Optimization", "Backend", "Data Modeling", "Best Practices"]
thumbnail: "/images/posts/mongodb-best-practices.png"
author: "Putra Prassiesa Abimanyu"
---

# MongoDB Best Practices: Building Scalable NoSQL Applications

I've been working with MongoDB for over eight years now, from small startups to applications handling billions of documents. In that time, I've made plenty of mistakes—and learned from them. MongoDB's flexibility is both its greatest strength and biggest trap. Without proper patterns and discipline, you can end up with a database that's slow, difficult to maintain, and nearly impossible to scale.

This guide distills what I've learned into practical best practices. Whether you're starting a new MongoDB project or optimizing an existing one, these patterns will help you build something that scales gracefully and performs well under pressure.

## Understanding When to Choose MongoDB

Before diving into best practices, let's be honest about when MongoDB is the right choice. I've seen teams choose MongoDB for the wrong reasons—usually "we want to be cool and use NoSQL"—and regret it later.

MongoDB excels when:

- **Schema flexibility matters**: Your data structure evolves frequently
- **Horizontal scaling is crucial**: You need to scale across multiple servers
- **Document-oriented data**: Your data naturally groups into documents
- **High write throughput**: You're ingesting large volumes of data
- **Geographic distribution**: You need data close to users worldwide

MongoDB struggles when:

- **Complex transactions**: You need multi-document ACID transactions everywhere
- **Heavy aggregations**: Your use case is primarily analytical with complex joins
- **Fixed schema**: Your schema rarely changes and is highly relational
- **Budget constraints**: Proper MongoDB deployment requires resources

I once worked on a project where the team insisted on MongoDB for a heavily relational e-commerce system. We spent months fighting the database instead of letting it help us. Eventually, we migrated to PostgreSQL and productivity tripled. Choose the right tool for the job.

## Schema Design: The Foundation of MongoDB Performance

Schema design in MongoDB is fundamentally different from relational databases. The most important decision you'll make is how to model relationships.

### Embed vs Reference: The Crucial Decision

MongoDB gives you two ways to handle relationships: embedding related data in the same document or referencing it in separate collections. This choice affects everything—performance, scalability, and code complexity.

**Embed when:**
- Data is accessed together
- The relationship is one-to-few
- The embedded data won't grow unbounded
- You need atomic updates

**Reference when:**
- The relationship is one-to-many or many-to-many
- Related data is accessed independently
- The related data grows without bounds
- You need to share data across documents

Let me show you real examples. Here's a blog post where comments are embedded:

```javascript
// Embedded approach - good for blogs with moderate comments
{
  _id: ObjectId("..."),
  title: "Getting Started with MongoDB",
  author: "John Doe",
  content: "...",
  publishedAt: ISODate("2025-11-01"),
  comments: [
    {
      author: "Jane Smith",
      text: "Great article!",
      createdAt: ISODate("2025-11-02")
    },
    {
      author: "Bob Johnson",
      text: "Very helpful, thanks!",
      createdAt: ISODate("2025-11-03")
    }
  ],
  tags: ["mongodb", "databases", "tutorial"]
}
```

This works beautifully when you typically display posts with their comments. One query fetches everything. Performance is excellent.

But what if your posts go viral and get thousands of comments? That document becomes massive. MongoDB has a 16MB document size limit. Even before hitting that limit, large documents hurt performance.

For high-volume scenarios, reference instead:

```javascript
// Posts collection
{
  _id: ObjectId("..."),
  title: "Getting Started with MongoDB",
  author: "John Doe",
  content: "...",
  publishedAt: ISODate("2025-11-01"),
  tags: ["mongodb", "databases", "tutorial"],
  commentCount: 1247  // Denormalized count for display
}

// Comments collection
{
  _id: ObjectId("..."),
  postId: ObjectId("..."),  // Reference to post
  author: "Jane Smith",
  text: "Great article!",
  createdAt: ISODate("2025-11-02"),
  likes: 15
}
```

Now you can paginate comments efficiently and the post document stays small.

### The Hybrid Approach: Best of Both Worlds

Sometimes you want both. Embed what you need for display, reference for the full dataset:

```javascript
{
  _id: ObjectId("..."),
  title: "Getting Started with MongoDB",
  author: "John Doe",
  content: "...",
  publishedAt: ISODate("2025-11-01"),
  commentCount: 1247,
  recentComments: [  // Embed just the most recent few
    {
      author: "Jane Smith",
      text: "Great article!",
      createdAt: ISODate("2025-11-02")
    },
    {
      author: "Bob Johnson", 
      text: "Very helpful, thanks!",
      createdAt: ISODate("2025-11-03")
    }
  ],
  tags: ["mongodb", "databases", "tutorial"]
}
```

You get fast display of recent comments without fetching the comments collection, but can still query all comments when needed.

### Denormalization: Learn to Love It

In relational databases, normalization is gospel. In MongoDB, denormalization often improves performance. Don't be afraid to duplicate data when it makes sense.

Consider an e-commerce order:

```javascript
{
  _id: ObjectId("..."),
  orderNumber: "ORD-2025-001",
  customer: {
    id: ObjectId("..."),
    name: "Jane Doe",
    email: "jane@example.com",
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001"
    }
  },
  items: [
    {
      productId: ObjectId("..."),
      productName: "MongoDB Guide Book",  // Denormalized
      price: 29.99,  // Denormalized - price at time of order
      quantity: 2
    }
  ],
  total: 59.98,
  status: "shipped",
  createdAt: ISODate("2025-11-01")
}
```

We denormalized the product name and price. Why? Because orders are historical records. Even if the product name changes or price increases, this order should show what the customer actually bought.

The rule of thumb: denormalize data that you'll frequently read together and that doesn't change often—or where changes shouldn't affect historical records.

## Indexing: The Performance Multiplier

Indexes are the difference between queries that return in milliseconds and queries that take seconds. I've seen single indexes transform barely-usable applications into fast, responsive ones.

### Understanding Index Fundamentals

MongoDB uses B-tree indexes similar to relational databases. Without an index, MongoDB must scan every document (collection scan). With the right index, it finds documents instantly.

Check if your queries use indexes:

```javascript
db.posts.find({ author: "John Doe" }).explain("executionStats")
```

Look for `"stage": "IXSCAN"` (index scan) vs `"stage": "COLLSCAN"` (collection scan). Collection scans are red flags.

### Creating Effective Indexes

Single-field indexes are straightforward:

```javascript
// Index on publishedAt field
db.posts.createIndex({ publishedAt: -1 })

// Index on author field
db.posts.createIndex({ author: 1 })
```

The 1 means ascending, -1 means descending. For single-field indexes, direction rarely matters. For compound indexes, it's critical.

### Compound Indexes: Order Matters

Compound indexes support queries on multiple fields. The order of fields in the index significantly affects what queries it can support.

```javascript
// Compound index: author (ascending), publishedAt (descending)
db.posts.createIndex({ author: 1, publishedAt: -1 })
```

This index efficiently supports:

```javascript
// Uses the index efficiently
db.posts.find({ author: "John Doe" }).sort({ publishedAt: -1 })

// Uses the index (prefix)
db.posts.find({ author: "John Doe" })

// Cannot use this index efficiently
db.posts.find({ publishedAt: { $gte: ISODate("2025-01-01") } })
```

The ESR (Equality, Sort, Range) rule helps determine field order:

1. **Equality** fields first (author: "John Doe")
2. **Sort** fields second (sort by publishedAt)
3. **Range** fields last (publishedAt > date)

Example applying ESR:

```javascript
// Query with equality, sort, and range
db.orders.find({
  status: "shipped",  // Equality
  customerId: userId,  // Equality
  total: { $gte: 100 }  // Range
}).sort({ createdAt: -1 })  // Sort

// Optimal index: equality fields, then sort, then range
db.orders.createIndex({
  status: 1,
  customerId: 1,
  createdAt: -1,
  total: 1
})
```

### Covered Queries: The Ultimate Optimization

A covered query gets all data from the index without touching documents. These are incredibly fast.

```javascript
// Index including all queried and returned fields
db.users.createIndex({ email: 1, name: 1, age: 1 })

// Covered query - only uses the index
db.users.find(
  { email: "jane@example.com" },
  { _id: 0, name: 1, age: 1 }  // Exclude _id to make it covered
)
```

Note we excluded `_id`. By default, `_id` is always returned, and since it's stored in the document, the query wouldn't be covered. Excluding it makes the query covered.

### Index Management Strategy

Indexes aren't free. Each index:
- Uses disk space and RAM
- Slows down writes (must update the index)
- Increases maintenance overhead

My approach:

1. **Start with no indexes** (except _id)
2. **Monitor slow queries** in production
3. **Add indexes** for slow queries
4. **Remove unused indexes** periodically

Find unused indexes:

```javascript
db.posts.aggregate([{ $indexStats: {} }])
```

Look at `accesses.ops`. If an index has zero or very few accesses, consider removing it.

### Special Index Types

**Text indexes** for full-text search:

```javascript
db.posts.createIndex({ title: "text", content: "text" })

db.posts.find({ $text: { $search: "mongodb tutorial" } })
```

Text indexes are powerful but heavy. For serious full-text search, consider Elasticsearch.

**Geospatial indexes** for location queries:

```javascript
db.stores.createIndex({ location: "2dsphere" })

// Find stores near a location
db.stores.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-73.9857, 40.7484]  // [longitude, latitude]
      },
      $maxDistance: 5000  // meters
    }
  }
})
```

**TTL indexes** for automatic document expiration:

```javascript
// Automatically delete documents 30 days after createdAt
db.sessions.createIndex(
  { createdAt: 1 },
  { expireAfterSeconds: 2592000 }
)
```

Perfect for session data, temporary caches, or audit logs.

## Query Optimization Techniques

Good queries make good indexes work well. Bad queries waste good indexes.

### Projection: Don't Fetch What You Don't Need

Only retrieve fields you'll use:

```javascript
// Bad - fetches entire document
db.users.find({ status: "active" })

// Good - fetches only needed fields
db.users.find(
  { status: "active" },
  { name: 1, email: 1, _id: 0 }
)
```

This reduces network transfer and memory usage. With millions of documents, it's the difference between fast and slow.

### Limit Early, Limit Often

Always use `limit()` when you don't need all results:

```javascript
// Bad - fetches all matching documents
db.posts.find({ author: "John Doe" })

// Good - limits results
db.posts.find({ author: "John Doe" }).limit(20)
```

Even if you think there are only a few matches, someone will eventually have thousands. Plan for scale.

### Avoid Query Anti-Patterns

**Never use regex without anchoring:**

```javascript
// Bad - can't use index efficiently
db.users.find({ email: /gmail/ })

// Good - anchored to start, uses index
db.users.find({ email: /^john/ })
```

**Avoid $ne and $nin when possible:**

```javascript
// Bad - often requires full collection scan
db.posts.find({ status: { $ne: "draft" } })

// Better - query for what you want
db.posts.find({ status: { $in: ["published", "archived"] } })
```

**Don't use $where or $regex excessively:**

```javascript
// Very bad - executes JavaScript for every document
db.posts.find({ $where: "this.title.length > 20" })

// Better - use native operators
db.posts.find({ title: { $exists: true } })
```

### Pagination Done Right

Skip/limit pagination breaks down with large datasets:

```javascript
// Bad for large offsets
db.posts.find().skip(10000).limit(20)
```

Skip must iterate through all skipped documents. At large offsets, this is slow.

Instead, use range-based pagination:

```javascript
// First page
db.posts.find().sort({ _id: -1 }).limit(20)

// Next page - use last _id from previous page
db.posts.find({ _id: { $lt: lastId } })
  .sort({ _id: -1 })
  .limit(20)
```

This is fast regardless of page number because it uses the index on `_id`.

## Aggregation Pipeline Mastery

The aggregation framework is MongoDB's most powerful query tool. It processes documents through stages, each transforming the data.

### Basic Aggregation Structure

```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },  // Filter
  { $group: {  // Group and calculate
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { totalSpent: -1 } },  // Sort
  { $limit: 10 }  // Top 10 customers
])
```

### Aggregation Best Practices

**Filter early with $match:**

```javascript
// Good - filters first
db.orders.aggregate([
  { $match: { createdAt: { $gte: ISODate("2025-01-01") } } },
  { $group: { _id: "$customerId", total: { $sum: "$total" } } }
])

// Bad - processes all documents before filtering
db.orders.aggregate([
  { $group: { _id: "$customerId", total: { $sum: "$total" } } },
  { $match: { total: { $gte: 1000 } } }
])
```

**Use $project to reduce document size:**

```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $project: {  // Keep only needed fields
      customerId: 1,
      total: 1,
      createdAt: 1
    }
  },
  { $group: { ... } }
])
```

**Leverage indexes in early stages:**

Indexes only help in `$match`, `$sort`, and `$geoNear` stages—and only when they appear early in the pipeline.

```javascript
// Index is used
db.orders.aggregate([
  { $match: { status: "completed" } },  // Uses status index
  { $sort: { createdAt: -1 } },  // Uses createdAt index
  { $group: { ... } }
])

// Index not used efficiently
db.orders.aggregate([
  { $group: { ... } },
  { $match: { total: { $gte: 1000 } } }  // Too late for index
])
```

### Complex Aggregation Example

Here's a real-world aggregation that calculates customer lifetime value:

```javascript
db.orders.aggregate([
  // Stage 1: Filter to completed orders
  {
    $match: {
      status: "completed",
      createdAt: { $gte: ISODate("2024-01-01") }
    }
  },
  
  // Stage 2: Group by customer
  {
    $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$total" },
      orderCount: { $sum: 1 },
      firstOrder: { $min: "$createdAt" },
      lastOrder: { $max: "$createdAt" },
      avgOrderValue: { $avg: "$total" }
    }
  },
  
  // Stage 3: Calculate days since first order
  {
    $addFields: {
      daysSinceFirst: {
        $divide: [
          { $subtract: [new Date(), "$firstOrder"] },
          86400000  // milliseconds in a day
        ]
      }
    }
  },
  
  // Stage 4: Categorize customers
  {
    $addFields: {
      customerSegment: {
        $switch: {
          branches: [
            { case: { $gte: ["$totalSpent", 1000] }, then: "VIP" },
            { case: { $gte: ["$totalSpent", 500] }, then: "Premium" },
            { case: { $gte: ["$totalSpent", 100] }, then: "Regular" }
          ],
          default: "New"
        }
      }
    }
  },
  
  // Stage 5: Sort by total spent
  { $sort: { totalSpent: -1 } },
  
  // Stage 6: Lookup customer details
  {
    $lookup: {
      from: "customers",
      localField: "_id",
      foreignField: "_id",
      as: "customerInfo"
    }
  },
  
  // Stage 7: Reshape output
  {
    $project: {
      customerId: "$_id",
      customerName: { $arrayElemAt: ["$customerInfo.name", 0] },
      email: { $arrayElemAt: ["$customerInfo.email", 0] },
      totalSpent: 1,
      orderCount: 1,
      avgOrderValue: { $round: ["$avgOrderValue", 2] },
      customerSegment: 1,
      daysSinceFirst: { $round: ["$daysSinceFirst", 0] }
    }
  }
])
```

This pipeline demonstrates several powerful aggregation features: filtering, grouping, calculated fields, conditional logic, lookups (joins), and output reshaping.

## Data Modeling Patterns

Certain patterns solve common MongoDB challenges elegantly.

### The Subset Pattern

When you have large arrays but only need a subset, store both:

```javascript
{
  _id: ObjectId("..."),
  productName: "Popular Gadget",
  reviewCount: 5000,
  avgRating: 4.5,
  recentReviews: [  // Subset for display
    { author: "John", rating: 5, text: "Great!" },
    { author: "Jane", rating: 4, text: "Good quality" }
  ]
}

// Full reviews in separate collection
{
  _id: ObjectId("..."),
  productId: ObjectId("..."),
  author: "John",
  rating: 5,
  text: "Great product!",
  createdAt: ISODate("...")
}
```

### The Computed Pattern

Store pre-calculated values that are expensive to compute:

```javascript
{
  _id: ObjectId("..."),
  productId: ObjectId("..."),
  views: 15000,
  clicks: 1200,
  purchases: 150,
  // Computed metrics
  ctr: 0.08,  // clicks/views
  conversionRate: 0.125,  // purchases/clicks
  lastUpdated: ISODate("...")
}
```

Update these periodically with a background job rather than calculating on every request.

### The Bucket Pattern

For time-series data, bucket documents by time period:

```javascript
// Instead of one document per measurement
{
  _id: ObjectId("..."),
  sensorId: "sensor-001",
  timestamp: ISODate("2025-11-01T10:00:00Z"),
  temperature: 72.5
}

// Bucket by hour
{
  _id: ObjectId("..."),
  sensorId: "sensor-001",
  date: ISODate("2025-11-01T10:00:00Z"),
  measurements: [
    { time: 0, temp: 72.5 },
    { time: 60, temp: 72.8 },
    { time: 120, temp: 73.1 },
    // ... up to 60 measurements per hour
  ],
  count: 60,
  avgTemp: 72.9,
  minTemp: 72.5,
  maxTemp: 73.5
}
```

This reduces document count by orders of magnitude and improves query performance.

### The Schema Versioning Pattern

As your schema evolves, track versions:

```javascript
{
  _id: ObjectId("..."),
  schemaVersion: 2,
  // Version 2 fields
  name: "John Doe",
  email: "john@example.com",
  profile: {
    bio: "...",
    avatar: "..."
  }
}
```

Your application code can handle multiple versions:

```javascript
function getUser(doc) {
  if (doc.schemaVersion === 1) {
    return migrateV1ToV2(doc);
  }
  return doc;
}
```

This allows gradual migration without downtime.

## Connection Management and Drivers

How you connect to MongoDB affects application performance and reliability.

### Connection Pooling

Always use connection pools. Creating connections is expensive:

```javascript
const { MongoClient } = require('mongodb');

const client = new MongoClient(uri, {
  maxPoolSize: 50,  // Maximum connections
  minPoolSize: 10,  // Minimum connections
  maxIdleTimeMS: 30000,  // Close idle connections
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

await client.connect();
```

Pool size depends on your workload. Start with 10-50 and adjust based on monitoring.

### Handling Connection Errors

MongoDB connections can fail. Handle errors gracefully:

```javascript
const connectWithRetry = async (maxRetries = 5) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      return;
    } catch (err) {
      console.error(`Connection attempt ${i + 1} failed:`, err);
      if (i === maxRetries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 5000 * (i + 1)));
    }
  }
};
```

### Read and Write Concerns

Control consistency vs performance tradeoffs:

```javascript
// Write concern - wait for acknowledgment
await db.collection('orders').insertOne(
  { ... },
  { writeConcern: { w: 'majority', wtimeout: 5000 } }
);

// Read concern - read committed data
const orders = await db.collection('orders').find(
  { ... },
  { readConcern: { level: 'majority' } }
).toArray();
```

**Write concerns:**
- `w: 1` - Acknowledged by primary (default, fast)
- `w: 'majority'` - Acknowledged by majority (safer)
- `w: 0` - Unacknowledged (fastest, risky)

**Read concerns:**
- `local` - Latest data, may not be committed (default)
- `majority` - Only committed data
- `linearizable` - Strongest guarantee, slower

Use `majority` for critical data, `local` for performance.

## Security Best Practices

MongoDB security requires multiple layers of protection.

### Authentication and Authorization

Never run MongoDB without authentication:

```javascript
// Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "SecurePassword123!",
  roles: ["root"]
})

// Create application user with limited permissions
use myapp
db.createUser({
  user: "appUser",
  pwd: "AppPassword123!",
  roles: [
    { role: "readWrite", db: "myapp" }
  ]
})
```

Use role-based access control (RBAC) to limit privileges.

### Network Security

**Enable TLS/SSL:**

```javascript
const client = new MongoClient(uri, {
  ssl: true,
  sslValidate: true,
  sslCA: fs.readFileSync('/path/to/ca.pem')
});
```

**Bind to specific interfaces:**

```yaml
# mongod.conf
net:
  bindIp: 127.0.0.1,10.0.1.5
  port: 27017
```

Don't bind to 0.0.0.0 in production unless behind a firewall.

**Use IP whitelisting:**

Only allow connections from known IPs.

### Data Encryption

**Encryption at rest:**

```yaml
# mongod.conf
security:
  enableEncryption: true
  encryptionKeyFile: /path/to/keyfile
```

**Field-level encryption:**

For sensitive fields like credit cards or SSNs:

```javascript
const { ClientEncryption } = require('mongodb-client-encryption');

const encryption = new ClientEncryption(client, {
  keyVaultNamespace: 'encryption.__keyVault',
  kmsProviders: { ... }
});

// Encrypt sensitive data
const encrypted = await encryption.encrypt(ssn, {
  algorithm: 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic',
  keyId: dataKey
});

await db.collection('users').insertOne({
  name: "John Doe",
  ssn: encrypted  // Encrypted field
});
```

## Backup and Disaster Recovery

Backups are insurance you hope to never use but desperately need when disaster strikes.

### Backup Strategies

**mongodump for smaller databases:**

```bash
mongodump --uri="mongodb://username:password@host:port/database" --out=/backup/2025-11-01
```

**Filesystem snapshots for larger databases:**

Use LVM snapshots or cloud provider snapshots for minimal downtime.

**Continuous backup with Ops Manager or Atlas:**

For critical production systems, use MongoDB's continuous backup solutions.

### Testing Restores

Backups you can't restore are useless. Test regularly:

```bash
mongorestore --uri="mongodb://localhost:27017" --drop /backup/2025-11-01
```

### Point-in-Time Recovery

With replica sets and oplogs, you can recover to any point in time:

```bash
mongorestore --oplogReplay --oplogLimit=1635724800:1 /backup/2025-11-01
```

This requires continuous backup solutions like MongoDB Atlas or Ops Manager.

## Scaling MongoDB: Replica Sets and Sharding

Scaling MongoDB involves two strategies: replica sets for redundancy and read scaling, sharding for write scaling and storage capacity.

### Replica Sets

A replica set is a group of MongoDB instances that maintain the same dataset:

```javascript
// Connect to replica set
const uri = "mongodb://host1:27017,host2:27017,host3:27017/myapp?replicaSet=rs0";
const client = new MongoClient(uri);
```

Benefits:
- **High availability**: Automatic failover if primary fails
- **Read scaling**: Distribute reads across secondaries
- **Backup source**: Take backups from secondaries

Configure read preference:

```javascript
// Read from primary (default)
db.collection('users').find({}, { readPreference: 'primary' });

// Read from secondaries when possible
db.collection('users').find({}, { readPreference: 'secondaryPreferred' });
```

### Sharding

Sharding distributes data across multiple servers. Use it when:
- Single server can't hold all data
- Write load exceeds single server capacity
- You need geographic distribution

Choose a shard key carefully—it's difficult to change:

```javascript
// Shard by userId - distributes users across shards
sh.shardCollection("myapp.users", { userId: "hashed" })

// Shard by date and customerId - range-based
sh.shardCollection("myapp.orders", { createdAt: 1, customerId: 1 })
```

**Shard key guidelines:**
- High cardinality (many unique values)
- Even distribution (no hot spots)
- Matches common query patterns
- Monotonically increasing keys need hashing

## Monitoring and Performance Tuning

You can't improve what you don't measure.

### Key Metrics to Monitor

**Operations:**
- Queries per second
- Inserts/updates/deletes per second
- Connection count

**Performance:**
- Query execution time
- Index usage
- Page faults

**Resources:**
- Memory usage
- Disk I/O
- Network throughput

### Useful Monitoring Commands

```javascript
// Current operations
db.currentOp()

// Server status
db.serverStatus()

// Collection statistics
db.collection('users').stats()

// Find slow queries (>100ms)
db.system.profile.find({ millis: { $gt: 100 } }).sort({ ts: -1 })
```

### Enabling Profiling

```javascript
// Profile slow queries (>100ms)
db.setProfilingLevel(1, { slowms: 100 })

// Profile all queries (only for debugging)
db.setProfilingLevel(2)

// Disable profiling
db.setProfilingLevel(0)
```

Review the profiler output to find optimization opportunities.

## Conclusion

MongoDB's flexibility is powerful but requires discipline. The patterns I've shared—thoughtful schema design, strategic indexing, efficient queries, proper connection management, strong security, and comprehensive monitoring—form the foundation of successful MongoDB applications.

Start with these practices from day one. They're easier to implement initially than to retrofit later. Your future self will thank you when the application scales smoothly instead of collapsing under load.

Remember that MongoDB is a tool, not a religion. Use it where it fits. Don't force it where it doesn't. And always, always test your assumptions with real data and real load. What works for thousands of documents might fail with millions.

Build something great, and build it to scale.
