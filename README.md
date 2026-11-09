# WatchMe

WatchMe is a cross-platform mobile application for discovering, searching, and keeping track of movies. It is built with React Native and Expo, uses The Movie Database (TMDB) as its source of movie information, and uses Appwrite as a cloud backend for trending searches and saved movies. The app runs on iOS, Android, and the web from a single TypeScript codebase.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screens](#screens)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Appwrite Setup](#appwrite-setup)
- [Available Scripts](#available-scripts)
- [Data and Privacy](#data-and-privacy)
- [Roadmap](#roadmap)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Overview

The goal of WatchMe is to give movie fans a fast, focused way to answer three questions: what is popular right now, where can I find a specific film, and what have I been meaning to watch. The home screen surfaces both the most popular movies on TMDB and the movies that other WatchMe users search for most often. A debounced search screen queries TMDB as you type. Each movie has a detailed page with its rating, runtime, genres, budget, revenue, and production companies, and any movie can be bookmarked to a saved list or marked as a personal favourite. A profile screen brings this together with a name, bio, favourite genres, viewing history, and simple statistics.

## Features

### Discovery
- A "Latest Movies" grid showing the most popular titles on TMDB, sorted by popularity.
- A "Trending Movies" carousel ranking the five movies searched most often by users of the app, with large numbered ranking badges.

### Search
- Live search against the TMDB catalogue as the user types.
- Input is debounced by 500 milliseconds to avoid unnecessary network requests.
- Each successful search is recorded in Appwrite, incrementing a counter for that search term. These counts drive the Trending Movies carousel.
- Clear loading, error, empty, and no-results states.

### Movie Details
- Full-size poster, title, release year, and runtime.
- Average rating out of ten and total vote count.
- Overview, genres, budget, revenue, and production companies.
- A bookmark button to add or remove the movie from the saved list.
- A favourite button to add or remove the movie from the user's profile favourites.
- Opening a movie automatically adds it to the user's recently viewed history.

### Saved Movies
- A dedicated tab listing every bookmarked movie, newest first.
- Saved movies are stored in Appwrite, so the list persists across sessions.
- The list refreshes automatically each time the tab is opened.

### Profile
- Editable display name, a bio of up to 160 characters, and a set of favourite genres chosen from the standard TMDB genre list.
- An avatar generated from the user's initials and a "Member since" date recorded on first launch.
- Statistics for the number of saved, favourite, and recently viewed movies.
- A toggle between a Favourites list and a Recently Viewed list (the twenty most recent movies).
- Settings to clear viewing history or reset the entire profile, each protected by a confirmation dialog.

## Screens

| Screen | Route | Description |
| --- | --- | --- |
| Home | `/(tabs)` | Trending searches and popular movies. |
| Search | `/(tabs)/search` | Live, debounced search of the TMDB catalogue. |
| Saved | `/(tabs)/saved` | Movies the user has bookmarked. |
| Profile | `/(tabs)/profile` | Personal details, favourites, history, and settings. |
| Movie Details | `/movies/[id]` | Full information for a single movie. |

Navigation uses a floating, rounded bottom tab bar for the four main sections and a stack screen for movie details.

## Technology Stack

| Area | Technology |
| --- | --- |
| Framework | [Expo](https://expo.dev) SDK 56 with [React Native](https://reactnative.dev) 0.85 and React 19 |
| Language | TypeScript |
| Navigation | [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing with typed routes) |
| Styling | [NativeWind](https://www.nativewind.dev) 4 (Tailwind CSS for React Native) |
| Movie data | [TMDB API](https://developer.themoviedb.org/docs) |
| Backend | [Appwrite Cloud](https://appwrite.io) via `react-native-appwrite` |
| Local storage | `@react-native-async-storage/async-storage` |
| Visual effects | `@react-native-masked-view/masked-view` for gradient ranking numbers |
| Compiler | React Compiler (enabled through Expo experiments) |

## Architecture

The app is organised into three layers.

1. **Screens** in `src/app` are file-based routes managed by Expo Router. They are responsible for layout and user interaction only.
2. **Components** in `src/components` are reusable presentational pieces such as the movie card, the trending card, and the search bar.
3. **Services** in `services/` contain all data access:
   - `api.ts` communicates with TMDB to discover, search, and fetch movie details.
   - `appwrite.ts` reads and writes search statistics and saved movies in Appwrite.
   - `profile.ts` manages the local user profile, favourites, and viewing history in AsyncStorage.
   - `useFetch.ts` is a small generic React hook that wraps any asynchronous function and exposes `data`, `loading`, `error`, `refetch`, and `reset`.

Data flows in one direction: a screen calls a service, the service returns typed data, and the screen renders it. Shared TypeScript types live in `src/interfaces/interfaces.d.ts`.

## Project Structure

```
.
├── services/
│   ├── api.ts              TMDB requests
│   ├── appwrite.ts         Trending searches and saved movies
│   ├── profile.ts          Local profile, favourites, and history
│   └── useFetch.ts         Generic data-fetching hook
├── src/
│   ├── app/
│   │   ├── _layout.tsx     Root stack navigator
│   │   ├── index.tsx       Redirects to the tab navigator
│   │   ├── globals.css     Tailwind entry point
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx Bottom tab bar
│   │   │   ├── index.tsx   Home
│   │   │   ├── search.tsx  Search
│   │   │   ├── saved.tsx   Saved movies
│   │   │   └── profile.tsx Profile
│   │   └── movies/
│   │       └── [id].tsx    Movie details
│   ├── components/         MovieCard, TrendingCard, SearchBar
│   ├── constants/          Image and icon references
│   ├── interfaces/         Shared TypeScript types
│   └── assets/             Images, icons, and fonts
├── app.json                Expo configuration
├── tailwind.config.js      Theme colours and NativeWind preset
└── package.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (the current LTS release is recommended)
- npm
- A free [TMDB account](https://www.themoviedb.org/signup) and API Read Access Token
- A free [Appwrite Cloud](https://cloud.appwrite.io) project
- One of the following to run the app: the Expo Go app on a physical device, an iOS simulator (macOS with Xcode), or an Android emulator (Android Studio)

### Installation

1. Clone the repository.

   ```bash
   git clone https://github.com/D-Makgothi/Mobile-movie-app-project.git
   cd Mobile-movie-app-project
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and fill in the values described in [Environment Variables](#environment-variables).

4. Create the Appwrite database and collections described in [Appwrite Setup](#appwrite-setup).

5. Start the development server.

   ```bash
   npx expo start
   ```

   From the terminal output you can open the app on an iOS simulator, an Android emulator, a web browser, or a physical device by scanning the QR code with Expo Go.

## Environment Variables

Create a `.env` file in the project root with the following keys. The `.env` file is listed in `.gitignore` and must never be committed.

```
EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_read_access_token
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_search_metrics_collection_id
EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID=your_saved_movies_collection_id
```

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_MOVIE_API_KEY` | TMDB API Read Access Token, sent as a Bearer token. Found under Settings, API in your TMDB account. |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | The ID of your Appwrite Cloud project. |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | The ID of the database that holds both collections. |
| `EXPO_PUBLIC_APPWRITE_COLLECTION_ID` | The collection that stores search counts for the Trending section. |
| `EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID` | The collection that stores bookmarked movies. |

Variables prefixed with `EXPO_PUBLIC_` are embedded in the app bundle at build time, so they should be treated as client-side keys rather than secrets.

## Appwrite Setup

In your Appwrite Cloud project, add a platform for your app, then create one database containing two collections with the attributes below. Grant the `Any` role read, create, update, and delete permissions on both collections (or narrower permissions if you add authentication).

### Search metrics collection

| Attribute | Type | Notes |
| --- | --- | --- |
| `searchTerm` | String | The text the user searched for. |
| `movie_id` | Integer | TMDB ID of the top result. |
| `Title` | String | Title of the top result. |
| `poster_url` | URL or String | Full TMDB poster URL. |
| `count` | Integer | Number of times the term has been searched. |

### Saved movies collection

| Attribute | Type | Notes |
| --- | --- | --- |
| `movie_id` | Integer | TMDB ID of the saved movie. |
| `Title` | String | Movie title. |
| `poster_path` | String | TMDB poster path. |
| `vote_average` | Float | Average rating out of ten. |
| `release_date` | String | Release date in `YYYY-MM-DD` format. |

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the Expo development server. |
| `npm run ios` | Start the server and open the iOS simulator. |
| `npm run android` | Start the server and open the Android emulator. |
| `npm run web` | Start the server and open the app in a web browser. |
| `npm run lint` | Run the Expo ESLint configuration. |

## Data and Privacy

- Movie information and images are requested directly from TMDB.
- Search terms and the top result for each search are stored in Appwrite in aggregate form so that trending movies can be calculated. No user identity is attached to these records.
- Saved movies are stored in Appwrite. The current version does not include user accounts, so the saved list is shared by everyone using the same Appwrite project.
- Profile details, favourites, and viewing history are stored only on the device in AsyncStorage and are never sent to a server. Resetting the profile removes this data.

## Roadmap

Possible future improvements include:

- User authentication so that saved movies are private to each account.
- Syncing profile favourites and history to the cloud.
- Trailers, cast information, and similar movie recommendations on the details page.
- Pagination or infinite scrolling for popular movies and search results.
- Filtering and sorting by genre, year, and rating.

## Acknowledgements

- Movie data and images are provided by [The Movie Database (TMDB)](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.
- Backend services are provided by [Appwrite](https://appwrite.io).
- Built with [Expo](https://expo.dev) and [React Native](https://reactnative.dev).

## License

This project is distributed under the MIT License. See the [LICENSE](LICENSE) file for details.
