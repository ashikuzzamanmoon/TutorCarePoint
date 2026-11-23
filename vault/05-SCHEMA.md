# 05. Database Schema & Data Contracts

## 1. Schema Architecture Overview
- **Database:** PostgreSQL
- **ORM:** Prisma 7 (`prisma/schema.prisma`)
- **Connection Model:** Prisma 7 driver adapter (`@prisma/adapter-pg` in `lib/prisma.ts`), connection URL in `prisma.config.ts`.

---

## 2. Models & Fields Specification

### 1. `User` (Authentication Account)
- `id`: String (cuid, Primary Key)
- `name`: String?
- `email`: String (Unique)
- `emailVerified`: DateTime?
- `image`: String?
- `passwordHash`: String?
- `role`: Enum `Role` (`TUTOR` [default], `ADMIN`)
- `createdAt`, `updatedAt`: DateTime
- *Relations:* `accounts`, `sessions`, `tutorProfile`

### 2. `TutorProfile` (Tutor Public Directory)
- `id`: String (cuid, Primary Key)
- `userId`: String (Unique, Foreign Key -> `User.id`)
- `displayName`: String
- `gender`: Enum `Gender` (`MALE`, `FEMALE`, `ANY`)
- **`phone`**: String (**PRIVATE** — শুধুমাত্র অ্যাডমিন দেখতে পারবেন এবং কনফার্মেশনের পর সংশ্লিষ্ট অভিভাবক দেখতে পারবেন)
- `district`: String (Slug key from `lib/site.ts`)
- `area`: String? (Upazila / neighbourhood free-text)
- `educationLevel`: String (e.g., "অনার্স ৩য় বর্ষ")
- `institution`: String?
- `subjects`: String[]
- `classes`: String[]
- `mediums`: Enum `Medium`[]
- `expectedSalary`: Int? (Monthly BDT; null = negotiable)
- `daysPerWeek`: Int?
- `experienceYears`: Int (Default 0)
- `bio`: String? (Text)
- `isVerified`: Boolean (Default false)
- `isPublished`: Boolean (Default true)
- *Indexes:* `[district, isPublished]`, `[isPublished, isVerified]`

### 3. `Job` (Guardian Tuition Requirement)
- `id`: String (cuid, Primary Key)
- **`guardianName`**: String (**PRIVATE**)
- **`guardianPhone`**: String (**PRIVATE** — পাবলিক পেজে নিষিদ্ধ, শুধুমাত্র কনফার্মড টিউটর দেখতে পাবেন)
- `title`: String (Server-generated from class + subjects + area)
- `className`: String
- `subjects`: String[]
- `medium`: Enum `Medium` (Default `BANGLA`)
- `district`: String (Slug key from `lib/site.ts`)
- `area`: String?
- `salary`: Int? (Monthly BDT; null = negotiable)
- `salaryNegotiable`: Boolean (Default false)
- `daysPerWeek`: Int (Default 5)
- `tutorGenderPreference`: Enum `Gender` (Default `ANY`)
- `notes`: String? (Text)
- `status`: Enum `JobStatus` (Default `PENDING_REVIEW`)
- `publishedAt`: DateTime? (Set upon admin approval; auto-expires in 30 days)
- *Indexes:* `[status, publishedAt]`, `[district, status]`

### 4. `Application` (Tutor Application to a Job)
- `id`: String (cuid, Primary Key)
- `jobId`: String (Foreign Key -> `Job.id`)
- `tutorId`: String (Foreign Key -> `TutorProfile.id`)
- `status`: Enum `ApplicationStatus` (Default `APPLIED`)
- `note`: String? (Text)
- *Constraints:* `@@unique([jobId, tutorId])` (এক টিউটর একটি জবে একবারই আবেদন করতে পারবেন)
- *Indexes:* `[tutorId, status]`, `[jobId, status]`

### 5. NextAuth Tables
- `Account`, `Session`, `VerificationToken` (Required by `@auth/prisma-adapter`).

---

## 3. Enums Definition
```prisma
enum Role {
  TUTOR
  ADMIN
}

enum Gender {
  MALE
  FEMALE
  ANY
}

enum Medium {
  BANGLA
  ENGLISH_MEDIUM
  ENGLISH_VERSION
  MADRASA
}

enum JobStatus {
  PENDING_REVIEW
  OPEN
  FILLED
  EXPIRED
  CANCELLED
}

enum ApplicationStatus {
  APPLIED
  SHORTLISTED
  DEMO
  CONFIRMED
  COMPLETED
  CANCELLED
}
```
