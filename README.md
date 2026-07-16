# 🌍 Wanderlust — Airbnb Clone

> A full-stack vacation rental platform where users can discover, list, and book unique stays around the world.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

## 🚀 Live Demo

🔗 [View Live Project](https://wanderlust-airbnb-clone-nu6j.onrender.com/)

---

## 📸 Screenshots

> _(Add screenshots of your home page, listing detail, booking page, etc.)_

---

## ✨ Features

### 🔐 Authentication
- Secure user registration and login using **Passport.js** (Local Strategy)
- Session-based authentication with persistent login
- Protected routes — only logged-in users can create listings or make bookings

### 🏠 Listings
- Browse all available property listings on the home page
- **Create** new listings with title, description, price, location, and images
- **Edit** or **Delete** your own listings (authorization enforced)
- Upload listing images via **Cloudinary**

### 📅 Booking System
- Book any listing for your desired dates
- View all your upcoming and past bookings on the **My Bookings** page
- Booking data stored securely in MongoDB

### ⭐ Reviews & Ratings
- Leave a review and star rating on any listing
- Delete your own reviews
- Average rating displayed on each listing

### 🗺️ Map Integration
- Interactive map on each listing detail page
- Location auto-geocoded and displayed using **Mapbox / Leaflet**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Templating** | EJS, EJS-Mate |
| **Authentication** | Passport.js (Local Strategy) |
| **Image Upload** | Cloudinary, Multer |
| **Maps** | Mapbox GL JS / Leaflet |
| **Validation** | Joi |
| **Styling** | Bootstrap 5, Custom CSS |
| **Session** | express-session, connect-mongo |

---

## 📁 Project Structure

```
MajorProject/
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   ├── users.js
│   └── booking.js
├── models/
│   ├── listing.js
│   ├── review.js
│   ├── user.js
│   └── booking.js
├── routes/
│   ├── listing.js
│   ├── review.js
│   ├── user.js
│   └── booking.js
├── views/
│   ├── listings/
│   ├── bookings/
│   │   └── my-bookings.ejs
│   ├── users/
│   └── layouts/
├── public/
│   ├── css/
│   └── js/
├── middleware.js
├── schema.js
├── cloudConfig.js
├── app.js
└── .env
```

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Cloudinary](https://cloudinary.com/) account
- [Mapbox](https://www.mapbox.com/) API key (if using Mapbox)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/krushna9923/Wanderlust-Airbnb-Clone.git
cd Wanderlust-Airbnb-Clone

# 2. Install dependencies
npm install

# 3. Create a .env file in the root directory
touch .env
```

### Environment Variables

Create a `.env` file and add the following:

```env
ATLASDB_URL=your_mongodb_atlas_connection_string
SECRET=your_session_secret_key

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_token
```

### Run the App

```bash
node app.js
# or with nodemon
nodemon app.js
```

Visit `http://localhost:8080` in your browser.

---

## 🔒 Security

- `.env` file is excluded from version control via `.gitignore`
- Passwords hashed using **passport-local-mongoose**
- Authorization checks ensure users can only modify their own listings/reviews/bookings
- Input validated server-side using **Joi**

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

```bash
# Fork the repo, create your branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a Pull Request
git push origin feature/your-feature-name
```

---

## 👨‍💻 Author

**Krushna**
- GitHub: [@krushna9923](https://github.com/krushna9923)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">Made with ❤️ as a full-stack major project</p>
