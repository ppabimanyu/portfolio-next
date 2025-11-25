---
name: "StreamVibe - Live Streaming Platform"
year: 2024
studyCase: "Startup"
description: "A scalable live streaming platform with real-time chat, monetization features, and advanced analytics for content creators and viewers."
techStack: ["Vue.js", "Nuxt", "WebRTC", "Node.js", "Kubernetes", "Redis", "FFmpeg", "AWS"]
thumbnail: "/images/projects/streaming-platform.jpg"
linkLive: "https://streamvibe.live"
linkGithub: "https://github.com/yourusername/streamvibe"
---

## Project Background

StreamVibe was built for a startup aiming to compete in the live streaming market. The platform needed to handle thousands of concurrent viewers, provide low-latency streaming, and offer monetization tools for creators.

### Business Goals

- **Creator-First**: Empower content creators with tools and monetization
- **Low Latency**: Sub-second latency for interactive experiences
- **Scalable**: Handle viral streams with millions of viewers
- **Monetization**: Multiple revenue streams for creators
- **Community**: Foster engaged communities around creators

### Technical Challenges

- Real-time video streaming at scale
- Low-latency chat with thousands of participants
- Payment processing and payouts
- Content moderation
- Global CDN distribution

## Platform Features

### Live Streaming

- **Multi-bitrate Streaming**: Adaptive bitrate for all network conditions
- **Low Latency**: < 3 second glass-to-glass latency
- **Recording**: Automatic VOD creation
- **Simulcast**: Stream to multiple platforms simultaneously
- **Screen Sharing**: Share screen with viewers

### Interactive Features

- **Real-time Chat**: Scalable chat with emotes and badges
- **Polls & Predictions**: Engage viewers with interactive elements
- **Donations**: Real-time tipping with on-stream alerts
- **Subscriptions**: Monthly recurring revenue for creators
- **Channel Points**: Gamification and viewer rewards

### Creator Tools

- **Stream Dashboard**: Real-time analytics during streams
- **Moderation Tools**: Chat moderation and user management
- **Alerts & Overlays**: Customizable stream overlays
- **Revenue Analytics**: Detailed earnings breakdown
- **Audience Insights**: Viewer demographics and behavior

### Viewer Experience

- **Theater Mode**: Immersive viewing experience
- **Picture-in-Picture**: Watch while browsing
- **Mobile Apps**: Native iOS and Android apps
- **Chromecast Support**: Cast to TV
- **Offline Viewing**: Download VODs for offline viewing

## Technical Architecture

### High-Level Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Streamer│────►│  Ingest  │────►│  Origin  │
│   (OBS)  │     │  Servers │     │  Servers │
└──────────┘     └──────────┘     └──────────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │   CDN    │
                                  │  (Edge)  │
                                  └──────────┘
                                        │
                                        ▼
                                  ┌──────────┐
                                  │ Viewers  │
                                  └──────────┘
```

### Streaming Infrastructure

#### Ingest Layer

RTMP servers for receiving streams:

```javascript
// RTMP server using Node-Media-Server
const NodeMediaServer = require('node-media-server');

const config = {
  rtmp: {
    port: 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
  },
  http: {
    port: 8000,
    allow_origin: '*',
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]',
      },
    ],
  },
};

const nms = new NodeMediaServer(config);

nms.on('prePublish', async (id, StreamPath, args) => {
  const streamKey = getStreamKeyFromPath(StreamPath);
  
  // Verify stream key
  const isValid = await verifyStreamKey(streamKey);
  
  if (!isValid) {
    const session = nms.getSession(id);
    session.reject();
    return;
  }

  // Start transcoding
  await startTranscoding(streamKey);
});

nms.run();
```

#### Transcoding Pipeline

FFmpeg-based adaptive bitrate encoding:

```javascript
const ffmpeg = require('fluent-ffmpeg');

