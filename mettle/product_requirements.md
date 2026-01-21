# **Product Requirements Report: ATS Platform**

**Perspective:** Recruitment Staff (Recruiters, Hiring Managers, HR Admins)
**Product Vision:**
Sadece adayları takip eden bir sistem değil; doğru adayı, doğru pozisyona, doğru zamanda yönlendiren **AI-native Recruitment Intelligence Platform**.

---

## **1. Authentication & Access (The Gateway)**

**Goal:** Secure, seamless entry for internal staff while maintaining strict data privacy standards.

### **1.1 Sign-In / Sign-Up Page**

* **Single Sign-On (SSO)**

  * Google Workspace
  * Microsoft Azure AD
  * Okta

* **Multi-Factor Authentication (MFA)**

  * SMS
  * Authenticator App
  * Role-based enforcement (Admin için zorunlu, Recruiter için opsiyonel)

* **Role-Based Access Control (RBAC)**

  * Roller:

    * Super Admin
    * Recruiter
    * Hiring Manager
    * Interviewer (Read-only + feedback)
  * Login sonrası UI ve erişim alanları otomatik şekillenir

* **Forgot Password Workflow**

  * Secure token
  * Zaman kısıtlı reset link
  * Audit log kaydı

---

## **2. The Dashboard (Command Center)**

**Goal:** Recruiter’ın tüm işe alım operasyonunu tek ekrandan yönetebilmesi.

### **2.1 Personalized Overview**

* **Action Required Widget**

  * “3 aday feedback bekliyor”
  * “15 dakika sonra mülakat”
  * “2 aday SLA aşıyor”

* **Pipeline Health Overview**

  * Funnel view:

    * Applied
    * Interview
    * Offer
    * Hired
  * Drop-off oranları

* **My Open Requisitions**

  * Job title
  * Status (Draft / Open / Paused / Closed)
  * Active candidate count

* **Calendar View**

  * Günlük / haftalık görünüm
  * Interview blokları
  * Screening call slotları

### **2.2 AI Insights Widget (Advanced)**

* Sistem tarafından üretilen günlük içgörüler:

  * “Bu hafta en güçlü 5 aday Data Engineer rolü için hazır”
  * “Manager Review aşaması %28 gecikiyor”
* Risk sinyalleri:

  * High drop-off risk
  * Low diversity risk
  * Fast-track candidate önerisi

---

## **3. Job Management (Requisition Engine)**

**Goal:** Job creation → approval → sourcing sürecini minimum manuel eforla yönetmek.

### **3.1 Job Creation Wizard**

* **Template Library**

  * Role bazlı hazır şablonlar
  * Şirket içi kütüphane

* **AI Job Description Generator**

  * Input:

    * Pozisyon adı
    * Anahtar kelimeler
    * Seniority
  * Output:

    * Tam ilan metni
    * Sorumluluklar
    * Gereksinimler
    * Yetkinlik setleri
  * Bias azaltıcı dil kontrolü

* **Tone & Employer Branding**

  * Kurumsal
  * Startup
  * Genç yetenek
  * Executive

* **Approval Workflow**

  * Draft → HR → Finance → Hiring Manager → Approved
  * SLA takibi
  * Otomatik hatırlatma

* **Job Settings**

  * Salary range
  * Remote / Hybrid / Onsite
  * Hiring team
  * Visibility rules

---

### **3.2 Sourcing & Broadcasting**

* **Multi-Board Posting**

  * LinkedIn
  * Indeed
  * Glassdoor
  * Kariyer.net
  * Company Career Page

* **AI-Based Candidate Redirection**

  * Adaylar standart formlar yerine:

    * AI destekli başvuru akışına yönlendirilir

* **LinkedIn AI Sourcing**

  * Semantik profile matching
  * Recruiter onaylı shortlist

* **Agency Portal**

  * Unique job links
  * Agency performance tracking

---

## **4. Candidate Management (The Core ATS)**

**Goal:** Aday yaşam döngüsünü başvurudan onboarding’e kadar uçtan uca yönetmek.

### **4.1 Candidate Profile**

* **CV Parsing & Auto-Fill**

  * PDF / Word
  * %100 otomatik form doldurma
  * Eksik alanlar için mikro-soru

* **Rich Profile View**

  * CV
  * Cover letter
  * Portfolio / GitHub / Behance
  * Screening answers

* **Activity Timeline**

  * Email
  * Status change
  * Interview
  * Notes
  * AI decisions

* **Tags & Smart Labels**

  * Otomatik:

    * Tech stack
    * Visa
    * Seniority
  * Manuel:

    * “Fast-track”
    * “Silver Medalist”

---

### **4.2 Pipeline Management (Kanban Board)**

