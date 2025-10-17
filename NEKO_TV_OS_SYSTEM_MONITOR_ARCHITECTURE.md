# 🐾📊 NEKO TV OS SYSTEM MONITOR - GENERIC ARCHITECTURE 📊🐾

**Created**: October 17, 2025
**Purpose**: Real-time OS performance monitoring during threat hunts
**Scope**: GENERIC design for dashboards AND microcontroller implementations

---

## 🎯 **VISION**

Display real-time OS system status (CPU, GPU, RAM, disk, network) in Neko TV while hunting threat actors. Architecture must be **GENERIC** enough to work on:
1. ✅ Web dashboards (React + Node.js)
2. ✅ Microcontroller displays (ESP32 + OLED screen)
3. ✅ Any future platform

---

## 🏗️ **GENERIC 3-TIER ARCHITECTURE**

```
┌─────────────────────────────────────────────────────────────┐
│                    TIER 1: DATA COLLECTION                  │
│                  (System Metrics Gathering)                 │
├─────────────────────────────────────────────────────────────┤
│  • CPU Usage (per core + average)                          │
│  • GPU Usage (NVIDIA/AMD via CLI)                          │
│  • RAM Usage (used/total/free)                             │
│  • Disk I/O (read/write speed)                             │
│  • Network I/O (upload/download)                           │
│  • Temperature (CPU/GPU if available)                      │
│  • System Uptime                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                TIER 2: DATA PROCESSING & API                │
│              (Normalize, Format, Broadcast)                 │
├─────────────────────────────────────────────────────────────┤
│  • Normalize data to standard JSON format                  │
│  • Calculate percentages and deltas                        │
│  • Aggregate historical data (last 60 seconds)             │
│  • Expose via REST API + WebSocket                         │
│  • OR Serial communication for microcontrollers            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              TIER 3: VISUALIZATION & DISPLAY                │
│             (Platform-Specific Rendering)                   │
├─────────────────────────────────────────────────────────────┤
│  OPTION A: Web Dashboard (React Component)                 │
│    • Real-time charts (CPU/GPU/RAM graphs)                 │
│    • Animated progress bars                                │
│    • Color-coded status (green/yellow/red)                 │
│    • WebSocket connection for live updates                 │
│                                                             │
│  OPTION B: Microcontroller Display (ESP32 + OLED)          │
│    • Text-based metrics display                            │
│    • Simple bar graphs using ASCII/pixels                  │
│    • Serial/WiFi data reception                            │
│    • Low-power efficient rendering                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 **TIER 1: DATA COLLECTION**

### **For Web/Node.js Implementation**

**Library**: `systeminformation` (npm)
**Why**: Cross-platform, dependency-free, 50+ functions, actively maintained

```javascript
const si = require('systeminformation');

async function collectSystemMetrics() {
  const [cpu, mem, disk, network, gpu, temp] = await Promise.all([
    si.currentLoad(),      // CPU usage per core
    si.mem(),              // RAM usage
    si.fsStats(),          // Disk I/O
    si.networkStats(),     // Network I/O
    si.graphics(),         // GPU info (basic)
    si.cpuTemperature()    // CPU temperature
  ]);

  return {
    timestamp: Date.now(),
    cpu: {
      usage: cpu.currentLoad.toFixed(2),
      cores: cpu.cpus.map(c => c.load.toFixed(2)),
      temp: temp.main || null
    },
    gpu: {
      model: gpu.controllers[0]?.model || 'Unknown',
      usage: null  // Requires nvidia-smi or radeontop
    },
    ram: {
      used: mem.used,
      total: mem.total,
      usagePercent: ((mem.used / mem.total) * 100).toFixed(2)
    },
    disk: {
      readSpeed: disk.rX_sec || 0,
      writeSpeed: disk.wX_sec || 0
    },
    network: {
      download: network[0]?.rx_sec || 0,
      upload: network[0]?.tx_sec || 0
    },
    uptime: si.time().uptime
  };
}

// GPU Enhancement (NVIDIA)
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function getNvidiaGPUUsage() {
  try {
    const { stdout } = await execPromise(
      'nvidia-smi --query-gpu=utilization.gpu,temperature.gpu,memory.used,memory.total --format=csv,noheader,nounits'
    );
    const [usage, temp, memUsed, memTotal] = stdout.trim().split(',').map(Number);
    return { usage, temp, memUsed, memTotal };
  } catch (error) {
    return null; // NVIDIA GPU not available
  }
}
```

---

### **For Microcontroller Implementation**

**Hardware**: ESP32 (WiFi-enabled MCU)
**Display**: 0.96" OLED SSD1306 (128x64 pixels, I2C)
**Libraries**: Adafruit SSD1306, Adafruit GFX

**Data Reception Options**:
1. **WiFi + HTTP**: Request metrics from Node.js API
2. **WiFi + WebSocket**: Real-time push from server
3. **Serial**: USB connection to host computer

```cpp
// ESP32 Arduino Code Structure
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
#define SCREEN_ADDRESS 0x3C

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
const char* apiUrl = "http://SERVER_IP:5001/api/system-stats";

