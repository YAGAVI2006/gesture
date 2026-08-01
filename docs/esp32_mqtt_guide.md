# Physical ESP32 Microcontroller & MQTT Integration Guide

This project is built with a clean abstraction layer (`BaseIoTDevice`), allowing seamless migration from **Virtual IoT Mode** to **Physical Microcontroller Mode** using an ESP32 and MQTT broker.

---

## 1. Architecture Overview

```
[ AI Gesture Engine ] ---> [ Python Backend ] ---> [ MQTT Broker (HiveMQ / Mosquitto) ]
                                                           |
                                                           v
                                                  [ Physical ESP32 ] ---> [ Relay / LED / Fan ]
```

---

## 2. Setting Up MQTT Broker

1. In the Web Dashboard **Settings**, set **IoT Operation Mode** to `MQTT ESP32 Hardware Mode`.
2. Configure your broker address (Default: `broker.hivemq.com` or local `localhost:1883`).

---

## 3. ESP32 Arduino C++ Code Snippet

Upload the following code to your ESP32 board using Arduino IDE or PlatformIO:

```cpp
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "broker.hivemq.com";

const int RELAY_LIGHT_PIN = 12;
const int RELAY_FAN_PIN   = 14;

WiFiClient espClient;
PubSubClient client(espClient);

void callback(char* topic, byte* message, unsigned int length) {
  String messageTemp;
  for (int i = 0; i < length; i++) {
    messageTemp += (char)message[i];
  }

  if (String(topic) == "home/smart_light/command") {
    if (messageTemp == "LIGHT_ON")  digitalWrite(RELAY_LIGHT_PIN, HIGH);
    if (messageTemp == "LIGHT_OFF") digitalWrite(RELAY_LIGHT_PIN, LOW);
  }
  else if (String(topic) == "home/smart_fan/command") {
    if (messageTemp == "FAN_ON")  digitalWrite(RELAY_FAN_PIN, HIGH);
    if (messageTemp == "FAN_OFF") digitalWrite(RELAY_FAN_PIN, LOW);
  }
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("ESP32_Gesture_Client")) {
      client.subscribe("home/smart_light/command");
      client.subscribe("home/smart_fan/command");
    } else {
      delay(5000);
    }
  }
}

void setup() {
  pinMode(RELAY_LIGHT_PIN, OUTPUT);
  pinMode(RELAY_FAN_PIN, OUTPUT);
  WiFi.begin(ssid, password);
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();
}
```
