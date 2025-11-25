---
name: "FitTrack - AI-Powered Fitness Companion"
year: 2023
studyCase: "Client Work"
description: "A comprehensive fitness tracking application with AI-powered workout recommendations, nutrition tracking, and social features for fitness enthusiasts."
techStack: ["React Native", "TypeScript", "Firebase", "TensorFlow.js", "Expo", "Reanimated"]
thumbnail: "/images/projects/fitness-tracker.jpg"
linkLive: "https://apps.apple.com/app/fittrack"
---

## Project Background

FitTrack was commissioned by a health and wellness startup looking to enter the competitive fitness app market. The client wanted to differentiate their product through AI-powered personalization and a strong community aspect.

### Client Requirements

- Cross-platform mobile app (iOS & Android)
- AI-driven workout recommendations
- Nutrition tracking with barcode scanning
- Social features for community engagement
- Wearable device integration
- Offline functionality
- HIPAA compliance for health data

### Project Timeline

- **Discovery & Planning**: 2 weeks
- **Design**: 3 weeks
- **Development**: 12 weeks
- **Testing & QA**: 2 weeks
- **Launch & Support**: Ongoing

## Features Overview

### Workout Tracking

- **Exercise Library**: 500+ exercises with video demonstrations
- **Custom Workouts**: Create and save personalized routines
- **Progress Tracking**: Track sets, reps, weight, and rest times
- **Form Analysis**: AI-powered form checking using device camera
- **Workout History**: Comprehensive logs with charts and insights

### AI Recommendations

- **Personalized Plans**: ML model generates custom workout plans
- **Adaptive Difficulty**: Adjusts based on performance and feedback
- **Recovery Optimization**: Suggests rest days based on training load
- **Exercise Alternatives**: Recommends substitutions for equipment/injuries

### Nutrition Tracking

- **Barcode Scanner**: Instant food logging
- **Macro Tracking**: Monitor protein, carbs, and fats
- **Meal Planning**: AI-suggested meal plans based on goals
- **Water Intake**: Hydration tracking with reminders
- **Recipe Database**: Healthy recipes with nutritional info

### Social Features

- **Activity Feed**: Share workouts and achievements
- **Challenges**: Join or create fitness challenges
- **Leaderboards**: Compete with friends and community
- **Direct Messaging**: Connect with workout buddies
- **Groups**: Join interest-based fitness communities

## Technical Architecture

### Mobile App Architecture

Built with React Native for cross-platform development:

```
src/
├── components/
│   ├── workout/
│   ├── nutrition/
│   └── social/
├── screens/
│   ├── WorkoutScreen/
│   ├── NutritionScreen/
│   └── ProfileScreen/
├── navigation/
├── services/
│   ├── api/
│   ├── ml/
│   └── storage/
├── hooks/
├── utils/
└── store/
```

### State Management

Used Redux Toolkit with Redux Persist for offline support:

```typescript
// Store configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['workouts', 'nutrition', 'user'],
};

const rootReducer = combineReducers({
  user: userReducer,
  workouts: workoutsReducer,
  nutrition: nutritionReducer,
  social: socialReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
```

### Backend Infrastructure

Firebase was chosen for rapid development and scalability:

- **Authentication**: Firebase Auth with email/social login
- **Database**: Firestore for real-time data sync
- **Storage**: Firebase Storage for images and videos
- **Functions**: Cloud Functions for serverless backend logic
- **Analytics**: Firebase Analytics for user insights
- **Crashlytics**: Real-time crash reporting

### AI/ML Implementation

#### Workout Recommendation Engine

Implemented using TensorFlow.js:

```typescript
// Model training data structure
interface TrainingData {
  userProfile: {
    age: number;
    weight: number;
    height: number;
    fitnessLevel: number;
    goals: string[];
  };
  workoutHistory: Workout[];
  preferences: {
    equipment: string[];
    duration: number;
    intensity: number;
  };
}

// Recommendation model
class WorkoutRecommender {
  private model: tf.LayersModel;

  async loadModel() {
    this.model = await tf.loadLayersModel('model.json');
  }

  async recommend(userData: TrainingData): Promise<Workout[]> {
    const inputTensor = this.preprocessData(userData);
    const predictions = this.model.predict(inputTensor) as tf.Tensor;
    const workouts = await this.postprocessPredictions(predictions);
    return workouts;
  }

  private preprocessData(data: TrainingData): tf.Tensor {
    // Normalize and encode user data
    const features = [
      data.userProfile.age / 100,
      data.userProfile.weight / 200,
      data.userProfile.fitnessLevel / 10,
      // ... more features
    ];
    return tf.tensor2d([features]);
  }
}
```

