# Cloud Kitchen 🍲

**Live App:** [https://cloudkitchen247.netlify.app/](https://cloudkitchen247.netlify.app/)  
**Admin Panel:** [https://cloudkitchen247.netlify.app/admin](https://cloudkitchen247.netlify.app/admin)

---

## Overview

**Cloud Kitchen** is a full-featured online food ordering platform built with **React**, **Zustand**, **Firebase**, and **TailwindCSS**.  
It allows users to browse menus, add items to their cart, and place orders. The admin dashboard provides real-time management of categories, items, orders, and subscriptions.

---

## Features

### User
- Browse menu by categories
- Add, remove, and update cart items
- Place orders with real-time updates
- Request subscriptions

### Admin
- Google OAuth authentication (only active admins can log in)
- Manage categories and items (CRUD)
- Real-time orders monitoring and mark orders as done
- Manage subscription requests
- Upload images via Cloudinary with automated error handling
- Toggle availability of categories

---

## Tech Stack

- **Frontend:** React, TailwindCSS, Framer Motion
- **State Management:** Zustand
- **Routing:** React Router
- **Authentication:** Firebase Auth (Google Sign-In)
- **Database:** Firebase Firestore
- **Image Storage:** Cloudinary
- **Notifications:** Sonner (Toast)
- **Utilities:** clsx, date-fns, Swiper, QRCode

---

## Core Features / Stores

### Authentication (`useAuthStore`)
- Google login restricted to active admins
- Check auth status
- Logout
- Error handling for login, logout, and auth checks

### Cart (`useCartStore`)
- Add, remove, or remove completely items from cart
- Get total items & total price

### Inventory (`useInventoryStore`)
- Manage categories and items
- Fetch categories & items
- Bulk update items & category availability
- Add, update, delete items

### Cloudinary (`useCloudinaryStore`)
- Upload & delete images
- Track uploaded images
- Extract public IDs from URLs
- Handles file validation & errors

### Orders (`useOrderStore`)
- Place, delete, and mark orders as done
- Subscribe to orders in real-time
- Compute total order amounts

### Subscriptions (`useSubscriptionStore`)
- Request new subscriptions
- Real-time fetch subscriptions for admin panel
- Delete subscriptions

---

## Installation

1. Clone the repo:
```bash
git clone https://github.com/abhijeetSinghRajput/CloudKitchen.git
cd CloudKitchen/frontend
