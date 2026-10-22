import { icons } from "@/constants/icons";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Movie {
  id: number | string;
  poster_path: string | null;
  title: string;
  vote_average: number;
  release_date: string;
}

const MovieCard = ({
  id,
  poster_path,
  title,
  vote_average,
  release_date,
}: Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
      <TouchableOpacity className="w-[30%]">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : `https://placehold.co/600x400/1a1a1a/ffffff.png`,
          }}
          className="w-full h-52 rounded-lg"
          resizeMode="cover"
        />

        <View className="mt-2">
          {/* 1. Closed the Text tag immediately after the title */}
          <Text className="text-white text-sm font-bold mt-1" numberOfLines={1}>
            {title}
          </Text>

          {/* 2. Moved the metadata View below the title as a sibling */}
          <View className="flex-row items-center justify-start gap-x-1 mt-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-xs text-white font-bold uppercase">
              {Math.round(vote_average / 2)}
            </Text>

            <Text className="text-xs text-light-300 font-medium">
              {release_date?.split("-")[0]}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

export default MovieCard;
