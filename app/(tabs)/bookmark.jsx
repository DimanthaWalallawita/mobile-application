import React, { useState, useEffect, useRef, Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Button from "../../components/Button";
import { images } from "../../constants";
import { Picker } from "@react-native-picker/picker";

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
  buttonText: {
    fontSize: 45,
    color: "#39DC07",
  },
  buttonTextStop: {
    color: "#FF851B",
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
});

const formatNumber = (number) => `0${number}`.slice(-2);

const getRemaining = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
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

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

export default class App extends Component {
  state = {
    remainingSeconds: 5,
    isRunning: false,
    selectedMinutes: "0",
    selectedSeconds: "5",
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
        parseInt(state.selectedMinutes, 10) * 60 +
        parseInt(state.selectedSeconds, 30),
      isRunning: true,
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
    });
  };

  renderPickers = () => (
    <View style={styles.pickerContainer}>
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
    const { minutes, seconds } = getRemaining(this.state.remainingSeconds);
    return (
      <View style={styles.container}>

        <Text className="text-4xl font-semibold text-black mb-20 font-psemibold ">
          Let's Study !!
        </Text>
        <StatusBar barStyle="light-content" />
        {this.state.isRunning ? (
          <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
        ) : (
          this.renderPickers()
        )}
        {this.state.isRunning ? (
          <TouchableOpacity
            onPress={this.stop}
            style={[styles.button, styles.buttonStop]}
          >
            <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={this.start} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

// const [hasCameraPermission, setHasCameraPermission] = useState(null);
// const [image, setImage] = useState(null);
// const [type, setType] = useState(Camera.Constants.Type.back);
// const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
// const cameraRef = useRef(null);
// const [emotionIndex, setEmotionIndex] = useState(-1);
// const emotions = ['happy', 'sad', 'surprised', 'disgust', 'natural', 'afraid', 'anger', 'unknown'];

// useEffect(() => {
//   (async () => {
//     MediaLibrary.requestPermissionsAsync();
//     const cameraStatus = await Camera.requestCameraPermissionsAsync();
//     setHasCameraPermission(cameraStatus.status === "granted");
//   })();
// }, []);

// const takePicture = async () => {
//   if (cameraRef) {
//     try {
//       const data = await cameraRef.current.takePictureAsync();
//       console.log(data);
//       setImage(data.uri);
//       setEmotionIndex(prevIndex => (prevIndex + 1) % emotions.length);
//     } catch (e) {
//       console.log(e);
//     }
//   }
// };

// const saveImage = async () => {
//   if(image){
//     try{
//       await MediaLibrary.createAssetAsync(image);
//       alert('Picture save! 🎉');
//       setImage(null);
//     } catch(e){
//       console.log(e);
//     }
//   }
// }

// if (hasCameraPermission === false) {
//   return <Text>No access to camera</Text>;
// }

// return (
//   <SafeAreaView className="px-4 mb-6 bg-primary h-full">
//     <Text className="text-2xl text-white font-psemibold my-6">Camera</Text>
//     {!image ? (
//       <Camera
//         style={styles.camera}
//         type={type}
//         flashMode={flash}
//         ref={cameraRef}
//       >

//         <View style={{ flexDirection:'row', justifyContent: 'space-between', padding: 30, }}>
//           <Button color="#FF9C01" icon={'retweet'} onPress={() => {
//             setType(type === CameraType.back ? CameraType.front : CameraType.back)
//           }}/>
//           <Button icon={'flash'} color={flash === Camera.Constants.FlashMode.off ? 'green' : 'red'}
//             onPress={() => {
//               setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
//           }}/>
//         </View>

//       </Camera>
//     ) : (

//       <View style={styles.container2}>
//         <Image source={{ uri: image }} style={styles.image} />
//         <Image source={images[emotions[emotionIndex]]} style={styles.imageOverlay} />
//       </View>
//     )}

//     <View style={{ padding:15 }}>
//       {image ? (
//         <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal:50 }}>
//           <Button title={"Re-take"} icon="retweet" onPress={() => setImage(null)} color="red"/>
//           <Button title={"Save"} icon="check" onPress={saveImage} color="green"/>
//         </View>
//       ) : (
//         <Button
//           className="my-6"
//           title={"Teke a picture"}
//           icon="camera"
//           onPress={takePicture}
//           color="#FF9C01"
//         />
//       )}
//     </View>
//   </SafeAreaView>
// );
