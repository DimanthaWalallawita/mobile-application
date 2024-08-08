import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Image, RefreshControl, Text, View } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import { EmptyState, SearchInput, Trending, VideoCard } from "../../components";

const Videos = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  
  return (
    <SafeAreaView className="bg-white">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-10 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-secondary-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-black">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logo}
                  className="w-12 h-11"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-black-100 mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Videos;
