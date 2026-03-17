# Illuminate - Daily Quote Generator

A beautiful daily quote app with push notifications and personal gallery.

## Features

-  **Daily Inspirational Quotes** - Fresh quotes every day
-  **Push Notifications** - Get quotes at your preferred time
-  **Personal Gallery** - Save and manage your favorite quotes
-  **Dark Theme** - Beautiful modern dark interface
-  **Share Functionality** - Share quotes with friends
-  **Local Storage** - Your quotes saved locally


### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Setup
```bash
cd frontend
# Open index.html in browser or use live server
python -m http.server 5500
```

### Environment Configuration
Create `.env` file in backend folder:
```
DATABASE_URL=postgresql://username:password@localhost/dbname
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
```

## Usage

1. **Save Quotes**: Click the bookmark icon to save quotes to your gallery
2. **View Gallery**: Click the book icon to see all saved quotes
3. **Set Notifications**: Click clock icon to schedule daily notifications
4. **Share**: Use share button to spread inspiration

## Tech Stack

- **Backend**: Flask, PostgreSQL, APScheduler, pywebpush
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Notifications**: Web Push Protocol, Service Workers
- **Storage**: LocalStorage for gallery, PostgreSQL for subscriptions

## Design

- **Dark Theme**: Modern gradient backgrounds with glassmorphism
- **Responsive**: Works on all devices
- **Animations**: Smooth transitions and micro-interactions
- **Professional**: Clean, minimalist interface

## API Endpoints

- `GET /api/today-quote` - Get today's quote
- `POST /api/subscribe` - Subscribe for push notifications
- `POST /api/notification-time` - Set notification time

