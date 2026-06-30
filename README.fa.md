# 📋 مدیریت تسک

یک اپلیکیشن کامل مدیریت تسک با **FastAPI** (بک‌اند) و **Next.js** (فرانت‌اند)

![Task Manager](https://img.shields.io/badge/version-1.0.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-green)
![Next.js](https://img.shields.io/badge/Next.js-16.2.9-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📸 اسکرین‌شات‌ها

### صفحه اصلی

![Landing Page](screenshots/landing.png)

### احراز هویت

| ورود                            | ثبت‌نام                               |
| ------------------------------- | ------------------------------------- |
| ![Login](screenshots/login.png) | ![Register](screenshots/register.png) |

### داشبورد و برد

| داشبورد                                 | برد تسک‌ها                      |
| --------------------------------------- | ------------------------------- |
| ![Dashboard](screenshots/dashboard.png) | ![Board](screenshots/board.png) |

### مدیریت تسک‌ها

| لیست تسک‌ها                     | فرم تسک                                 | جزئیات تسک                                  |
| ------------------------------- | --------------------------------------- | ------------------------------------------- |
| ![Tasks](screenshots/tasks.png) | ![Task Form](screenshots/task-form.png) | ![Task Detail](screenshots/task-detail.png) |

### تقویم و گزارشات

| تقویم                                 | گزارشات                             |
| ------------------------------------- | ----------------------------------- |
| ![Calendar](screenshots/calendar.png) | ![Reports](screenshots/reports.png) |

### پروفایل و API

| پروفایل                             | مستندات API                         |
| ----------------------------------- | ----------------------------------- |
| ![Profile](screenshots/profile.png) | ![Swagger](screenshots/swagger.png) |

### تم تاریک

![Dark Mode](screenshots/dark-mode.png)

## 🌐 نسخه زنده

- **فرانت‌اند:** [task-manager-frontend-lyart-nu.vercel.app](https://task-manager-frontend-lyart-nu.vercel.app)
- **بک‌اند:** [task-manager-api-beige.vercel.app](https://task-manager-api-beige.vercel.app)
- **مستندات API:** [task-manager-api-beige.vercel.app/docs](https://task-manager-api-beige.vercel.app/docs)

---

## ✨ ویژگی‌ها

### 🔐 احراز هویت

- ثبت‌نام و ورود کاربران
- احراز هویت JWT با کوکی‌های HttpOnly
- تازه‌سازی خودکار توکن
- خروج از حساب

### 📝 مدیریت تسک‌ها

- ایجاد، ویرایش و حذف تسک
- وضعیت‌ها (در انتظار، در حال انجام، انجام شده)
- اولویت‌ها (کم، متوسط، زیاد)
- تاریخ سررسید
- جستجو و فیلتر پیشرفته

### 📊 داشبورد

- آمار و نمودارها
- برد تسک‌ها با قابلیت کشیدن و رها کردن
- تقویم
- گزارش‌های تحلیلی

### 👤 پروفایل کاربری

- ویرایش اطلاعات
- تغییر رمز عبور
- حذف حساب کاربری

### 🎨 طراحی

- رابط کاربری زیبا و حرفه‌ای
- تم تاریک/روشن
- کاملاً واکنش‌گرا
- انیمیشن‌های روان

---

## 🛠️ تکنولوژی‌ها

### بک‌اند

| تکنولوژی        | نسخه    | توضیحات            |
| --------------- | ------- | ------------------ |
| **FastAPI**     | 0.115.6 | فریمورک وب پایتون  |
| **SQLAlchemy**  | 2.0.36  | ORM دیتابیس        |
| **PostgreSQL**  | 15      | دیتابیس اصلی       |
| **Alembic**     | 1.14.1  | مدیریت مهاجرت      |
| **python-jose** | 3.3.0   | احراز هویت JWT     |
| **passlib**     | 1.7.4   | هش کردن رمز        |
| **Pydantic**    | 2.6.1   | اعتبارسنجی داده‌ها |
| **Uvicorn**     | 0.34.0  | سرور ASGI          |

### فرانت‌اند

| تکنولوژی         | نسخه     | توضیحات              |
| ---------------- | -------- | -------------------- |
| **Next.js**      | 16.2.9   | فریمورک React        |
| **TypeScript**   | 5.x      | تایپ‌های قوی         |
| **Tailwind CSS** | 4.x      | استایل‌دهی           |
| **Shadcn/ui**    | جدیدترین | کامپوننت‌های UI      |
| **Zustand**      | 5.0.14   | مدیریت وضعیت         |
| **React Query**  | 5.101.1  | مدیریت داده‌های سرور |
| **Recharts**     | 3.9.0    | نمودارها             |
| **Axios**        | 1.18.1   | درخواست‌های HTTP     |

---

## 🚀 اجرا با Docker

### پیش‌نیازها

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### مراحل اجرا

```bash
# 1. کلون کردن پروژه
git clone https://github.com/soheildoos3/task-manager.git
cd task-manager

# 2. کپی فایل‌های محیطی
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 3. ساخت و اجرا با Docker Compose
docker-compose up -d --build

# 4. مشاهده لاگ‌ها
docker-compose logs -f

# 5. توقف سرویس‌ها
docker-compose down
```