* Drag & drop stage yönetimi
* Bulk actions:

  * Reject
  * Email
  * Move stage
* Automated rejection triggers
* SLA & aging indicators

---

### **4.3 Search & Discovery (Matching & Scoring Engine)**

* **Semantic Matching**

  * CV – JD anlamsal karşılaştırma
  * Match score (%)

* **Detailed Score Breakdown**

  * Skills
  * Experience duration
  * Industry
  * Location
  * Language
  * Education

* **Gap Analysis (Explainable AI)**

  * Neden bu skor?
  * Eksik zorunlu yetkinlikler
  * Risk alanları

* **Auto Pre-Screening**

  * Threshold bazlı eleme
  * High-score adaylara otomatik davet

---

## **5. Evaluation & Collaboration**

**Goal:** Objektif, hızlı ve iş birliğine dayalı karar alma.

### **5.1 Interview Management**

* **Smart Scheduling**

  * Google / Outlook sync
  * Candidate self-booking

* **Interview Kits**

  * Role-specific questions
  * Code challenges
  * Evaluation criteria

* **AI Call Assistant**

  * İlk temas
  * Uygun zaman toplama
  * Takvim planlama

* **Dynamic Question Generation**

  * Zorluk seviyesi
  * Yetkinlik bazlı varyasyon

* **AI Avatar Interview (Optional)**

  * Standardize ön mülakat
  * Asenkron veya canlı

---

### **5.2 Feedback & Scoring**

* **Scorecards**

  * 1–5 competency rating
  * Structured feedback

* **Blind Feedback**

  * Groupthink önleme

* **Team Notes & @Mentions**

  * Internal collaboration

---

## **6. Communication Hub**

**Goal:** Aday iletişimini merkezi ve otomatik yönetmek.

* **Email Sync**

  * Gmail / Outlook
  * Two-way sync

* **Template Library**

  * Interview
  * Rejection
  * Offer

* **Bulk Campaigns**

  * Passive candidate nurturing

* **AI Triggered Follow-ups**

  * Davranış bazlı iletişim
  * Otomatik hatırlatma

---

## **7. Settings & Administration**

### **7.1 General Settings**

* **Company Profile**: Name, website, support contacts.
* **Branding**:
  * Logo upload & preview.
  * Brand color customization (Primary/Accent).
* **Localization**:
  * Timezone selection.
  * Currency format.
  * Date format preferences.

### **7.2 User Management & Access**

* **Team Management**: List users, invite new members.
* **Roles & Permissions Matrix**:
  * Granular control (Admin, Recruiter, Hiring Manager).
  * Feature-level toggles (e.g., "Can Delete Job", "View Salaries").
* **Groups**: Associate users with specific departments or locations.

### **7.3 Workflow & Automation**

* **Pipeline Editor**:
  * Visual Drag-and-Drop interface.
  * Customize stage names and order.
  * Set "Time to Hire" targets per stage.
* **Email Templates**:
  * Template editor for automated communications.
  * Variables support (e.g., `{{candidate_name}}`).
  * System vs. Custom templates.

### **7.4 Security & Compliance**

* **Single Sign-On (SSO)**:
  * SAML / OIDC configuration.
  * Provider metadata setup.
* **Audit Logs**:
  * Detailed activity tracking (Who, What, When, IP).
  * Filterable security events.

### **7.5 Integrations**

* **HRIS**: Workday, BambooHR synchronization.
* **Communication**: Slack (notifications), Zoom (interview scheduling).
* **Calendar**: Gmail/Outlook two-way sync.
* **API Access**: Webhook configuration for external tools.

---

## **8. Reporting & Analytics (Decision Intelligence)**

**Goal:** İnsan kararlarını veri ve yapay zeka ile güçlendirmek.

### **8.1 Core Metrics**

* Time to Hire
* Source effectiveness
* Pipeline bottlenecks
* Diversity metrics (anonymized)

---

### **8.2 Video & Content Analysis**

* Automatic transcript
* AI summary
* Context & depth analysis
* STAR competency mapping

---

### **8.3 Behavioral & Biometric AI (Opt-in & Ethical)**

* Facial expression & emotion analysis
* Voice analysis
* Personality & values report
* Anti-cheating & behavior tracking

---

### **8.4 Decision Support**

* **AI Chatbot (HR Assistant)**

  * Serbest metin aday sorguları

* **360° Candidate Evaluation**

  * Role fit + culture fit

* **AI Decision Recommendation**

  * Proceed
  * Hold
  * Reject (with reasoning)

---

### **8.5 Offer & Onboarding**

* Offer letter automation
* Approval flows
* HRIS sync
* Onboarding task lists
