PodWay – Lecteur de Podcast Hors-Ligne
PodWay is a mobile podcast playback application designed according to the principles of Object-Oriented Programming on a Component-Based Platform.

The main objective is to allow the user to view, download and listen to podcasts even in offline mode.

Main Features:
  -Online/Offline Mode
  -Podcast Explore
  -Episode Downloads
  -Local Library
  -Audio Player with Mini Player
  -Deletion of Downloaded Episodes
  -Network Connection Detection


Project Architecture
The project is structured into independent modules:
src/

├── components/ → Reusable UI components
├── screens/ → Main interfaces
├── navigation/ → Application navigation
├── context/ → Global state management
├── models/ → Data models (OOP)
├── routes/ → Backend API (Node.js)
├── config/ → Configuration (DB, etc.)
├── constants/ → Global constants
└── data/ → Mocked data


User Flow
The user journey was designed on FigJam and follows this logic:

  -Access the application
  -Check network connection
  -Mode:
    Online → full access (browsing, searching)
    Offline → limited access (local library)
  -Play an episode
  -Automatically return to the playlist after playback


Wireframes
The wireframes were created using Figma with a zoning approach:

Home
Explore
Podcast Page
Library
Player


Database Modeling
Developed using a UML approach (class diagram):

Main Entities:
  Podcast
  Episode
  Download
Relationships:
  A podcast contains multiple episodes.
  An episode can be downloaded.


Technical Stack
Frontend
  React Native (Expo)
Backend
  Node.js (Express)
Database
  MongoDB 
  

Installation & Launch
1. Clone the project
  git clone https://github.com/alphiljunette/podway.git
  cd podway
2. Install the dependencies
  npm install
3. Launch the mobile application
  npx expo start
4. Launch the backend
  node server.js


The podcasts used in the application are defined locally in a mocked data file. The images come from public links on Apple Podcasts (iTunes), while the audio files use open-source resources provided by SoundHelix. This data was manually integrated to simulate a real application without relying on an external API. Each time the user performs a search in Explore, the application retrieves the keyword from the mocked database.