#### Form Analysis

Used TensorFlow Lite for on-device pose estimation:

```typescript
import * as poseDetection from '@tensorflow-models/pose-detection';

class FormAnalyzer {
  private detector: poseDetection.PoseDetector;

  async initialize() {
    const model = poseDetection.SupportedModels.MoveNet;
    this.detector = await poseDetection.createDetector(model, {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    });
  }

  async analyzePose(imageData: ImageData): Promise<FormFeedback> {
    const poses = await this.detector.estimatePoses(imageData);
    
    if (poses.length === 0) {
      return { error: 'No person detected' };
    }

    const keypoints = poses[0].keypoints;
    const feedback = this.evaluateForm(keypoints);
    
    return feedback;
  }

  private evaluateForm(keypoints: Keypoint[]): FormFeedback {
    // Calculate angles and positions
    const shoulderAngle = this.calculateAngle(
      keypoints.find(k => k.name === 'left_shoulder'),
      keypoints.find(k => k.name === 'left_elbow'),
      keypoints.find(k => k.name === 'left_wrist')
    );

    // Provide feedback based on exercise type
    return {
      score: this.calculateScore(shoulderAngle),
      suggestions: this.generateSuggestions(shoulderAngle),
    };
  }
}
```

## Key Features Implementation

### Barcode Scanner

Integrated with Open Food Facts API:

```typescript
import { RNCamera } from 'react-native-camera';

const BarcodeScanner = () => {
  const onBarCodeRead = async (event: BarCodeReadEvent) => {
    const barcode = event.data;
    
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await response.json();
      
      if (data.status === 1) {
        const nutritionData = {
          name: data.product.product_name,
          calories: data.product.nutriments.energy_kcal,
          protein: data.product.nutriments.proteins,
          carbs: data.product.nutriments.carbohydrates,
          fat: data.product.nutriments.fat,
        };
        
        dispatch(addFood(nutritionData));
      }
    } catch (error) {
      console.error('Failed to fetch food data:', error);
    }
  };

  return (
    <RNCamera
      onBarCodeRead={onBarCodeRead}
      barCodeTypes={[RNCamera.Constants.BarCodeType.ean13]}
    />
  );
};
```

### Wearable Integration

Integrated with Apple HealthKit and Google Fit:

```typescript
import AppleHealthKit from 'react-native-health';

class HealthDataSync {
  async syncSteps(date: Date): Promise<number> {
    const options = {
      date: date.toISOString(),
      includeManuallyAdded: false,
    };

    return new Promise((resolve, reject) => {
      AppleHealthKit.getStepCount(options, (err, results) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(results.value);
      });
    });
  }

  async syncWorkout(workout: Workout): Promise<void> {
    const options = {
      type: 'Running',
      startDate: workout.startTime.toISOString(),
      endDate: workout.endTime.toISOString(),
      energyBurned: workout.caloriesBurned,
      distance: workout.distance,
    };

    return new Promise((resolve, reject) => {
      AppleHealthKit.saveWorkout(options, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }
}
```

### Offline Functionality

Implemented offline-first architecture:

```typescript
// Network-aware API client
class ApiClient {
  async request(endpoint: string, options: RequestOptions) {
    const isOnline = await NetInfo.fetch().then(state => state.isConnected);

    if (!isOnline) {
      // Queue request for later
      await this.queueOfflineRequest(endpoint, options);
      
      // Return cached data if available
      const cached = await this.getCachedResponse(endpoint);
      if (cached) return cached;
      
      throw new Error('No internet connection');
    }

    try {
      const response = await fetch(endpoint, options);
      await this.cacheResponse(endpoint, response);
      return response;
    } catch (error) {
      // Fallback to cache
      const cached = await this.getCachedResponse(endpoint);
      if (cached) return cached;
      throw error;
    }
  }

  private async syncOfflineQueue() {
    const queue = await AsyncStorage.getItem('offline_queue');
    if (!queue) return;

    const requests = JSON.parse(queue);
    
    for (const request of requests) {
      try {
        await this.request(request.endpoint, request.options);
      } catch (error) {
        console.error('Failed to sync request:', error);
      }
    }

    await AsyncStorage.removeItem('offline_queue');
  }
}
```

