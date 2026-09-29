# Exam Key Club Web App

Production app with Supabase authentication.

## Files
- index.html — app shell (UI, styles, i18n markers)
- app.js — Supabase auth (email OTP + password), i18n (Hindi/English), profile, stats

## Features
- Email OTP login (6-digit code / magic link) + password login/signup
- Hindi ↔ English language toggle (saved in localStorage + profile)
- User profiles stored in Supabase (public.profiles)
- Course catalogue in Supabase (public.courses) — seeded with 8 courses
- Enrollments, progress, quiz_results tables ready for next phases
- Row Level Security enabled on all tables

## Backend
Supabase project: EXAM KEY CLUB (ap-south-1)
- Table `profiles`: id, full_name, phone, role, preferred_language, created_at, updated_at
- Trigger `on_auth_user_created` auto-creates a profile row on signup
- Policies: users can view/update/insert only their own profile & data

## Hosting
GitHub Pages: https://vijaykumar5star.github.io/exam-key-club/

## Next phases
- Test engine (mock tests, results, analysis) — tables `questions`, `quiz_results` ready
- Payments (Razorpay/UPI) — table `payments` ready
- Admin panel — table `admin_users` ready
- Video/PDF content protection — tables `lessons`, `course_access` ready
