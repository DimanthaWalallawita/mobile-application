import { Video } from "expo-av";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { images } from "../../constants";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

const Home = () => {
  const { height } = Dimensions.get("window");
  const video = React.useRef(null);
  const secondaryVideo = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [statusSecondaryVideo, setStatusSecondaryVideo] = React.useState({});
  const { data: posts, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const [videoSource, setVideoSource] = useState(images.copy);
  const [playCount, setPlayCount] = useState(0);

  useEffect(() => {
    (async () => {
      if (video.current) {
        await video.current.playAsync();
      }
    })();
  }, []);

  const handleImageClick = (image) => {
    switch (image) {
      case images.sleep:
        setVideoSource(images.sleepVideo);
        break;
      case images.play:
        setVideoSource(images.playingG);
        break;
      case images.eat:
        setVideoSource(images.eating);
        break;
      default:
        break;
    }
  };

  const handlePlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.didJustFinish) {
      setPlayCount(playCount + 1);
      if (playCount >= 2) {
        setPlayCount(0);
        setVideoSource(images.copy);
      }
    }
    setStatus(playbackStatus);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // one flatlist
  // with list header
  // and horizontal flatlist

  //  we cannot do that with just scrollview as there's both horizontal and vertical scroll (two flat lists, within trending)

  return (
    <View style={styles.container}>
      {/* <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => handleImageClick(images.sleep)}>
          <Image source={images.sleep} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleImageClick(images.eat)}>
          <Image source={images.eat} style={styles.image} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleImageClick(images.play)}>
          <Image source={images.play} style={styles.image} />
        </TouchableOpacity>
      </View> */}

      <View style={styles.videoContainer}>
        <Video
          ref={video}
          style={{ width: "1500%", height: height }}
          source={videoSource}
          useNativeControls={false}
          resizeMode="contain"
          isLooping={true}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        ></Video>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  videoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    bottom: -7,
    width: 85,
    height: 110,
  },

  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    position: "absolute",
    top: 60, // Position at the top of the screen
    left: 0,
    right: 0,
    zIndex: 1,
  },
  image: {
    width: 80,
    height: 80,
  },
});
