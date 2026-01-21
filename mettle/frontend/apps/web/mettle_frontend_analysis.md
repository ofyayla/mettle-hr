# Mettle Frontend Platform - Detailed Analysis Report

## 📋 Executive Summary

**Mettle**, modern React ve TypeScript tabanlı, TailwindCSS ile stilize edilmiş bir **HR-AI İşe Alım Yönetim Platformu**dur. Platform, **npm workspaces** ile monorepo yapısında organize edilmiş olup, işe alım süreçlerinin tüm aşamalarını kapsayan kapsamlı bir feature set'e sahiptir.

---

## 🏗️ Architecture & Technology Stack

### Monorepo Structure
```
mettle/frontend/
├── apps/
│   └── web/                        # Ana Vite + React uygulaması
├── packages/
│   ├── ui/                         # Paylaşımlı UI component kütüphanesi
│   ├── eslint-config/              # ESLint konfigürasyonu
│   └── typescript-config/          # TypeScript konfigürasyonu
```

### Core Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI Framework |
| **TypeScript** | ~5.9.3 | Type Safety |
| **Vite** | 7.2.4 | Build Tool & Dev Server |
| **TailwindCSS** | 3.4.19 | Styling |
| **React Router DOM** | 7.11.0 | Client-side Routing |
| **@dnd-kit** | 6.3.1 | Drag & Drop (Kanban) |
| **Recharts** | 3.6.0 | Data Visualization |
| **Lucide React** | 0.562.0 | Icon Library |
| **date-fns** | 4.1.0 | Date Manipulation |

---

## 🎨 Design System

### Theme Configuration
Platform, **Light** ve **Dark** tema desteğine sahip, CSS custom properties ile yönetilen kapsamlı bir design system içerir:

#### Primary Colors
- **Primary Green**: `#0adb50` (HSL: 140.1°, 91.3%, 44.9%)
- **Destructive Red**: `#DA0B2D` (HSL: 350°, 91%, 45%)

#### Theme Variables
- `--background`, `--foreground`, `--card`, `--popover`
- `--primary`, `--secondary`, `--muted`, `--accent`
- `--destructive`, `--border`, `--input`, `--ring`
- Sidebar-specific variables
- Chart color palette (5 colors)

### Utility Classes
- `.hover-neon-border` - Hover state için neon border efekti
- `.animate-in`, `.animate-slide-in` - Entry animasyonları

---

## 📱 Feature Sets (Sayfa Bazlı)

### 1. 🏠 Dashboard (`/`)
**Dosya**: [DashboardPage.tsx](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/pages/DashboardPage.tsx)

| Feature | Description |
|---------|-------------|
| **Recruitment Status Cards** | Aktif ilanlar, toplam adaylar, mülakat sayıları |
| **Recruitment Funnel Chart** | Aday hunisi görselleştirmesi (Recharts) |
| **AI Insight Card** | AI destekli içgörüler ve öneriler |
| **Recent Activity** | Son aktiviteler listesi |
| **Agenda Widget** | Günlük mülakat takvimi |
| **Week Calendar** | Haftalık görünüm ile tarih navigasyonu |
| **Cross-page Navigation** | Jobs ve Planner sayfalarına geçiş |

**Components**:
- `RecruitmentStatusCard` - KPI kartları
- `RecruitmentFunnelChart` - Huni grafiği
- `AIInsightCard` - AI önerileri
- `RecentActivity` - Aktivite timeline
- `DashboardRow` - Layout bileşeni

---

### 2. 💼 Jobs (`/jobs`)
**Dosya**: [JobsPage.tsx](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/pages/JobsPage.tsx)

| Feature | Description |
|---------|-------------|
| **Job Listing** | Grid/List view toggle ile iş ilanları |
| **Create Job Modal** | Yeni ilan oluşturma (AI destekli) |
| **Edit/Delete Jobs** | CRUD operasyonları |
| **Filter Panel** | Department, Location, Type, Status filtreleri |
| **Sort Functionality** | Başvuran sayısı, tarih, başllik sıralama |
| **Job Details Modal** | Detaylı ilan görüntüleme |

**Data Model - Job**:
```typescript
interface Job {
    id: string;
    title: string;
    department: 'Engineering' | 'Sales' | 'Marketing' | 'HR' | 'Product';
    location: string;
    type: 'Full-time' | 'Contract' | 'Remote';
    status: 'Open' | 'Closed' | 'Draft';
    applicantsCount: number;
    createdAt: string;
    description?: string;
    requirements?: string[];
}
```

**Components**:
- `JobsHeader` - Arama, filtre, view toggle
- `JobCard` - Grid görünüm kartı
- `JobListRow` - Liste görünüm satırı
- `CreateJobModal` - Oluşturma/Düzenleme formu
- `JobDetailsModal` - Detay popup
- `JobsFilterPanel` - Filtre paneli

---

### 3. 👥 Candidates (`/candidates`)
**Dosya**: [CandidatesPage.tsx](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/pages/CandidatesPage.tsx)

