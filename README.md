# Armour of God — Christian Freedom & Purity Mobile App
> **"Stand Firm. Walk in Purity. Live in Freedom."**  
> *A Biblical Progressive Web App (PWA) to Overcome Pornography, Masturbation, and Sexual Temptation through the Full Armour of God (Ephesians 6:10–18).*

---

## 🛡️ Overview

**Armour of God** is a production-ready, mobile-first Progressive Web App designed for believers who desire lasting freedom from sexual sin, compulsive lust, pornography, and masturbation. Grounded in conservative biblical theology and psychological understanding, it uses the uploaded study **"Fighting the Battle of Sexual Sin with the Armour of God"** as its foundational text.

The app avoids legalistic shame and social comparison. Instead, it equips the believer with the supernatural equipment of Ephesians 6, practical habit changes, local pattern tracking, emergency temptation defense tools, and honest accountability.

---

## ✨ Core Features

1. **The Full Armour of God (Ephesians 6:10–18)**
   - **Belt of Truth**: Exposes 5 core lies behind lust with specific counter-scriptures; includes an interactive Lie vs. Truth Workbench.
   - **Breastplate of Righteousness**: Covers both the front plate (Christ's imputed righteousness against accusation) and back plate (practical righteousness, fleeing, making no provision).
   - **Shoes of the Gospel of Peace**: Ground of objective peace with God, outward mission over inward lust, stepping over emotional caltrops (loneliness, boredom, stress).
   - **Shield of Faith**: Water-soaked scutum to extinguish flaming arrows of sudden fantasies, past memories, and rationalizations; includes the discipline of locking shields with brothers.
   - **Helmet of Salvation**: Safeguards the mind, reorients perspective to future glory, and guides the physical renewal of neural pathways (Romans 12:2).
   - **Sword of the Spirit**: Interactive library of Rhema verses categorized by battle scenario (urges, secrecy, body as temple, setbacks, renewal), with voice read-aloud and memorization status.
   - **Prayer and Perseverance**: Complete original devotional prayers and the Comprehensive Daily Battle Prayer.

2. **The 6-Step Temptation Emergency Tool ("I Am Being Tempted")**
   - **Step 1: The Sovereign Pause** — Interrupts compulsive impulses with the truth that you are free in Christ.
   - **Step 2: Change Environment** — Physical checklist (close browser, leave bedroom, move to shared space, splash cold water).
   - **Step 3: Cry of Deliverance** — Rapid aloud battle prayer.
   - **Step 4: Wield Scripture** — Dynamic rotating Rhema sword thrust.
   - **Step 5: Replacement Action** — Constructive displacement habits (exercise, worship, calling a friend).
   - **Step 6: Cool-Down Timer & Check-In** — 5-minute interactive timer with urge intensity reassessment. Works 100% offline!

3. **Gospel-Centered Setback & Restoration ("I Have Had a Setback")**
   - Responds with compassion and biblical seriousness based on Proverbs 24:16 ("The righteous falls seven times and rises again") and Romans 8:1.
   - Confession and cleansing prayer (1 John 1:9).
   - Identifies the specific trigger (fatigue, late-night phone in bed, isolation) and guides one practical change for next time.
   - No shaming, no loss of study curriculum progress.

4. **10-Lesson Structured Bible Study Curriculum**
   - Lesson 1: God's Grand Design for Sexuality (Genesis 2:24-25, Hebrews 13:4)
   - Lesson 2: Lust & Adultery of the Heart (Matthew 5:27-28)
   - Lesson 3: Pornography & Industrialized Impurity (1 Corinthians 6:18, Psalm 101:3)
   - Lesson 4: Masturbation & Biblical Principles of Holiness (1 Thessalonians 4:3-5, 1 Corinthians 9:27)
   - Lesson 5: Anatomy of Sin & Temptation (James 1:13-15)
   - Lesson 6: How Bondage Develops: Neuroplasticity & Shame (Romans 6:16, Genesis 3:8)
   - Lesson 7: Comprehensive Effects of Sexual Sin (Spiritual, Psychological, Relational, Physical)
   - Lesson 8: Breaking Secrecy & Godly Accountability (Proverbs 28:13, James 5:16)
   - Lesson 9: Grace, Justification & Biblical Repentance (2 Corinthians 5:21)
   - Lesson 10: Renewing the Mind & Walking in Kingdom Purpose (Romans 12:2, Philippians 4:8)

5. **Recovery Plans & Milestone Shelves**
   - **30-Day Spiritual Growth Plan** across 4 progressive phases (Awareness & Honesty, Removing Triggers, Spiritual Disciplines, Long-Term Accountability).
   - **7-Day Starter Plan** for immediate traction.
   - Milestone badges for 1 Day, 3 Days, 7 Days, 14 Days, 30 Days, 60 Days, 90 Days, and 1 Year.

6. **Trigger & Habit Tracker**
   - Private log of urge intensity (1–10), emotional state, situational trigger, action taken, and resistance outcome.
   - Analyzes high-risk hours and emotional triggers without social comparison or public leaderboards.

7. **Private Journal & Accountability Guide**
   - Categorized notes: Reflections, Prayers, Victories, Setbacks, and Gratitude.
   - Single-click export to local `.txt` file.
   - 5 structured accountability check-in questions for partner or mentor meetings.

8. **Device Boundaries & Filtering Guide**
   - Educational steps for CleanBrowsing DNS, Cloudflare Families, iOS Screen Time passcodes, Android Digital Wellbeing, and SafeSearch.
   - Full transparency regarding PWA browser sandbox capabilities.

9. **Bible Quizzes & Scripture Flashcards**
   - 15 doctrinal multiple-choice questions with full scriptural explanations.
   - 3D interactive flip-card memorization trainer with text-to-speech audio support.

10. **Progressive Web App (PWA) Offline Architecture**
    - Installable on iOS Safari, Android Chrome, and Desktop browsers.
    - Web App Manifest (`manifest.webmanifest`), multi-resolution icons (`pwa-192x192.png`, `pwa-512x512.png`, `apple-touch-icon.png`, `pwa-maskable-512x512.png`).
    - Service Worker (`sw.js`) with cache-first static asset delivery for offline functionality.

---

## 🔒 Privacy & Security First

- **100% Client-Side:** No user data, journal entries, sobriety dates, or habit logs are sent to an external server. Everything is stored in local browser storage (`localStorage`).
- **No Third-Party Analytics or Trackers:** Zero advertising, telemetry, or behavioral profiling.
- **Data Sovereignty:** Full backup export (`.json`) and import feature, plus a permanent "Erase All Local Data" button in Settings.

---

## 🛠️ Technology Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 6 / 8
- **Styling:** Tailwind CSS v4 with custom Cinzel and Inter typography
- **Routing:** React Router v7 (`HashRouter` for zero-configuration GitHub Pages hosting)
- **Icons:** Lucide React
- **Celebration Effects:** Canvas Confetti

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have Node.js 18+ and npm installed:
```bash
node -v
npm -v
```

### 2. Clone and Install
```bash
git clone https://github.com/<your-username>/armour-of-god.git
cd armour-of-god
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
The optimized production bundle will be created in the `dist/` directory.

---

## 🌐 GitHub Pages Deployment Instructions

This repository is pre-configured with a GitHub Actions workflow in `.github/workflows/deploy.yml` that builds and deploys the app to GitHub Pages automatically upon every push.

### Step 1: Initialize Git and Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Armour of God Christian PWA"
git branch -M main
git remote add origin https://github.com/<your-username>/armour-of-god.git
git push -u origin main
```

### Step 2: Enable GitHub Pages in Repository Settings
1. Go to your repository on GitHub: `https://github.com/<your-username>/armour-of-god`.
2. Click on **Settings** > **Pages** (in the left sidebar under "Code and automation").
3. Under **Build and deployment**:
   - Change **Source** from *"Deploy from a branch"* to **"GitHub Actions"**.
4. The GitHub Actions workflow will trigger automatically and build the project.

### Step 3: Expected Published URL
Your app will be live at:
```text
https://<your-username>.github.io/armour-of-god/
```
Because `HashRouter` and relative asset base paths (`./`) are implemented, all page refreshes, direct links, and subpath assets will load properly without 404 errors.

---

## 📱 Packaging for Native Android / iOS (Optional)

If you wish to package this PWA as an installable Android APK or Google Play Store application:
1. **Using Capacitor:**
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init "Armour of God" "com.armourofgod.app"
   npm run build
   npx cap add android
   npx cap sync
   npx cap open android
   ```
2. Build the signed release bundle in Android Studio.

---

## 📖 Source Reference

This application draws its theological curriculum and battle prayers from the pastoral study:  
**"Fighting the Battle of Sexual Sin with the Armour of God"**  
Available locally in `/public/assets/aistudio/Sexaul_sin_074d3045.pdf`.

---

## 📜 License

Distributed under the Apache 2.0 License. All scripture quotations are from the Holy Bible, English Standard Version (ESV).
