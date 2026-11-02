import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getSavedMovies } from "../../../services/appwrite";
import {
  clearRecentlyViewed,
  GENRES,
  getProfile,
  resetProfile,
  updateProfile,
} from "../../../services/profile";

const BIO_LIMIT = 160;

type ListTab = "favourites" | "recent";

const Stat = ({ label, value }: { label: string; value: number }) => (
  <View className="flex-1 items-center bg-dark-100 rounded-lg py-3">
    <Text className="text-white font-bold text-lg">{value}</Text>
    <Text className="text-light-200 text-xs mt-1">{label}</Text>
  </View>
);

const GenreChip = ({
  genre,
  selected,
  onPress,
}: {
  genre: string;
  selected?: boolean;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    disabled={!onPress}
    onPress={onPress}
    className={`px-3 py-1.5 rounded-full border ${
      selected ? "bg-accent border-accent" : "bg-dark-100 border-dark-100"
    }`}
  >
    <Text
      className={`text-xs font-semibold ${selected ? "text-primary" : "text-light-100"}`}
    >
      {genre}
    </Text>
  </TouchableOpacity>
);

const PosterCard = ({ movie }: { movie: ProfileMovie }) => (
  <Link href={`/movies/${movie.id}`} asChild>
    <TouchableOpacity className="w-28">
      <Image
        source={{
          uri: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : `https://placehold.co/600x400/1a1a1a/ffffff.png`,
        }}
        className="w-28 h-40 rounded-lg"
        resizeMode="cover"
      />
      <Text className="text-white text-xs font-bold mt-2" numberOfLines={1}>
        {movie.title}
      </Text>
      <View className="flex-row items-center gap-x-1 mt-1">
        <Image source={icons.star} className="size-3" />
        <Text className="text-xs text-white font-bold">
          {Math.round(movie.vote_average / 2)}
        </Text>
        <Text className="text-xs text-light-300">
          {movie.release_date?.split("-")[0]}
        </Text>
      </View>
    </TouchableOpacity>
  </Link>
);

const EditProfileModal = ({
  profile,
  visible,
  onClose,
  onSave,
}: {
  profile: Profile;
  visible: boolean;
  onClose: () => void;
  onSave: (changes: Partial<Profile>) => void;
}) => {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [genres, setGenres] = useState(profile.favouriteGenres);

  const toggleGenre = (genre: string) =>
    setGenres((current) =>
      current.includes(genre)
        ? current.filter((g) => g !== genre)
        : [...current, genre],
    );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ScrollView
        className="flex-1 bg-primary"
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-light-200 text-base">Cancel</Text>
          </TouchableOpacity>
          <Text className="text-white font-bold text-lg">Edit Profile</Text>
          <TouchableOpacity
            onPress={() =>
              onSave({
                name: name.trim() || "Movie Fan",
                bio: bio.trim(),
                favouriteGenres: genres,
              })
            }
          >
            <Text className="text-accent font-bold text-base">Save</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-light-200 text-sm mb-2">Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor="#9CA4AB"
          maxLength={40}
          className="bg-dark-100 text-white rounded-lg px-4 py-3 mb-5"
        />

        <Text className="text-light-200 text-sm mb-2">Bio</Text>
        <TextInput
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about your taste in movies..."
          placeholderTextColor="#9CA4AB"
          maxLength={BIO_LIMIT}
          multiline
          textAlignVertical="top"
          className="bg-dark-100 text-white rounded-lg px-4 py-3 min-h-24"
        />
        <Text className="text-light-300 text-xs text-right mt-1 mb-5">
          {bio.length}/{BIO_LIMIT}
        </Text>

        <Text className="text-light-200 text-sm mb-3">Favourite Genres</Text>
        <View className="flex-row flex-wrap gap-2">
          {GENRES.map((genre) => (
            <GenreChip
              key={genre}
              genre={genre}
              selected={genres.includes(genre)}
              onPress={() => toggleGenre(genre)}
            />
          ))}
        </View>
      </ScrollView>
    </Modal>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [savedCount, setSavedCount] = useState(0);
  const [editing, setEditing] = useState(false);
  const [listTab, setListTab] = useState<ListTab>("favourites");

  const loadProfile = async () => {
    setProfile(await getProfile());
    getSavedMovies()
      .then((saved) => setSavedCount(saved.length))
      .catch(() => setSavedCount(0));
  };

  // reload every time the tab is opened so new views/favourites show up
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  if (!profile) return <View className="flex-1 bg-primary" />;

  const saveProfile = async (changes: Partial<Profile>) => {
    setProfile(await updateProfile(changes));
    setEditing(false);
  };

  const confirmClearHistory = () =>
    Alert.alert("Clear history", "Remove all recently viewed movies?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => setProfile(await clearRecentlyViewed()),
      },
    ]);

  const confirmReset = () =>
    Alert.alert(
      "Reset profile",
      "This clears your name, bio, genres, favourites and history.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetProfile();
            loadProfile();
          },
        },
      ],
    );

  const initials = profile.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const memberSince = new Date(profile.joinedAt).toLocaleDateString(
    undefined,
    { month: "long", year: "numeric" },
  );

  const listMovies =
    listTab === "favourites" ? profile.favouriteMovies : profile.recentlyViewed;

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* ---------- Header ---------- */}
        <View className="items-center mt-20">
          <View className="size-24 rounded-full bg-accent items-center justify-center">
            <Text className="text-primary text-3xl font-bold">{initials}</Text>
          </View>
          <Text className="text-white text-2xl font-bold mt-4">
            {profile.name}
          </Text>
          <Text className="text-light-300 text-xs mt-1">
            Member since {memberSince}
          </Text>
          <Text
            className={`text-sm text-center mt-3 px-4 ${
              profile.bio ? "text-light-100" : "text-light-300 italic"
            }`}
          >
            {profile.bio || "No bio yet. Tap Edit Profile to add one."}
          </Text>
          <TouchableOpacity
            onPress={() => setEditing(true)}
            className="mt-4 border border-accent rounded-full px-6 py-2"
          >
            <Text className="text-accent font-semibold">Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ---------- Stats ---------- */}
        <View className="flex-row gap-3 mt-8">
          <Stat label="Saved" value={savedCount} />
          <Stat label="Favourites" value={profile.favouriteMovies.length} />
          <Stat label="Viewed" value={profile.recentlyViewed.length} />
        </View>

        {/* ---------- Favourite genres ---------- */}
        <Text className="text-white text-lg font-bold mt-8 mb-3">
          Favourite Genres
        </Text>
        {profile.favouriteGenres.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {profile.favouriteGenres.map((genre) => (
              <GenreChip key={genre} genre={genre} selected />
            ))}
          </View>
        ) : (
          <Text className="text-light-300 text-sm">
            Pick your favourite genres in Edit Profile.
          </Text>
        )}

        {/* ---------- Favourites / Recently viewed ---------- */}
        <View className="flex-row bg-dark-200 rounded-full p-1 mt-8">
          {(
            [
              ["favourites", "Favourites"],
              ["recent", "Recently Viewed"],
            ] as const
          ).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setListTab(key)}
              className={`flex-1 rounded-full py-2 items-center ${
                listTab === key ? "bg-accent" : ""
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  listTab === key ? "text-primary" : "text-light-200"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          horizontal
          data={listMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PosterCard movie={item} />}
          ItemSeparatorComponent={() => <View className="w-4" />}
          showsHorizontalScrollIndicator={false}
          className="mt-5"
          ListEmptyComponent={
            <Text className="text-light-300 text-sm">
              {listTab === "favourites"
                ? "No favourites yet. Tap the ♡ on any movie to add it."
                : "Movies you open will show up here."}
            </Text>
          }
        />

        {/* ---------- Settings ---------- */}
        <Text className="text-white text-lg font-bold mt-10 mb-3">
          Settings
        </Text>
        <View className="bg-dark-100 rounded-lg">
          <TouchableOpacity
            onPress={confirmClearHistory}
            className="px-4 py-4 border-b border-primary"
          >
            <Text className="text-light-100">Clear viewing history</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmReset} className="px-4 py-4">
            <Text className="text-red-400">Reset profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {editing && (
        <EditProfileModal
          profile={profile}
          visible={editing}
          onClose={() => setEditing(false)}
          onSave={saveProfile}
        />
      )}
    </View>
  );
};

export default Profile;