| Feature | Description |
|---------|-------------|
| **Candidate Listing** | Tüm adayların listesi (Grid view) |
| **Add/Edit Candidate** | Aday ekleme/düzenleme modal |
| **Profile Modal** | Detaylı aday profili görüntüleme |
| **Search & Filter** | İsim, rol, kaynak, durum filtreleri |
| **Sort** | İsim, skor, deneyim yılı sıralama |
| **Delete Confirmation** | Silme onay modal |
| **API Integration** | Mock API ile veri yönetimi |

**Data Model - Candidate**:
```typescript
interface Candidate {
    id: string;
    name: string;
    email: string;
    phone?: string;
    photoUrl?: string;
    role: string;
    source: 'LinkedIn' | 'GitHub' | 'Referral' | 'CareerPage' | 'Indeed';
    status: 'New' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';
    score: number; // 0-100 AI Score
    tags: string[];
    createdAt: string;
    location?: string;
    skills: string[];
    experienceYears: number;
    summary?: string;
    experience?: any[];
    education?: any[];
    certifications?: any[];
    appliedJobId?: string;
    resumeUrl?: string;
}
```

**Components**:
- `CandidatesHeader` - Arama ve kontroller
- `CandidateCard` - Aday kartı (Delete, Mail, View Details)
- `CandidateListRow` - Liste görünümü
- `CandidateProfileModal` - Profil detayı
- `AddCandidateModal` - Form (41KB, kapsamlı)
- `CandidatesFilterPanel` - Filtre paneli
- `AddCandidateCard` - "+" ekleme kartı

---

### 4. 📊 Pipeline (`/pipeline`)
**Dosya**: [PipelinePage.tsx](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/pages/PipelinePage.tsx)

| Feature | Description |
|---------|-------------|
| **Kanban Board** | 6 kolonlu sürükle-bırak panosu |
| **Drag & Drop** | @dnd-kit ile aday taşıma |
| **Column Status** | New → Screening → Interview → Offer → Hired/Rejected |
| **Candidate Cards** | Mini aday kartları |
| **Edit/Delete from Board** | Sağ tık menü aksiyonları |
| **Status Auto-update** | Kolon değişikliğinde durum güncelleme |

**Pipeline Columns**:
| Status | Label | Color |
|--------|-------|-------|
| New | New | Blue |
| Screening | Screening | Purple |
| Interview | Interview | Orange |
| Offer | Offer | Green |
| Hired | Hired | Emerald |
| Rejected | Rejected | Red |

**Components**:
- `PipelineColumn` - Kanban kolonu
- `PipelineCard` - Sürüklenebilir aday kartı
- `DeleteConfirmationModal` - Onay dialog

---

### 5. 📅 Planner (`/planner`)
**Dosya**: [PlannerPage.tsx](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/pages/PlannerPage.tsx)

| Feature | Description |
|---------|-------------|
| **Day View** | Günlük saat bazlı takvim |
| **Week View** | Haftalık takvim görünümü |
| **Month View** | Aylık takvim görünümü |
| **Add/Edit Events** | Etkinlik oluşturma/düzenleme |
| **Event Detail Popup** | Etkinlik detay görüntüleme |
| **Delete Events** | ESC ile kapanabilen onay modal |
| **Navigation** | Today, Previous, Next navigasyonu |
| **Filter Panel** | Title, Status, Attendees, Date filtreleri |

**Event Types**:
- Interview (Mülakat)
- Technical Review
- Team Meeting
- etc.

**Components**:
- `PlannerHeader` - View toggle ve navigasyon
- `DayCalendar` - Günlük görünüm
- `WeekCalendar` - Haftalık görünüm
- `MonthCalendar` - Aylık görünüm
- `EventCard` - Etkinlik kartı
- `EventDetailPopup` - Detay popup
- `AddEventModal` - Etkinlik formu
- `PlannerFilterPanel` - Filtreler

---

### 6. 🤖 AI Tools (`/ai-assistant`)
**Dosya**: [AIToolsPage.tsx](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/pages/AIToolsPage.tsx)

| Feature | Description |
|---------|-------------|
| **JD Generator** | AI ile iş tanımı oluşturma |
| **Email Generator** | Aday iletişim e-postaları |
| **Copy to Clipboard** | Oluşturulan içeriği kopyalama |
| **Loading States** | Simüle edilmiş API gecikmeleri |

**AI Service API**:
```typescript
interface AIJobGenerationRequest {
    title: string;
    keywords?: string[];
    tone?: 'Professional' | 'Casual' | 'Technical';
}

interface AIJobGenerationResponse {
    description: string;
    requirements: string[];
    suggestedType: string;
    suggestedDepartment: string;
}
```

---

### 7. 📈 Analytics (`/analytics`)
**Dosya**: [AnalyticsPage.tsx](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/pages/AnalyticsPage.tsx)

| Feature | Description |
|---------|-------------|
| **KPI Cards** | Toplam Başvuru, Ort. Süre, Teklif Oranı, Aktif Pozisyonlar |
| **Recruitment Funnel** | Başvuru → Değerlendirme → Mülakat → Teklif → İşe Alım |
| **Source Analytics** | LinkedIn, Kariyer.net, Referral, Web Sitesi bar chart |
| **Animated Charts** | Hover efektleri ve animasyonlar |

