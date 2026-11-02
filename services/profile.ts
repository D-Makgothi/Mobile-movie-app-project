import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE_KEY = "profile";
const MAX_RECENTLY_VIEWED = 20;

// TMDB movie genres
export const GENRES = [
  "Action",
  "Adventure",
  "Animation",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "War",
  "Western",
];

const defaultProfile = (): Profile => ({
  name: "Movie Fan",
  bio: "",
  favouriteGenres: [],
  favouriteMovies: [],
  recentlyViewed: [],
  joinedAt: new Date().toISOString(),
});

const toProfileMovie = (movie: MovieDetails): ProfileMovie => ({
  id: movie.id,
  title: movie.title,
  poster_path: movie.poster_path,
  vote_average: movie.vote_average,
  release_date: movie.release_date,
});

export const getProfile = async (): Promise<Profile> => {
  try {
    const stored = await AsyncStorage.getItem(PROFILE_KEY);
    if (stored) return { ...defaultProfile(), ...JSON.parse(stored) };
  } catch (error) {
    console.log(error);
  }
  // first launch: store the default so the join date stays fixed
  const profile = defaultProfile();
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
};

export const updateProfile = async (changes: Partial<Profile>) => {
  const profile = { ...(await getProfile()), ...changes };
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
};

// ---------- Recently viewed ----------
export const addRecentlyViewed = async (movie: MovieDetails) => {
  const { recentlyViewed } = await getProfile();
  const others = recentlyViewed.filter((m) => m.id !== movie.id);
  await updateProfile({
    recentlyViewed: [toProfileMovie(movie), ...others].slice(
      0,
      MAX_RECENTLY_VIEWED,
    ),
  });
};

export const clearRecentlyViewed = () => updateProfile({ recentlyViewed: [] });

// ---------- Favourite movies ----------
export const isFavouriteMovie = async (movieId: number) => {
  const { favouriteMovies } = await getProfile();
  return favouriteMovies.some((m) => m.id === movieId);
};

export const toggleFavouriteMovie = async (movie: MovieDetails) => {
  const { favouriteMovies } = await getProfile();
  const isFavourite = favouriteMovies.some((m) => m.id === movie.id);
  await updateProfile({
    favouriteMovies: isFavourite
      ? favouriteMovies.filter((m) => m.id !== movie.id)
      : [toProfileMovie(movie), ...favouriteMovies],
  });
  return !isFavourite;
};

export const resetProfile = () => AsyncStorage.removeItem(PROFILE_KEY);
