# 🗳️ Democracy Lab AI

An intelligent learning platform designed to help users understand the **Indian election process** through structured, reliable, and interactive guidance.

---
## 🧠 Interactive Learning Experience

Unlike traditional platforms that only provide static information, this website allows users to understand the election process step by step. It simulates real-world stages, making learning more engaging and effective.

# 🗳️ Election Process Assistant

A modern web platform designed to help citizens of India understand the election process in a simple, accessible, and actionable way.

---

# 🚀 Project Overview

This project focuses on:

* Educating users about the election process
* Providing quick access to official help
* Improving accessibility using simple tools and integrations

---

# 🎯 Key Features

## 📞 Call Election Helpline

* One-click calling feature using official helpline number **1950**
* Opens phone dialer instantly

## 🔐 Google Authentication

* Secure login using Google OAuth
* Displays user name after login
* Enhances trust and personalization

## 📍 Polling Booth Finder

* Integrated with Google Maps
* Redirects users to find nearby polling booths

## 🤖 Election Assistant (Chatbot)

* JSON-based smart assistant
* Answers:

  * Voter registration
  * Required documents
  * Voting process
  * EVM-related queries
* Fast and deterministic (no external AI dependency)

## 🌐 Multi-language Support

* Supports:

  * English
  * Hindi
  * Marathi

## 📊 Election Process Guide

Step-by-step explanation:

1. Register as voter
2. Verify voter ID
3. Find polling booth
4. Vote using EVM
5. View results

---

# 🛠️ Tech Stack

* **Frontend:** Next.js (App Router)
* **Styling:** CSS / Global styles
* **Authentication:** Google OAuth
* **Deployment:** Google Cloud Run
* **Data Handling:** JSON-based structured responses

---

# 📁 Project Structure

```bash
src/
 ├── app/
 │   ├── page.tsx
 │   ├── layout.tsx
 │   └── api/
 ├── components/
 │   ├── auth/
 │   ├── chat/
 │   └── features/
 ├── data/
 │   └── assistant-data.json
 ├── lib/
 │   └── (utilities)
public/
.next/
```

---

# ⚙️ Setup & Run Locally

```bash
npm install
npm run dev
```

Build project:

```bash
npm run build
npm start
```

---

# 🐳 Docker Deployment

## Build Image

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/election-app
```

## Deploy to Cloud Run

```bash
gcloud run deploy election-app \
  --image gcr.io/YOUR_PROJECT_ID/election-app \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated
```

---

# ☁️ Cloud Run Notes

* Runs using containerized Next.js standalone build
* Environment variables must be configured manually
* Always redeploy after code changes


Set them in Cloud Run during deployment.

---

## 🎯 Future Improvements

* Real-time voter data integration
* Accessibility improvements (voice support)
* Advanced search and filtering
* Official API integrations

---
## 📖 Simplified and Beginner-Friendly Content

Election concepts can be complex, but this project presents them in a simple and easy-to-understand format. It is especially useful for:

First-time voters
Students
General users who want basic awareness

## 🚀 Features

### 🤖 Smart Knowledge Assistant
- Responds instantly using a **curated knowledge base**
- No hallucinations → ensures **accurate and trustworthy information**
- Designed for clarity and simplicity

### 🎯 Structured Learning System
- Voter Registration
- Voting Day Process
- Election Results
- Step-by-step guided explanations

### 💡 Context-Aware Suggestions
- Dynamic follow-up questions
- Helps users explore topics deeper
- Guided learning experience

### ⚡ Fast & Reliable
- Works without external AI APIs
- No latency issues
- Consistent responses every time

### 🎨 Modern UI/UX
- Clean glassmorphism interface
- Smooth animations (Framer Motion)
- Fully responsive design

---

## 🧠 Core Idea

Instead of relying on unpredictable AI APIs, this project uses a **manually curated dataset** of election-related knowledge.

This approach ensures:
- ✅ High accuracy
- ✅ No misinformation
- ✅ Consistent user experience
- ✅ Faster performance

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React, TypeScript  
- **Styling:** Tailwind CSS  
- **State Management:** Custom Hooks + Store  
- **Animations:** Framer Motion  
- **Backend:** Next.js API Routes  
- **Data Source:** Structured JSON Knowledge Base  

---

## 📂 Project Structure
