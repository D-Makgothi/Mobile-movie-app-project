import MovieCard from "@/components/MovieCard";
import { images } from "@/constants/images";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { getSavedMovies } from "../../../services/appwrite";
import useFetch from "../../../services/useFetch";

const Saved = () => {
  const { data: savedMovies, loading, refetch } = useFetch(getSavedMovies);

  // reload the list every time this tab is opened
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <FlatList
        data={savedMovies}
        keyExtractor={(item) => item.$id}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 20,
          marginBottom: 10,
        }}
        className="px-5"
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <MovieCard
            {...({ ...item, id: item.movie_id, title: item.Title } as unknown as Movie)}
          />
        )}
        ListHeaderComponent={
          <Text className="text-xl text-white font-bold mt-20 mb-5">
            Saved Movies
          </Text>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
          ) : (
            <Text className="text-light-200 text-center mt-10">
              No saved movies yet. Tap the bookmark on any movie to save it.
            </Text>
          )
        }
      />
    </View>
  );
};

export default Saved;
