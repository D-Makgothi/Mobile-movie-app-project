import { icons } from "@/constants/icons";
import { Image, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  placeholder?: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

export const SearchBar = ({
  placeholder,
  onPress,
  value,
  onChangeText,
}: SearchBarProps) => {
  const inner = (
    <View className="flex-row items-center bg-dark-200 rounded-full px-5 py-4">
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor="#ab8bff"
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A8B5DB"
        className="flex-1 ml-2 text-white"
      />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {inner}
      </TouchableOpacity>
    );
  }

  return inner;
};

export default SearchBar;
