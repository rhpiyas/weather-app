# 🌤️ Amar Weather

A responsive weather application that detects the user's current location and displays current weather information, rain probability, hourly rain forecasts, and weather advice.

## 🔗 Live Website

[Visit Amar Weather](https://amarweather.vercel.app/)

## ✨ Features

- Detects the user's current location using the Geolocation API
- Displays the current temperature in Celsius
- Shows the current date, time, and timezone
- Displays the user's city or location name
- Shows the current rain probability
- Provides weather advice based on rain probability
- Displays rain probability for the next 24 hours
- Responsive design for desktop, tablet, and mobile devices
- Weather-themed background image
- Favicon and Apple touch icon support
- Social media links in the footer
- Error handling for denied location access and API failures

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript ES6
- Fetch API
- Geolocation API
- Open-Meteo API
- OpenStreetMap Nominatim API
- Bootstrap Icons

## 🌐 APIs Used

### Open-Meteo API

Used to retrieve current weather data and hourly precipitation probability.

[Open-Meteo API](https://open-meteo.com/)

### OpenStreetMap Nominatim API

Used to convert the user's latitude and longitude into a readable city or location name.

[Nominatim API](https://nominatim.openstreetmap.org/)

## 📂 Project Structure

```text
weather-app/
├── assets/
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── dhaka.webp
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── favicon.ico
├── index.html
├── index.js
├── style.css
└── README.md
```

## 🚀 Deployment

This project is deployed on Vercel.

### Live Domain

```text
https://amarweather.vercel.app/
```

To deploy your own version:

1. Fork or clone this repository.
2. Import the repository into [Vercel](https://vercel.com/).
3. Select the project root directory.
4. Deploy the project as a static site.

No local development server or build command is required for this project.

## 📍 Location Permission

The application requires location permission to retrieve weather information for the user's current location.

If location access is denied, the application displays a location unavailable message.

## 📚 What I Learned

- Working with external REST APIs
- Using the Fetch API with `async` and `await`
- Handling JSON responses
- Using the browser Geolocation API
- Performing reverse geocoding
- Updating HTML content dynamically
- Creating hourly forecast cards with JavaScript
- Handling API and location errors
- Building a responsive user interface with CSS

## 👨‍💻 Author

**Rakib Hasan Piyas**

- GitHub: [@rhpiyas](https://github.com/rhpiyas)
- Portfolio: [rhpiyas.vercel.app](https://rhpiyas.vercel.app/)
- Instagram: [@rhpiyas](https://www.instagram.com/rhpiyas/)
- LinkedIn: [Rakib Hasan Piyas](https://www.linkedin.com/in/rhpiyas/)

## 📄 License

This project is open source and available for learning and personal use.

---

⭐ If you like this project, consider giving it a star!
