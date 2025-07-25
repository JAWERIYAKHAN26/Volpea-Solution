# 🌐 Volpea Web App

A simple and interactive web application that:

- Shows your IP address and country (auto-detected via IP)
- Calculates your age based on your date of birth
- Displays fun facts and flags of selected countries
- Requires users to be 18+ to access the app
- Supports light/dark mode toggle
- Includes a reset feature to clear data and start over

---

## 🛠️ Features

### 📍 Geo Location & IP
- Automatically fetches the user's IP address using the ipinfo.io API
- Displays full country name based on IP
- Auto-selects the detected country in the dropdown

### 🎂 Age Calculator
- User inputs day, month, and year of birth
- Calculates and displays the accurate age
- Age prompt appears on page load to restrict underage access

### 🌎 Country Selector
- Users can select from a list of countries:
  - 🇺🇸 USA
  - 🇵🇰 Pakistan
  - 🇮🇳 India
  - 🇩🇪 Germany
  - 🇯🇵 Japan
- Displays the selected country's flag and a unique fun fact using restcountries.com

### 🎨 Dark Mode
- Toggle switch to switch between light and dark mode
- Theme preference is saved using localStorage

### 🔁 Reset Button
- Clears all selections, stored data, and reloads the app for a fresh start

### 🔐 Age Restriction
- The app prompts the user to enter their age on load
- Users under 18 are redirected to a placeholder restricted page (`restricted.html`)

---

## 🧪 APIs Used

- `ipinfo.io` – for fetching user's IP and country code  
- `restcountries.com` – for fetching country flag and facts

---

## 📸 Screenshots

![index.html](screenshot/age%20&%20geolocation%20webpage.png)

---

## 🚀 How to Run

1. Clone the repo or download the files
2. Open `index.html` in a browser
3. Allow age prompt and enjoy!