async function transcodeStream(inputUrl, streamKey) {
  const outputs = [
    { resolution: '1920x1080', bitrate: '6000k', name: '1080p' },
    { resolution: '1280x720', bitrate: '3000k', name: '720p' },
    { resolution: '854x480', bitrate: '1500k', name: '480p' },
    { resolution: '640x360', bitrate: '800k', name: '360p' },
  ];

  const command = ffmpeg(inputUrl);

  outputs.forEach(output => {
    command
      .output(`s3://streams/${streamKey}/${output.name}/index.m3u8`)
      .videoCodec('libx264')
      .videoBitrate(output.bitrate)
      .size(output.resolution)
      .audioCodec('aac')
      .audioBitrate('128k')
      .format('hls')
      .outputOptions([
        '-hls_time 2',
        '-hls_list_size 3',
        '-hls_flags delete_segments',
        '-preset veryfast',
        '-g 60',
        '-sc_threshold 0',
      ]);
  });

  command
    .on('start', (cmd) => {
      console.log('Transcoding started:', cmd);
    })
    .on('error', (err) => {
      console.error('Transcoding error:', err);
    })
    .on('end', () => {
      console.log('Transcoding finished');
    })
    .run();
}
```

### Frontend Application

Built with Nuxt.js for SSR and SEO:

```
streamvibe-web/
├── components/
│   ├── player/
│   │   ├── VideoPlayer.vue
│   │   ├── ChatPanel.vue
│   │   └── StreamInfo.vue
│   ├── creator/
│   │   ├── Dashboard.vue
│   │   └── Analytics.vue
│   └── common/
├── pages/
│   ├── index.vue
│   ├── [channel].vue
│   └── dashboard/
├── plugins/
│   ├── video-player.client.js
│   └── websocket.client.js
└── store/
    ├── stream.js
    ├── chat.js
    └── user.js
```

#### Video Player Implementation

Custom HLS player with low-latency optimizations:

```vue
<template>
  <div class="video-player">
    <video
      ref="videoElement"
      class="video-element"
      @play="onPlay"
      @pause="onPause"
      @error="onError"
    />
    <PlayerControls
      :is-playing="isPlaying"
      :volume="volume"
      :quality="currentQuality"
      @play="play"
      @pause="pause"
      @volume-change="setVolume"
      @quality-change="setQuality"
    />
  </div>
</template>

<script>
import Hls from 'hls.js';

export default {
  props: {
    src: String,
    autoplay: Boolean,
  },

  data() {
    return {
      hls: null,
      isPlaying: false,
      volume: 1,
      currentQuality: 'auto',
    };
  },

  mounted() {
    this.initPlayer();
  },

  methods: {
    initPlayer() {
      if (Hls.isSupported()) {
        this.hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 10,
          maxMaxBufferLength: 20,
          liveSyncDuration: 1,
          liveMaxLatencyDuration: 3,
        });

        this.hls.loadSource(this.src);
        this.hls.attachMedia(this.$refs.videoElement);

        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (this.autoplay) {
            this.play();
          }
        });

        this.hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            this.handleError(data);
          }
        });
      }
    },

    play() {
      this.$refs.videoElement.play();
      this.isPlaying = true;
    },

    pause() {
      this.$refs.videoElement.pause();
      this.isPlaying = false;
    },

    setVolume(volume) {
      this.$refs.videoElement.volume = volume;
      this.volume = volume;
    },

    setQuality(quality) {
      if (quality === 'auto') {
        this.hls.currentLevel = -1;
      } else {
        const levelIndex = this.hls.levels.findIndex(
          level => level.height === parseInt(quality)
        );
        this.hls.currentLevel = levelIndex;
      }
      this.currentQuality = quality;
    },
  },
};
</script>
```

### Real-time Chat System

Scalable chat using WebSockets and Redis Pub/Sub:

```javascript
// Chat server
const WebSocket = require('ws');
const Redis = require('ioredis');

