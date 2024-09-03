import { Picker } from "@react-native-picker/picker";
import { Video } from "expo-av";
import { Redirect, router } from "expo-router";
import React, {
  Component
} from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { images } from "../../constants";
import { camera, CustomButton } from "../../components";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderWidth: 10,
    borderColor: "#39DC07",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#FF851B",
  },
  buttonBreak: {
    borderColor: "#007BFF",
  },
  buttonText: {
    fontSize: 45,
    color: "#39DC07",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
  buttonTextBreak: {
    color: "#007BFF",
  },
  timerText: {
    color: "#000",
    fontSize: 90,
  },
  picker: {
    flex: 1,
    maxWidth: 100,
    ...Platform.select({
      android: {
        color: "#000",
        backgroundColor: "rgba(92, 92, 92, 0.206)",
      },
    }),
  },
  pickerItem: {
    color: "#000",
    fontSize: 20,
    ...Platform.select({
      android: {
        marginLeft: 10,
        marginRight: 10,
      },
    }),
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  overlayVideo: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: "transparent",
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  checkMoodButtonText: {
    fontSize: 30,
    color: "#000",
    top: 60,
    padding:10,
    backgroundColor: "#f0751d",
    borderRadius: 20,
  },
});

const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return {
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds),
  };
};

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while (i < length) {
    arr.push(i.toString());
    i += 1;
  }
  return arr;
};

const AVAILABLE_HOURS = createArray(24); // 24 hours
const AVAILABLE_MINUTES = createArray(60); // 60 minutes
const AVAILABLE_SECONDS = createArray(60); // 60 seconds

const checkMood = () => {
  
};

export default class App extends Component {
  state = {
    remainingSeconds: 5,
    isRunning: false,
    isPaused: false,
    selectedHours: "0",
    selectedMinutes: "0",
    selectedSeconds: "5",
    videoPlaying: false,
  };

  interval = null;

  componentDidUpdate = (prevProp, prevState) => {
    if (this.state.remainingSeconds === 0 && prevState.remainingSeconds !== 0) {
      this.stop();
    }
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  start = () => {
    this.setState((state) => ({
      remainingSeconds:
        parseInt(state.selectedHours, 10) * 3600 +
        parseInt(state.selectedMinutes, 10) * 60 +
        parseInt(state.selectedSeconds, 10),
      isRunning: true,
      videoPlaying: false,
    }));
    this.interval = setInterval(() => {
      this.setState((state) => ({
        remainingSeconds: state.remainingSeconds - 1,
      }));
    }, 1000);
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({
      remainingSeconds: 5,
      isRunning: false,
      videoPlaying: true,
    });
  };

  break = () => {
    if (this.state.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  };

  pause = () => {
    clearInterval(this.interval);
    this.setState({
      isPaused: true,
    });
  };

  resume = () => {
    this.interval = setInterval(() => {
      this.setState((state) => ({
        remainingSeconds: state.remainingSeconds - 1,
      }));
    }, 1000);
    this.setState({
      isPaused: false,
    });
  };

  handleVideoPlaybackStatus = (status) => {
    if (status.didJustFinish) {
      // Video has finished playing
      this.setState({
        videoPlaying: false, // Reset to normal state
      });
    }
  };

  

  renderPickers = () => (
    <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedHours}
        onValueChange={(itemValue) => {
          this.setState({ selectedHours: itemValue });
        }}
        mode="dropDown"
      >
        {AVAILABLE_HOURS.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>hours</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={(itemValue) => {
          this.setState({ selectedMinutes: itemValue });
        }}
        mode="dropDown"
      >
        {AVAILABLE_MINUTES.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedSeconds}
        onValueChange={(itemValue) => {
          this.setState({ selectedSeconds: itemValue });
        }}
        mode="dropDown"
      >
        {AVAILABLE_SECONDS.map((value) => (
          <Picker.Item key={value} label={value} value={value} />
        ))}
      </Picker>
      <Text style={styles.pickerItem}>seconds</Text>
    </View>
  );

  render() {
    const { hours, minutes, seconds } = getRemaining(this.state.remainingSeconds);
    return (
      <View style={styles.container}>
        <Text className="text-4xl font-semibold text-black mb-20 font-psemibold ">
          Let's Study !!
        </Text>
        <StatusBar barStyle="light-content" />
        {this.state.isRunning ? (
          <Text style={styles.timerText}>{`${hours}:${minutes}:${seconds}`}</Text>
        ) : (
          this.renderPickers()
        )}
        {this.state.isRunning && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={this.stop}
              style={[styles.button, styles.buttonStop]}
            >
              <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.break}
              style={[styles.button, styles.buttonBreak]}
            >
              <Text style={[styles.buttonText, styles.buttonTextBreak]}>
                {this.state.isPaused ? "Play" : "Break"}
              </Text>

              
            </TouchableOpacity>
          </View>
        )}
        {!this.state.isRunning && (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
        {!this.state.isRunning && (
          <CustomButton
          title="Ckeck Mood"
          handlePress={() => router.push("/profile")}
          containerStyles="w-full mt-7"
        />
        )}
        {this.state.videoPlaying && (
          <View style={styles.videoContainer}>
            <Video
              source={images.sleepVideo} // Use the local video file
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="cover"
              shouldPlay
              useNativeControls={false} // Hide playback controls
              style={styles.overlayVideo}
              onPlaybackStatusUpdate={this.handleVideoPlaybackStatus} // Handle video playback status
            />
          </View>
        )}
      </View>
    );
  }
}
