# Hospital AI CRM - Complete Patient Management & Appointment System

A production-ready Hospital AI CRM application built with Next.js 15, TypeScript, MongoDB, and Gemini AI. Features AI-powered chatbot, appointment management, patient records, and comprehensive analytics.

## 🎯 Features

### Core Features
- 🤖 **AI Chatbot** - Floating AI assistant powered by Google Gemini
- 👥 **Patient Management** - Complete CRUD for patient records
- 👨‍⚕️ **Doctor Management** - Doctor profiles with specialization and availability
- 🏥 **Clinic Management** - Multiple clinic management
- 📅 **Appointment Booking** - Schedule appointments with real-time availability
- 💌 **Email System** - 10 professional email templates with Nodemailer
- 📊 **Analytics Dashboard** - Charts and statistics with Recharts
- 🔐 **Authentication** - JWT-based secure login
- 📱 **Responsive Design** - Mobile, tablet, and desktop support
- ✨ **Glassmorphism UI** - Premium modern design with animations

### Admin Features
- Lead Management & Tracking
- Patient Database
- Doctor Profiles & Availability
- Clinic Information
- Appointment Scheduling
- Email Template Management
- Advanced Analytics
- Security Settings

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Lucide Icons** - Beautiful icons

### Backend
- **Next.js Server Actions** - Backend logic
- **MongoDB** - Document database
- **Mongoose** - ODM
- **Google Gemini API** - AI capabilities
- **Nodemailer** - Email sending
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Deployment
- **Vercel** - Hosting platform

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB Atlas account
- Google AI Studio account (for Gemini API)
- Gmail account (for email sending)

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd hospital-ai-crm

# Install dependencies
npm install
```

### 2. Environment Configuration

```bash
# Copy example file
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital-crm?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production

# Gemini API
GEMINI_API_KEY=your-gemini-api-key-from-google-ai-studio

# Email (Gmail SMTP)
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# App
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Set Up Credentials

#### MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Add to `MONGODB_URI`

#### Google Gemini API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create new API key
4. Add to `GEMINI_API_KEY`

#### Gmail SMTP
1. Enable 2-factor authentication on Gmail
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Generate app password for "Mail" and "Windows Computer"
4. Use the 16-character password as `EMAIL_PASS`

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 5. Login

Use demo credentials:
- **Email:** admin@example.com
- **Password:** admin123

## 📁 Project Structure

```
hospital-ai-crm/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Login page
│   ├── globals.css                # Global styles
│   ├── api/
│   │   ├── auth/
│   │   │   └── login/route.ts
│   │   ├── chat/route.ts          # Gemini AI
│   │   ├── leads/route.ts
│   │   ├── patients/route.ts
│   │   ├── doctors/route.ts
│   │   ├── clinics/route.ts
│   │   ├── appointments/route.ts
│   │   ├── email/send/route.ts
│   │   └── stats/route.ts
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx               # Main dashboard
│       ├── leads/page.tsx
│       ├── patients/page.tsx
│       ├── doctors/page.tsx
│       ├── clinics/page.tsx
│       ├── appointments/page.tsx
│       ├── emails/page.tsx        # Email templates
│       ├── analytics/page.tsx
│       └── settings/page.tsx
├── components/
│   ├── Providers.tsx              # App providers
│   ├── Chatbot.tsx                # AI chatbot
│   └── dashboard/
│       ├── DashboardNav.tsx
│       └── DashboardSidebar.tsx
├── models/
│   ├── User.ts
│   ├── Lead.ts
│   ├── Patient.ts
│   ├── Doctor.ts
│   ├── Clinic.ts
│   ├── Appointment.ts
│   ├── EmailTemplate.ts
│   └── EmailLog.ts
├── lib/
│   ├── db.ts                      # MongoDB connection
│   ├── auth.ts                    # JWT utilities
│   ├── email.ts                   # Email sending
│   └── types.ts                   # TypeScript types
├── public/                        # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
└── .env.example
```