void setup() {
  Serial.begin(115200);

  // Initialize OLED
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;);
  }

  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  // Connect WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(apiUrl);
    int httpCode = http.GET();

    if (httpCode == 200) {
      String payload = http.getString();

      // Parse JSON
      StaticJsonDocument<1024> doc;
      deserializeJson(doc, payload);

      float cpuUsage = doc["cpu"]["usage"];
      float ramUsage = doc["ram"]["usagePercent"];
      float gpuUsage = doc["gpu"]["usage"];

      // Display on OLED
      displayMetrics(cpuUsage, ramUsage, gpuUsage);
    }

    http.end();
  }

  delay(1000); // Update every second
}

void displayMetrics(float cpu, float ram, float gpu) {
  display.clearDisplay();

  // CPU
  display.setCursor(0, 0);
  display.print("CPU: ");
  display.print(cpu, 1);
  display.println("%");
  drawBar(0, 10, cpu);

  // RAM
  display.setCursor(0, 24);
  display.print("RAM: ");
  display.print(ram, 1);
  display.println("%");
  drawBar(0, 34, ram);

  // GPU
  display.setCursor(0, 48);
  display.print("GPU: ");
  if (gpu > 0) {
    display.print(gpu, 1);
    display.println("%");
  } else {
    display.println("N/A");
  }

  display.display();
}

void drawBar(int x, int y, float percent) {
  int barWidth = (int)((percent / 100.0) * 100);
  display.drawRect(x, y, 102, 8, SSD1306_WHITE);
  display.fillRect(x+1, y+1, barWidth, 6, SSD1306_WHITE);
}
```

---

## 🔄 **TIER 2: DATA PROCESSING & API**

### **Node.js Backend Service**

```javascript
// system-monitor-service.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const si = require('systeminformation');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: '*' }
});

// Store last 60 seconds of data
const metricsHistory = [];
const MAX_HISTORY = 60;

// Collect metrics every second
async function collectMetrics() {
  const metrics = await collectSystemMetrics(); // From Tier 1

  // Add GPU data if available
  const gpuData = await getNvidiaGPUUsage();
  if (gpuData) {
    metrics.gpu.usage = gpuData.usage;
    metrics.gpu.temp = gpuData.temp;
    metrics.gpu.memUsed = gpuData.memUsed;
    metrics.gpu.memTotal = gpuData.memTotal;
  }

  // Add to history
  metricsHistory.push(metrics);
  if (metricsHistory.length > MAX_HISTORY) {
    metricsHistory.shift();
  }

  // Broadcast to all connected clients
  io.emit('system-metrics', metrics);

  return metrics;
}

// REST API endpoint
app.get('/api/system-stats', async (req, res) => {
  const metrics = await collectMetrics();
  res.json({ success: true, data: metrics });
});

