---
name: "SmartHome Hub - IoT Control Center"
year: 2023
studyCase: "Freelance"
description: "A unified smart home control system that integrates multiple IoT devices and platforms with voice control, automation, and energy monitoring."
techStack: ["Svelte", "SvelteKit", "MQTT", "Python", "Raspberry Pi", "Home Assistant", "InfluxDB", "Grafana"]
thumbnail: "/images/projects/smart-home-hub.jpg"
linkGithub: "https://github.com/yourusername/smarthome-hub"
---

## Project Overview

SmartHome Hub was developed for a client who wanted a unified interface to control their extensive collection of smart home devices from different manufacturers. The system needed to be reliable, fast, and work offline.

### Client Requirements

- **Unified Control**: Single interface for all devices (Philips Hue, Nest, Sonos, etc.)
- **Voice Control**: Integration with Alexa and Google Assistant
- **Automation**: Complex automation rules and scenes
- **Energy Monitoring**: Track energy consumption
- **Offline Operation**: Must work without internet
- **Mobile Access**: Control from anywhere
- **Privacy**: All data stays local

### Project Scope

- Custom dashboard web application
- Backend integration layer
- Mobile-responsive design
- Voice assistant integration
- Automation engine
- Energy monitoring system
- Deployment on local Raspberry Pi

## System Architecture

### High-Level Design

```
┌─────────────┐
│   Devices   │ (Lights, Thermostats, Cameras, etc.)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    MQTT     │ (Message Broker)
│   Broker    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Home      │ (Integration Layer)
│  Assistant  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  SvelteKit  │ (Web Dashboard)
│     App     │
└─────────────┘
```

### Technology Stack Rationale

**SvelteKit**: Chosen for its small bundle size and excellent performance on Raspberry Pi

**MQTT**: Lightweight protocol perfect for IoT device communication

**Home Assistant**: Mature platform with extensive device integrations

**InfluxDB**: Time-series database for sensor data and energy metrics

**Grafana**: Powerful visualization for energy monitoring

## Frontend Implementation

### Dashboard Interface

Built with SvelteKit for optimal performance:

```
src/
├── routes/
│   ├── +page.svelte           # Dashboard home
│   ├── rooms/
│   │   └── [id]/+page.svelte  # Room control
│   ├── devices/
│   │   └── [id]/+page.svelte  # Device details
│   ├── automations/
│   │   └── +page.svelte       # Automation rules
│   └── energy/
│       └── +page.svelte       # Energy monitoring
├── lib/
│   ├── components/
│   │   ├── DeviceCard.svelte
│   │   ├── RoomCard.svelte
│   │   └── AutomationRule.svelte
│   ├── stores/
│   │   ├── devices.js
│   │   └── mqtt.js
│   └── api/
└── app.html
```

### Real-time Device Control

MQTT integration for instant updates:

```svelte
<!-- DeviceCard.svelte -->
<script>
  import { onMount, onDestroy } from 'svelte';
  import { mqttStore } from '$lib/stores/mqtt';

  export let device;

  let state = device.state;
  let unsubscribe;

  onMount(() => {
    // Subscribe to device state updates
    unsubscribe = mqttStore.subscribe(
      `homeassistant/${device.type}/${device.id}/state`,
      (message) => {
        state = JSON.parse(message);
      }
    );
  });

  onDestroy(() => {
    if (unsubscribe) unsubscribe();
  });

  async function toggleDevice() {
    const newState = !state.on;
    
    // Optimistic update
    state = { ...state, on: newState };

    // Send command
    await mqttStore.publish(
      `homeassistant/${device.type}/${device.id}/set`,
      JSON.stringify({ on: newState })
    );
  }

  async function setBrightness(value) {
    state = { ...state, brightness: value };
    
    await mqttStore.publish(
      `homeassistant/${device.type}/${device.id}/set`,
      JSON.stringify({ brightness: value })
    );
  }
</script>

<div class="device-card" class:on={state.on}>
  <div class="device-header">
    <h3>{device.name}</h3>
    <span class="device-type">{device.type}</span>
  </div>

  <div class="device-controls">
    <button on:click={toggleDevice}>
      {state.on ? 'Turn Off' : 'Turn On'}
    </button>

    {#if device.type === 'light' && state.on}
      <input
        type="range"
        min="0"
        max="100"
        value={state.brightness}
        on:input={(e) => setBrightness(e.target.value)}
      />
    {/if}
  </div>

  <div class="device-status">
    <span>Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}</span>
  </div>
</div>

<style>
  .device-card {
    background: var(--card-bg);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
  }

  .device-card.on {
    border-left: 4px solid var(--primary-color);
  }

  .device-controls {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  button {
    padding: 0.75rem;
    border-radius: 8px;
    border: none;
    background: var(--primary-color);
    color: white;
    cursor: pointer;
    font-weight: 600;
  }

  input[type="range"] {
    width: 100%;
  }
</style>
```