class ChatServer {
  constructor() {
    this.wss = new WebSocket.Server({ port: 8080 });
    this.redis = new Redis();
    this.redisSub = new Redis();
    this.rooms = new Map();
    
    this.setupWebSocket();
    this.setupRedis();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      ws.on('message', (message) => {
        this.handleMessage(ws, JSON.parse(message));
      });

      ws.on('close', () => {
        this.handleDisconnect(ws);
      });
    });
  }

  setupRedis() {
    this.redisSub.psubscribe('chat:*');
    
    this.redisSub.on('pmessage', (pattern, channel, message) => {
      const roomId = channel.split(':')[1];
      this.broadcastToRoom(roomId, JSON.parse(message));
    });
  }

  handleMessage(ws, message) {
    switch (message.type) {
      case 'join':
        this.joinRoom(ws, message.roomId, message.userId);
        break;
      case 'message':
        this.sendMessage(message.roomId, message.userId, message.text);
        break;
      case 'leave':
        this.leaveRoom(ws, message.roomId);
        break;
    }
  }

  joinRoom(ws, roomId, userId) {
    ws.roomId = roomId;
    ws.userId = userId;

    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId).add(ws);

    // Publish join event
    this.redis.publish(`chat:${roomId}`, JSON.stringify({
      type: 'user_joined',
      userId,
      timestamp: Date.now(),
    }));
  }

  async sendMessage(roomId, userId, text) {
    // Store message
    const message = {
      id: generateId(),
      roomId,
      userId,
      text,
      timestamp: Date.now(),
    };

    await this.redis.zadd(
      `messages:${roomId}`,
      message.timestamp,
      JSON.stringify(message)
    );

    // Publish message
    await this.redis.publish(`chat:${roomId}`, JSON.stringify({
      type: 'message',
      ...message,
    }));
  }

  broadcastToRoom(roomId, data) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }
}

const chatServer = new ChatServer();
```

### Monetization System

Stripe integration for payments:

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class PaymentService {
  async createSubscription(userId, creatorId, planId) {
    const user = await User.findById(userId);
    const creator = await User.findById(creatorId);

    // Create or retrieve customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await User.updateOne({ _id: userId }, { stripeCustomerId: customerId });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      application_fee_percent: 10, // Platform fee
      transfer_data: {
        destination: creator.stripeAccountId,
      },
      metadata: {
        userId,
        creatorId,
      },
    });

    return subscription;
  }

  async processDonation(userId, creatorId, amount) {
    const creator = await User.findById(creatorId);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      application_fee_amount: Math.floor(amount * 0.05 * 100), // 5% platform fee
      transfer_data: {
        destination: creator.stripeAccountId,
      },
      metadata: {
        userId,
        creatorId,
        type: 'donation',
      },
    });

    return paymentIntent;
  }

  async createConnectedAccount(userId) {
    const user = await User.findById(userId);

    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    await User.updateOne({ _id: userId }, { stripeAccountId: account.id });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.APP_URL}/dashboard/payouts/refresh`,
      return_url: `${process.env.APP_URL}/dashboard/payouts/complete`,
      type: 'account_onboarding',
    });

    return accountLink.url;
  }
}
```

## Scaling Strategy

### Kubernetes Deployment

Containerized microservices on Kubernetes:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: streamvibe-web
spec:
  replicas: 5
  selector:
    matchLabels:
      app: streamvibe-web
  template:
    metadata:
      labels:
        app: streamvibe-web
    spec:
      containers:
      - name: web
        image: streamvibe/web:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: streamvibe-web
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: streamvibe-web
```

### CDN Strategy

Multi-CDN approach for global reach:

- **Primary**: CloudFront for main distribution
- **Fallback**: Fastly for redundancy
- **Regional**: Regional CDNs for specific markets

### Database Sharding

Sharded MongoDB for horizontal scaling:

```javascript
// Shard key: userId
sh.shardCollection("streamvibe.users", { userId: 1 });
sh.shardCollection("streamvibe.streams", { creatorId: 1 });
sh.shardCollection("streamvibe.messages", { roomId: "hashed" });
```

## Results & Impact

### Platform Metrics

- **Concurrent Viewers**: 100,000+ peak
- **Monthly Streamers**: 10,000+
- **Total Watch Time**: 5M+ hours/month
- **Revenue Processed**: $500K+/month

### Performance

- **Latency**: 2.5s average glass-to-glass
- **Uptime**: 99.95%
- **Chat Throughput**: 10,000 messages/second
- **CDN Hit Rate**: 95%+

### Business Impact

- Seed funding raised: $2M
- Series A in progress
- Featured in TechCrunch
- Partnership with major gaming brand

## Lessons Learned

1. **Start Simple**: MVP with basic features, iterate based on usage
2. **Latency Matters**: Every second of latency impacts engagement
3. **Moderation is Critical**: Invest in moderation tools early
4. **Creator Success = Platform Success**: Focus on creator tools
5. **Infrastructure Costs**: Video streaming is expensive, optimize aggressively

## Conclusion

StreamVibe demonstrates the complexity and scale required for modern live streaming platforms. The project combined cutting-edge video technology with creator-focused features to build a competitive platform in a crowded market.