---

### 8. ✅ Assessment (`/assessment`)
**Dosya**: [AssessmentPage.tsx](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/pages/AssessmentPage.tsx)

| Feature | Description |
|---------|-------------|
| **Upcoming Interviews** | Yaklaşan mülakat listesi |
| **Scorecard Form** | Mülakat değerlendirme formu |
| **Star Rating** | 5 yıldızlı puanlama sistemi |
| **Technical Skills** | Teknik yetkinlik değerlendirmesi |
| **Soft Skills** | Yumuşak beceri değerlendirmesi |
| **Notes Section** | Genel notlar alanı |
| **Video Call Button** | Görüntülü görüşme başlatma |

---

### 9. 🎉 Offer & Onboarding (`/offer`)
**Dosya**: [OfferPage.tsx](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/pages/OfferPage.tsx)

| Feature | Description |
|---------|-------------|
| **Offer Cards** | Teklif bekleyen adaylar |
| **Salary Display** | Maaş ve yan haklar |
| **Send Offer** | Teklif gönderme aksiyonu |
| **Onboarding Tracker** | İşe başlama süreci takibi |
| **Document Progress** | Evrak yükleme durumu |
| **Progress Bars** | Onboarding ilerleme göstergeleri |

---

## 🧩 Shared Components

### Layout Components
| Component | Description |
|-----------|-------------|
| `Layout` | Ana wrapper, header ve tema toggle |
| `Sidebar` | Collapsible navigasyon menüsü |

### Common Components
| Component | Description |
|-----------|-------------|
| `DeleteConfirmationModal` | Genel silme onay dialog |
| `FilterPanel` (various) | Filter sidebar bileşenleri |

---

## 🔌 Services Layer

### API Service (`api.ts`)
Mock data ile çalışan API abstraction layer:
- `api.candidates.list()` - Aday listesi
- `api.candidates.get(id)` - Tekil aday
- `api.candidates.create(candidate)` - Oluşturma
- `api.candidates.update(candidate)` - Güncelleme
- `api.jobs.list()` - İş ilanları listesi

### AI Service (`aiService.ts`)
- `generateJobDescription(request)` - AI iş tanımı oluşturma (Mock)

---

## 📊 Data & Mock System

### Mock Data Location
[mockData.ts](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/lib/mockData.ts) - 6.5KB

### Candidate Sources
- LinkedIn
- GitHub
- Referral
- CareerPage
- Indeed

### DnD Utilities
[dnd-utils.ts](file:///Users/ofyayla/hr-ai/mettle/frontend/apps/web/src/lib/dnd-utils.ts) - DnD Kit yardımcıları

---

## 🗂️ Complete Component Summary

| Category | Components | Total Size |
|----------|------------|------------|
| **Dashboard** | 5 | ~34KB |
| **Jobs** | 6 | ~76KB |
| **Sourcing/Candidates** | 8 | ~86KB |
| **Planner** | 8 | ~65KB |
| **Pipeline** | 3 | ~25KB |
| **Admin** | 5 | TBD |
| **Layout** | 2 | ~18KB |
| **Common** | 2+ | ~10KB |
| **TOTAL** | **40+** | **~300KB+** |

---

## ✅ Feature Maturity Matrix

| Feature | UI Complete | Logic Complete | Backend Ready |
|---------|:-----------:|:--------------:|:-------------:|
| Dashboard | ✅ | ✅ | ⚠️ Mock |
| Jobs CRUD | ✅ | ✅ | ⚠️ Mock |
| Candidates CRUD | ✅ | ✅ | ⚠️ Mock |
| Kanban Pipeline | ✅ | ✅ | ⚠️ Mock |
| Planner Calendar | ✅ | ✅ | ⚠️ Mock |
| AI Tools | ✅ | ⚠️ Mock | ⚠️ Mock |
| Analytics | ✅ | ⚠️ Static | ❌ |
| Assessment | ✅ | ⚠️ Partial | ❌ |
| Offer/Onboarding | ✅ | ⚠️ Static | ❌ |
| Theme Toggle | ✅ | ✅ | N/A |
| Light/Dark Mode | ✅ | ✅ | N/A |

**Legend**: ✅ Complete | ⚠️ Partial/Mock | ❌ Not Implemented

---

## 🚀 Conclusion

**Mettle Frontend**, modern bir HR-AI platformu için gerekli tüm temel özellikleri içeren, iyi yapılandırılmış bir frontend uygulamasıdır. Ana güçlü yönleri:

1. **Modern Tech Stack** - React 19, TypeScript, Vite
2. **Comprehensive UI** - 10 farklı sayfa, 40+ bileşen
3. **Full CRUD** - Jobs ve Candidates için tam CRUD
4. **Advanced UX** - Kanban DnD, Calendar views, Filtering
5. **AI Integration Ready** - AI service abstraction mevcut
6. **Scalable Architecture** - Monorepo, shared packages
7. **Dark/Light Themes** - Kapsamlı tema desteği

**Backend entegrasyonu** için mock servisler gerçek API'lerle değiştirildiğinde production-ready olacak durumda.