### MQTT Store

Svelte store for MQTT connection:

```javascript
// lib/stores/mqtt.js
import { writable } from 'svelte/store';
import mqtt from 'mqtt';

function createMQTTStore() {
  const { subscribe, set, update } = writable({
    connected: false,
    client: null,
  });

  let client;
  const subscriptions = new Map();

  function connect(brokerUrl) {
    client = mqtt.connect(brokerUrl, {
      clientId: `smarthome_${Math.random().toString(16).slice(2, 8)}`,
      clean: true,
      reconnectPeriod: 1000,
    });

    client.on('connect', () => {
      console.log('MQTT connected');
      update(state => ({ ...state, connected: true, client }));
    });

    client.on('message', (topic, message) => {
      const handlers = subscriptions.get(topic) || [];
      handlers.forEach(handler => handler(message.toString()));
    });

    client.on('error', (error) => {
      console.error('MQTT error:', error);
    });

    client.on('close', () => {
      update(state => ({ ...state, connected: false }));
    });
  }

  function subscribeTopic(topic, handler) {
    if (!subscriptions.has(topic)) {
      subscriptions.set(topic, []);
      client.subscribe(topic);
    }
    
    subscriptions.get(topic).push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = subscriptions.get(topic);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
      
      if (handlers.length === 0) {
        client.unsubscribe(topic);
        subscriptions.delete(topic);
      }
    };
  }

  function publish(topic, message) {
    return new Promise((resolve, reject) => {
      client.publish(topic, message, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  return {
    subscribe,
    connect,
    subscribe: subscribeTopic,
    publish,
  };
}

export const mqttStore = createMQTTStore();
```

## Backend Integration

### Home Assistant Configuration

Custom integrations and automations:

```yaml
# configuration.yaml
homeassistant:
  name: Home
  latitude: !secret latitude
  longitude: !secret longitude
  elevation: 0
  unit_system: metric
  time_zone: America/New_York

# MQTT Broker
mqtt:
  broker: localhost
  port: 1883
  discovery: true
  discovery_prefix: homeassistant

# Integrations
light:
  - platform: hue
    host: 192.168.1.100

climate:
  - platform: nest

media_player:
  - platform: sonos

sensor:
  - platform: template
    sensors:
      total_power_consumption:
        friendly_name: "Total Power Consumption"
        unit_of_measurement: "W"
        value_template: >
          {{ states('sensor.living_room_power') | float +
             states('sensor.bedroom_power') | float +
             states('sensor.kitchen_power') | float }}

# Automation
automation:
  - alias: "Good Morning"
    trigger:
      platform: time
      at: "07:00:00"
    condition:
      condition: state
      entity_id: binary_sensor.workday
      state: 'on'
    action:
      - service: light.turn_on
        target:
          entity_id: light.bedroom
        data:
          brightness: 50
      - service: climate.set_temperature
        target:
          entity_id: climate.bedroom
        data:
          temperature: 22
      - service: media_player.play_media
        target:
          entity_id: media_player.bedroom_speaker
        data:
          media_content_id: "morning_playlist"
          media_content_type: "playlist"
```

### Custom Python Scripts

Energy monitoring script:

```python
# scripts/energy_monitor.py
import paho.mqtt.client as mqtt
from influxdb_client import InfluxDBClient, Point
from datetime import datetime
import json

class EnergyMonitor:
    def __init__(self):
        self.mqtt_client = mqtt.Client()
        self.influx_client = InfluxDBClient(
            url="http://localhost:8086",
            token="your-token",
            org="smarthome"
        )
        self.write_api = self.influx_client.write_api()

    def on_connect(self, client, userdata, flags, rc):
        print(f"Connected with result code {rc}")
        client.subscribe("homeassistant/sensor/+/power")

    def on_message(self, client, userdata, msg):
        try:
            data = json.loads(msg.payload.decode())
            device_id = msg.topic.split('/')[2]
            
            point = Point("power_consumption") \
                .tag("device", device_id) \
                .field("watts", float(data['power'])) \
                .time(datetime.utcnow())
            
            self.write_api.write(bucket="smarthome", record=point)
            
            # Calculate cost
            cost_per_kwh = 0.12  # $0.12 per kWh
            daily_cost = (float(data['power']) / 1000) * 24 * cost_per_kwh
            
            # Publish cost
            client.publish(
                f"homeassistant/sensor/{device_id}/cost",
                json.dumps({"daily_cost": round(daily_cost, 2)})
            )
            
        except Exception as e:
            print(f"Error processing message: {e}")

    def start(self):
        self.mqtt_client.on_connect = self.on_connect
        self.mqtt_client.on_message = self.on_message
        self.mqtt_client.connect("localhost", 1883, 60)
        self.mqtt_client.loop_forever()

if __name__ == "__main__":
    monitor = EnergyMonitor()
    monitor.start()
```

### Voice Assistant Integration

Alexa skill for voice control:

```python
# alexa_skill/lambda_function.py
from ask_sdk_core.skill_builder import SkillBuilder
from ask_sdk_core.dispatch_components import AbstractRequestHandler
from ask_sdk_core.utils import is_request_type, is_intent_name
import requests

class TurnOnLightIntentHandler(AbstractRequestHandler):
    def can_handle(self, handler_input):
        return is_intent_name("TurnOnLightIntent")(handler_input)

    def handle(self, handler_input):
        slots = handler_input.request_envelope.request.intent.slots
        room = slots['room'].value
        
        # Call Home Assistant API
        response = requests.post(
            'http://your-home-ip:8123/api/services/light/turn_on',
            headers={'Authorization': 'Bearer YOUR_TOKEN'},
            json={'entity_id': f'light.{room}'}
        )
        
        if response.status_code == 200:
            speech_text = f"Turning on the {room} light"
        else:
            speech_text = f"Sorry, I couldn't turn on the {room} light"
        
        return handler_input.response_builder.speak(speech_text).response

sb = SkillBuilder()
sb.add_request_handler(TurnOnLightIntentHandler())

lambda_handler = sb.lambda_handler()
```

## Automation Engine

### Rule Builder Interface

Visual automation builder:

```svelte
<!-- AutomationBuilder.svelte -->
<script>
  let automation = {
    name: '',
    triggers: [],
    conditions: [],
    actions: []
  };

  function addTrigger(type) {
    automation.triggers = [...automation.triggers, {
      id: Date.now(),
      type,
      config: {}
    }];
  }

  function addAction(type) {
    automation.actions = [...automation.actions, {
      id: Date.now(),
      type,
      config: {}
    }];
  }

  async function saveAutomation() {
    await fetch('/api/automations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(automation)
    });
  }
</script>

<div class="automation-builder">
  <input bind:value={automation.name} placeholder="Automation name" />

  <section class="triggers">
    <h3>When...</h3>
    {#each automation.triggers as trigger}
      <TriggerConfig {trigger} />
    {/each}
    <button on:click={() => addTrigger('time')}>Add Time Trigger</button>
    <button on:click={() => addTrigger('device')}>Add Device Trigger</button>
  </section>

  <section class="actions">
    <h3>Do...</h3>
    {#each automation.actions as action}
      <ActionConfig {action} />
    {/each}
    <button on:click={() => addAction('device')}>Add Device Action</button>
    <button on:click={() => addAction('notification')}>Add Notification</button>
  </section>

  <button on:click={saveAutomation}>Save Automation</button>
</div>
```

## Energy Monitoring Dashboard

### Grafana Integration

Custom Grafana dashboards for energy visualization:

```json
{
  "dashboard": {
    "title": "Energy Monitoring",
    "panels": [
      {
        "title": "Real-time Power Consumption",
        "type": "graph",
        "targets": [
          {
            "query": "SELECT mean(\"watts\") FROM \"power_consumption\" WHERE $timeFilter GROUP BY time(1m), \"device\""
          }
        ]
      },
      {
        "title": "Daily Energy Cost",
        "type": "stat",
        "targets": [
          {
            "query": "SELECT sum(\"watts\") * 0.12 / 1000 FROM \"power_consumption\" WHERE time >= now() - 1d"
          }
        ]
      },
      {
        "title": "Device Breakdown",
        "type": "piechart",
        "targets": [
          {
            "query": "SELECT sum(\"watts\") FROM \"power_consumption\" WHERE $timeFilter GROUP BY \"device\""
          }
        ]
      }
    ]
  }
}
```

## Deployment

### Raspberry Pi Setup

Automated deployment script:

```bash
#!/bin/bash
# deploy.sh

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install dependencies
sudo apt-get install -y \
  mosquitto \
  mosquitto-clients \
  python3-pip \
  nodejs \
  npm

# Install Home Assistant
pip3 install homeassistant

# Install InfluxDB
wget https://dl.influxdata.com/influxdb/releases/influxdb_2.0.0_arm64.deb
sudo dpkg -i influxdb_2.0.0_arm64.deb

# Install Grafana
wget https://dl.grafana.com/oss/release/grafana_8.0.0_arm64.deb
sudo dpkg -i grafana_8.0.0_arm64.deb

# Build and deploy web app
cd /home/pi/smarthome-hub
npm install
npm run build
sudo cp -r build/* /var/www/html/

# Start services
sudo systemctl enable mosquitto
sudo systemctl start mosquitto
sudo systemctl enable influxdb
sudo systemctl start influxdb
sudo systemctl enable grafana-server
sudo systemctl start grafana-server

# Start Home Assistant
hass --open-ui
```

### Docker Compose Alternative

```yaml
version: '3.8'

services:
  mosquitto:
    image: eclipse-mosquitto
    ports:
      - "1883:1883"
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data

  homeassistant:
    image: homeassistant/home-assistant
    ports:
      - "8123:8123"
    volumes:
      - ./homeassistant:/config
    depends_on:
      - mosquitto

  influxdb:
    image: influxdb:2.0
    ports:
      - "8086:8086"
    volumes:
      - ./influxdb:/var/lib/influxdb2

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
    volumes:
      - ./grafana:/var/lib/grafana
    depends_on:
      - influxdb

  web:
    build: .
    ports:
      - "80:3000"
    depends_on:
      - homeassistant
      - mosquitto
```

## Results & Impact

### System Performance

- **Response Time**: < 100ms for device control
- **Uptime**: 99.9% (only during updates)
- **Device Support**: 50+ devices integrated
- **Automation Rules**: 25+ active automations

### Energy Savings

- **Monthly Savings**: $45 average
- **Peak Reduction**: 30% reduction in peak usage
- **Insights**: Identified 3 energy-wasting devices

### User Satisfaction

- Client extremely satisfied
- Recommended to 5 friends (3 became clients)
- Featured in local smart home enthusiast group
- Ongoing maintenance contract

## Challenges & Solutions

### Challenge 1: Device Compatibility

**Problem**: Different devices use different protocols (Zigbee, Z-Wave, WiFi)

**Solution**: Used Home Assistant as abstraction layer with protocol-specific USB dongles

### Challenge 2: Network Reliability

**Problem**: WiFi devices occasionally disconnect

**Solution**: Implemented mesh WiFi network and device health monitoring with auto-reconnect

### Challenge 3: Performance on Raspberry Pi

**Problem**: Initial dashboard was slow on Pi 3

**Solution**: Switched to Svelte for smaller bundle size and optimized MQTT message handling

## Lessons Learned

1. **Local-First is Reliable**: No cloud dependency means no outages
2. **Standards Matter**: Stick to standard protocols (MQTT, HTTP)
3. **User Experience**: Non-technical users need simple interfaces
4. **Documentation**: Comprehensive docs essential for maintenance
5. **Monitoring**: Proactive monitoring prevents issues

## Future Enhancements

- [ ] Machine learning for predictive automation
- [ ] Mobile app (currently PWA)
- [ ] Multi-home support
- [ ] Advanced security features (cameras, door locks)
- [ ] Integration with solar panels

## Conclusion

SmartHome Hub successfully unified a complex smart home ecosystem into a single, reliable, privacy-focused control system. The project demonstrated that local-first smart home solutions can be both powerful and user-friendly.