## Performance Optimizations

### Animation Performance

Used React Native Reanimated for 60fps animations:

```typescript
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

const WorkoutCard = ({ workout }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPressIn = () => {
    scale.value = withSpring(0.95);
  };

  const onPressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
        {/* Card content */}
      </Pressable>
    </Animated.View>
  );
};
```

### Image Optimization

Implemented progressive image loading:

```typescript
import FastImage from 'react-native-fast-image';

const OptimizedImage = ({ uri, placeholder }) => {
  return (
    <FastImage
      source={{
        uri,
        priority: FastImage.priority.normal,
        cache: FastImage.cacheControl.immutable,
      }}
      resizeMode={FastImage.resizeMode.cover}
      fallback
    />
  );
};
```

### List Performance

Used FlashList for better list performance:

```typescript
import { FlashList } from '@shopify/flash-list';

const WorkoutHistory = ({ workouts }) => {
  const renderItem = useCallback(({ item }) => (
    <WorkoutCard workout={item} />
  ), []);

  return (
    <FlashList
      data={workouts}
      renderItem={renderItem}
      estimatedItemSize={100}
      keyExtractor={item => item.id}
    />
  );
};
```

## Security & Privacy

### Data Encryption

Implemented end-to-end encryption for sensitive health data:

```typescript
import CryptoJS from 'crypto-js';

class EncryptionService {
  private key: string;

  constructor(userKey: string) {
    this.key = userKey;
  }

  encrypt(data: any): string {
    const jsonString = JSON.stringify(data);
    return CryptoJS.AES.encrypt(jsonString, this.key).toString();
  }

  decrypt(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.key);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  }
}
```

### HIPAA Compliance

- Encrypted data at rest and in transit
- Audit logging for all data access
- User consent management
- Data retention policies
- Secure authentication with MFA

## Testing Strategy

### Unit Tests (Jest)

```typescript
describe('WorkoutRecommender', () => {
  it('should recommend appropriate workouts for beginners', async () => {
    const recommender = new WorkoutRecommender();
    await recommender.loadModel();

    const userData = {
      userProfile: { fitnessLevel: 1, goals: ['weight_loss'] },
      workoutHistory: [],
      preferences: { intensity: 'low' },
    };

    const workouts = await recommender.recommend(userData);
    
    expect(workouts).toHaveLength(5);
    expect(workouts.every(w => w.difficulty === 'beginner')).toBe(true);
  });
});
```

### Integration Tests (Detox)

```typescript
describe('Workout Flow', () => {
  it('should complete a workout session', async () => {
    await element(by.id('workouts-tab')).tap();
    await element(by.id('start-workout-btn')).tap();
    await element(by.id('exercise-1')).tap();
    await element(by.id('complete-set-btn')).tap();
    await element(by.id('finish-workout-btn')).tap();
    
    await expect(element(by.text('Workout Complete!'))).toBeVisible();
  });
});
```

## Deployment & Release

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-ios:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Build iOS
        run: expo build:ios --release-channel production
      - name: Upload to TestFlight
        run: fastlane ios beta

  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Android
        run: expo build:android --release-channel production
      - name: Upload to Play Store
        run: fastlane android beta
```

## Results & Impact

### User Metrics

- **Downloads**: 50,000+ in first 6 months
- **Active Users**: 15,000+ monthly active users
- **Retention**: 65% 30-day retention rate
- **Rating**: 4.7/5 stars (App Store), 4.5/5 (Play Store)

### Business Impact

- Featured in App Store "Apps We Love"
- $250K+ in subscription revenue (first year)
- Acquired by major fitness brand (under NDA)

### Performance Metrics

- **App Size**: 45MB (iOS), 38MB (Android)
- **Startup Time**: < 2s
- **Crash-free Rate**: 99.8%
- **API Response Time**: < 300ms (p95)

## Lessons Learned

1. **AI Requires Data**: ML models need significant training data to be effective
2. **Battery Life Matters**: Background tracking must be optimized carefully
3. **Privacy is Critical**: Health data requires extra security measures
4. **Cross-platform Challenges**: Platform-specific features require native modules
5. **User Feedback Drives Features**: Most valuable features came from user requests

## Conclusion

FitTrack successfully combined AI technology with user-centric design to create a compelling fitness app. The project demonstrated the viability of AI-powered personalization in the health and wellness space and resulted in a successful acquisition.
