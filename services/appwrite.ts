import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID =
  process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        },
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        Title: movie.title,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

// ---------- Saved movies ----------
export const saveMovie = async (movie: MovieDetails) => {
  await database.createDocument(DATABASE_ID, SAVED_COLLECTION_ID, ID.unique(), {
    movie_id: movie.id,
    Title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
  });
};

export const unsaveMovie = async (movieId: number) => {
  const result = await database.listDocuments(
    DATABASE_ID,
    SAVED_COLLECTION_ID,
    [Query.equal("movie_id", movieId)],
  );
  for (const doc of result.documents) {
    await database.deleteDocument(DATABASE_ID, SAVED_COLLECTION_ID, doc.$id);
  }
};

export const isMovieSaved = async (movieId: number) => {
  const result = await database.listDocuments(
    DATABASE_ID,
    SAVED_COLLECTION_ID,
    [Query.equal("movie_id", movieId), Query.limit(1)],
  );
  return result.documents.length > 0;
};

export const getSavedMovies = async () => {
  const result = await database.listDocuments(
    DATABASE_ID,
    SAVED_COLLECTION_ID,
    [Query.orderDesc("$createdAt")],
  );
  return result.documents as unknown as SavedMovie[];
};