## 🎨 Design System

### Colors
- **Primary:** Medical Blue (#0F6FDD)
- **Secondary:** Cyan (#06B6D4)
- **Background:** Soft Gradient
- **Accent:** Glassmorphism effects

### Components
- Glass cards with backdrop blur
- Smooth animations with Framer Motion
- Responsive grid layouts
- Dark mode support

## 🔐 Security Features

- JWT authentication with 7-day expiration
- Password hashing with bcryptjs
- Protected dashboard routes
- API authentication headers
- Environment variable protection
- Rate limiting ready (can be enabled)

## 📊 Dashboard Pages

1. **Dashboard** - Overview with stats and charts
2. **Leads** - Lead management and tracking
3. **Patients** - Patient records CRUD
4. **Doctors** - Doctor profiles and availability
5. **Clinics** - Clinic management
6. **Appointments** - Appointment scheduling
7. **Email Templates** - Professional email templates (10 included)
8. **Analytics** - Advanced charts and KPIs
9. **Settings** - Account, notifications, security settings

## 🤖 AI Chatbot Features

- Floating interface at bottom-right
- Real-time responses with Gemini AI
- Automatic lead capture
- Quick action buttons
- Conversation history
- Professional medical tone

## 📧 Email Templates

10 professional templates included:
1. Appointment Confirmation
2. Appointment Reminder
3. New Patient Welcome
4. Lab Report Ready
5. Follow-up Consultation
6. Health Checkup Reminder
7. Vaccination Reminder
8. Appointment Cancellation
9. Thank You Message
10. Appointment Reschedule

## 📈 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Leads
- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create lead
- `PUT /api/leads` - Update lead
- `DELETE /api/leads` - Delete lead

### Patients
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Create patient
- `PUT /api/patients` - Update patient
- `DELETE /api/patients` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors` - Update doctor
- `DELETE /api/doctors` - Delete doctor

### Clinics
- `GET /api/clinics` - Get all clinics
- `POST /api/clinics` - Create clinic
- `PUT /api/clinics` - Update clinic
- `DELETE /api/clinics` - Delete clinic

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments` - Update appointment
- `DELETE /api/appointments` - Delete appointment

### Email
- `POST /api/email/send` - Send email

### Stats
- `GET /api/stats` - Get dashboard statistics

### Chat
- `POST /api/chat` - Send message to AI


## 🛠️ Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

## 📝 Database Models

### User
- Email, Password, Name, Role, Timestamps

### Lead
- Name, Phone, Email, Message, Source, Status, Timestamps

### Patient
- Name, Phone, Email, Age, Gender, Address, Notes, Timestamps

### Doctor
- Name, Specialization, Qualification, Experience, Clinic, Availability, Status

### Clinic
- Name, Address, City, Phone, Email, Website

### Appointment
- Patient, Doctor, Clinic, Date, Time, Status, Notes

### EmailTemplate
- Name, Subject, Body, Variables

### EmailLog
- To, Subject, Status, Error (if failed)

## 🆘 Troubleshooting

### MongoDB Connection Error
- Check connection string in `.env.local`
- Verify IP whitelist in MongoDB Atlas
- Ensure user has correct permissions

### Email Not Sending
- Enable "Less secure apps" or use App Password
- Check EMAIL_USER and EMAIL_PASS
- Verify recipient email is correct

### Gemini API Error
- Check API key validity
- Ensure API is enabled in Google Cloud
- Verify rate limits

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 📞 Support

For issues or questions:
1. Check the documentation
2. Review the code comments
3. Check error logs
4. Create an issue on GitHub

## 📄 License

This project is licensed under the MIT License.

## 🎉 Credits

Built with modern web technologies for healthcare management.

---

**Happy Coding! 🚀**
#   E - M i d a s - C h a t b o t - F u l l - P r o j e c t  
 