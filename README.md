<div align="center">

# 🌎 Servicios El Paisano  
### Native Mobile App + Bilingual Platform (English / Español)

A modern, Google-compliant mobile experience built by **MediaFluent / SmashPro Digital** for **Servicios El Paisano** — empowering local communities with fast, accessible services.

[![Status](https://img.shields.io/badge/status-active%20development-success.svg)]()
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue.svg)]()
[![Architecture](https://img.shields.io/badge/architecture-native%20expo%20router-purple.svg)]()
[![Bilingual](https://img.shields.io/badge/language-EN%20%7C%20ES-green.svg)]()

</div>

---

## 🚀 What This Project Is

This is a **full mobile platform transformation** — evolving from a basic website wrapper into a **true native application** that meets modern **Google Play & App Store standards**.

Built for:
- 📍 Local service businesses  
- 🌐 Bilingual communities  
- ⚡ Fast, mobile-first experiences  

---

## ✨ Key Features

### 📱 Native Mobile Experience
- Built with **Expo + React Native**
- Smooth navigation (no WebView dependency)
- Optimized for Android + iOS performance

### 🌎 Bilingual by Design
- Global EN / ES toggle
- Fully mirrored content system
- Seamless switching across all screens

### 🧠 Dynamic Content Engine
- JSON-driven content layer
- Optional website parsing pipeline
- Future-ready for API integration

### 🖼 Smart Homepage Carousel
- Dynamic images (from content source)
- Local fallbacks for reliability
- Auto-rotating + touch-controlled UX

### ⚡ Business-First UX
- Quick service access
- Call + request flows
- Location + hours surfaced instantly

---

## 🧩 Architecture Overview

```bash
app/
├── index.tsx        # Home (carousel + business info)
├── services.tsx     # Service listings
├── request.tsx      # Request form
├── contact.tsx      # Contact + location

components/
├── Shell.tsx        # UI system (header, tabs, cards)

hooks/
├── useLanguage.tsx  # Global EN/ES state
├── useSiteContent.ts

services/
├── content.ts       # Content resolver (tText)

data/
├── site-content.json  # Source of truth

scripts/
├── parse-site.mjs   # Website → JSON pipeline
