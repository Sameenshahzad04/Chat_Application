# 💬 Real-Time Chat Application with WebRTC Audio/Video Calling

A production-ready, full-featured real-time chat application built with **FastAPI** and **WebRTC**, featuring instant messaging, audio calls, and video calls - all in a single-page interface similar to WhatsApp Web.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [API Endpoints](#-api-endpoints)
- [WebSocket Communication](#-websocket-communication)
- [WebRTC Call Flow](#-webrtc-call-flow)
- [Features Documentation](#-features-documentation)
- [Troubleshooting](#-troubleshooting)
- [Security Considerations](#-security-considerations)
- [Deployment](#-deployment)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)
- [Contact](#-contact)

---

## ✨ Features

### Messaging Features

- **Real-Time Messaging** - Instant message delivery via WebSocket connections
- **Private Chat** - One-on-one conversations between users
- **Message History** - Persistent storage of all chat conversations
- **Delivery Confirmation** - Visual feedback when messages are sent and received
- **User Search** - Find and connect with other users quickly
- **Online Status** - See which users are currently active
- **Join/Leave Notifications** - Get notified when users come online or go offline

### Call Features

- **Audio Calling** - High-quality one-to-one voice calls
- **Video Calling** - Face-to-face video conversations
- **In-Page Call UI** - Calls appear as overlays without page redirects
- **Incoming Call Modal** - Beautiful notification with accept/reject options
- **Call Controls** - Mute/unmute, camera on/off, end call
- **Call Timer** - Real-time call duration display
- **Call History** - Log of all calls with status and duration
- **Media Cleanup** - Automatic camera/microphone release after calls

### Authentication & Security

- **JWT Authentication** - Secure token-based user sessions
- **Password Hashing** - Bcrypt encryption for user passwords
- **Token Expiration** - Automatic session timeout handling
- **Protected Routes** - All endpoints require valid authentication
- **WebSocket Security** - Token validation on WebSocket connections

### User Interface

- **WhatsApp-Inspired Design** - Familiar, intuitive interface
- **Responsive Layout** - Works on desktop and tablet screens
- **Smooth Animations** - Polished user experience with CSS transitions
- **Connection Status** - Visual indicator for WebSocket connection state
- **Ringing Animation** - Animated rings for incoming calls
- **Picture-in-Picture Video** - Local video preview during video calls

---

## 🛠️ Tech Stack

### Backend

- **FastAPI** - Modern, high-performance Python web framework
- **Python 3.14** - Latest Python version with improved performance
- **SQLAlchemy** - SQL toolkit and ORM for database operations
- **Alembic** - Database migration tool
- **WebSockets** - Real-time bidirectional communication
- **Pydantic** - Data validation and settings management
- **Passlib** - Password hashing and verification
- **Python-JOSE** - JWT token creation and verification

### Frontend

- **Vanilla JavaScript** - No framework dependencies, lightweight
- **HTML5** - Semantic markup and WebRTC APIs
- **CSS3** - Modern styling with animations and flexbox
- **WebRTC API** - Browser-based real-time communication
- **MediaDevices API** - Camera and microphone access

### Database

- **PostgreSQL** - Production-ready relational database (recommended)
- **SQLite** - Lightweight database for development/testing
- **Alembic Migrations** - Version-controlled schema changes

### Real-Time Communication

- **WebSocket** - Persistent connection for messaging and signaling
- **WebRTC** - Peer-to-peer audio/video streaming
- **STUN Servers** - Google's public STUN servers for NAT traversal

---

## 📁 Project Structure
