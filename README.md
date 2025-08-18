# Rental Room Finder Web App

A full-stack web application that helps users easily search, compare, and bookmark rental listings. This project leverages Facebook data to streamline the rental search process, especially in areas with high demand like Da Nang, Vietnam.

---

## 🎥 Demo Video
Click onto the thumbnail to watch!
[![Watch the Demo](https://img.youtube.com/vi/NGFTKg_bF8A/maxresdefault.jpg)](https://www.youtube.com/watch?v=NGFTKg_bF8A)

---

## Features

### Post Features
- Display rental listings with link to original Facebook post
- Advanced search with filters (date, location, price, etc.)
- Compare multiple listings side-by-side
- Bookmark favorite listings

### User Management
- Sign up / Log in / Log out
- Update account info (username, email, password)
- Reset password functionality

### Admin Panel
- Dashboard with data visualization (charts)
- Full CRUD for rental posts

---

## Project Objectives
- Analyze Facebook rental posts to understand market needs in Da Nang
- Build a user-friendly platform to support rental information lookup
- Develop a Selenium-based bot to scrape rental data from Facebook
- Automate scraping every 5 hours using GitHub Actions + Railway (See here: https://github.com/Espressol7325/Rental_Listing_Scraper)
- Continuously test and improve the system during development

---

## Tech Stack & Architecture

### Frontend
- ReactJS (deployed via Netlify)

### Backend
- Django + Django REST Framework
- Hosted on AWS EC2 using Docker Compose
- API Gateway for routing requests

### Database
- MySQL on Amazon RDS

### Scraping Tool
- Python + Selenium (Dockerized and deployed with Railway)
- Scheduled via GitHub Actions (runs every 5 hours)

---

## Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/H11R4G10108/Webapp_gradproject.git
cd Webapp_gradproject

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd ../backend
docker-compose up --build