// REST API for history
app.get('/api/system-stats/history', (req, res) => {
  res.json({ success: true, data: metricsHistory });
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current metrics immediately
  if (metricsHistory.length > 0) {
    socket.emit('system-metrics', metricsHistory[metricsHistory.length - 1]);
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start collecting metrics every second
setInterval(collectMetrics, 1000);

const PORT = 5001;
server.listen(PORT, () => {
  console.log(`🖥️  System Monitor Service running on port ${PORT}`);
});
```

---

## 🎨 **TIER 3: VISUALIZATION**

### **Option A: React Component for Neko TV Dashboard**

```javascript
// SystemMonitor.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './SystemMonitor.css';

const SystemMonitor = () => {
  const [metrics, setMetrics] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
    const socket = io(API_URL);

    socket.on('system-metrics', (data) => {
      setMetrics(data);
      setHistory(prev => [...prev.slice(-59), data]); // Keep last 60
    });

    return () => socket.disconnect();
  }, []);

  if (!metrics) return <div className="loading">Loading system metrics...</div>;

  return (
    <div className="system-monitor">
      <h2>🖥️ NEKO TV SYSTEM STATUS 🖥️</h2>

      {/* CPU */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-icon">⚙️</span>
          <span className="metric-label">CPU</span>
          <span className={`metric-value ${getStatusClass(metrics.cpu.usage)}`}>
            {metrics.cpu.usage}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${getStatusClass(metrics.cpu.usage)}`}
            style={{ width: `${metrics.cpu.usage}%` }}
          />
        </div>
        {metrics.cpu.temp && (
          <div className="metric-subtext">🌡️ {metrics.cpu.temp}°C</div>
        )}
      </div>

      {/* GPU */}
      {metrics.gpu.usage !== null && (
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">🎮</span>
            <span className="metric-label">GPU</span>
            <span className={`metric-value ${getStatusClass(metrics.gpu.usage)}`}>
              {metrics.gpu.usage}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${getStatusClass(metrics.gpu.usage)}`}
              style={{ width: `${metrics.gpu.usage}%` }}
            />
          </div>
          <div className="metric-subtext">
            {metrics.gpu.model} | 🌡️ {metrics.gpu.temp}°C
          </div>
        </div>
      )}

      {/* RAM */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-icon">💾</span>
          <span className="metric-label">RAM</span>
          <span className={`metric-value ${getStatusClass(metrics.ram.usagePercent)}`}>
            {metrics.ram.usagePercent}%
          </span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${getStatusClass(metrics.ram.usagePercent)}`}
            style={{ width: `${metrics.ram.usagePercent}%` }}
          />
        </div>
        <div className="metric-subtext">
          {formatBytes(metrics.ram.used)} / {formatBytes(metrics.ram.total)}
        </div>
      </div>

      {/* Network */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-icon">🌐</span>
          <span className="metric-label">Network</span>
        </div>
        <div className="network-stats">
          <div className="network-stat">
            ⬇️ {formatBytes(metrics.network.download)}/s
          </div>
          <div className="network-stat">
            ⬆️ {formatBytes(metrics.network.upload)}/s
          </div>
        </div>
      </div>

      {/* Disk I/O */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-icon">💿</span>
          <span className="metric-label">Disk I/O</span>
        </div>
        <div className="network-stats">
          <div className="network-stat">
            📖 {formatBytes(metrics.disk.readSpeed)}/s
          </div>
          <div className="network-stat">
            ✍️ {formatBytes(metrics.disk.writeSpeed)}/s
          </div>
        </div>
      </div>

      {/* Uptime */}
      <div className="uptime">
        ⏱️ Uptime: {formatUptime(metrics.uptime)}
      </div>
    </div>
  );
};

function getStatusClass(percent) {
  if (percent >= 90) return 'critical';
  if (percent >= 70) return 'warning';
  return 'normal';
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${mins}m`;
}

export default SystemMonitor;
```

---

## 📝 **GENERIC JSON DATA FORMAT**

**Standard format for ALL platforms**:

```json
{
  "timestamp": 1729142400000,
  "cpu": {
    "usage": 45.67,
    "cores": [42.1, 38.5, 51.2, 44.8],
    "temp": 58
  },
  "gpu": {
    "model": "NVIDIA GeForce RTX 3060",
    "usage": 32.5,
    "temp": 62,
    "memUsed": 4096,
    "memTotal": 12288
  },
  "ram": {
    "used": 8589934592,
    "total": 17179869184,
    "usagePercent": 50.00
  },
  "disk": {
    "readSpeed": 1048576,
    "writeSpeed": 524288
  },
  "network": {
    "download": 204800,
    "upload": 102400
  },
  "uptime": 864000
}
```

This format works for:
- ✅ Web dashboards (parse and display)
- ✅ Microcontrollers (parse with ArduinoJson)
- ✅ Mobile apps (standard JSON parsing)
- ✅ CLI tools (jq compatible)

---

## 🚀 **IMPLEMENTATION ROADMAP**

### **Phase 1: Web Dashboard (PRIORITY)**
1. Install systeminformation in neko-defense-api
2. Create system-monitor-service.js
3. Add REST API endpoints
4. Create SystemMonitor React component
5. Add to Neko TV Dashboard
6. Test with live threat hunting session

### **Phase 2: GPU Enhancement**
1. Detect NVIDIA/AMD GPU
2. Implement nvidia-smi/radeontop integration
3. Add GPU metrics to data stream
4. Update frontend visualization

### **Phase 3: Microcontroller Prototype**
1. Set up ESP32 + OLED hardware
2. Write Arduino firmware
3. Connect to WiFi and API
4. Display metrics on OLED screen
5. Test standalone operation

### **Phase 4: Advanced Features**
1. Historical data charts
2. Alert thresholds (>90% usage notifications)
3. Per-process monitoring
4. Export metrics to MongoDB
5. Mobile app (React Native)

---

## 💡 **WHY THIS IS GENERIC**

| Feature | Web Dashboard | Microcontroller | Future Platforms |
|---------|--------------|-----------------|------------------|
| **Data Format** | JSON (REST/WS) | JSON (WiFi) | JSON (Any) |
| **Collection** | Node.js/systeminformation | Same API | Same API |
| **Transport** | WebSocket | HTTP/WiFi | Flexible |
| **Display** | React/Charts | OLED/Text | Adaptable |
| **Scalability** | Unlimited clients | Single device | Any scale |

---

## 🎯 **SUCCESS CRITERIA**

- ✅ Real-time metrics (<1s delay)
- ✅ Cross-platform data collection
- ✅ Standard JSON format
- ✅ Web dashboard integration
- ✅ Microcontroller compatibility
- ✅ Low overhead (<5% CPU)
- ✅ Easy to extend

---

**🐾 Made with MAXIMUM ARCHITECTURAL POWER by Neko-Arc, nyaa~! ✨**
