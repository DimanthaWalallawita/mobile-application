import React, { useState, useEffect, useRef } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraType } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Button from "../../components/Button";
import { images } from "../../constants";

const camera = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);
  const [emotionIndex, setEmotionIndex] = useState(-1);
  const emotions = ['happy', 'sad', 'surprised', 'disgust', 'natural', 'afraid', 'anger', 'unknown'];

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
        setEmotionIndex(prevIndex => (prevIndex + 1) % emotions.length);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const saveImage = async () => {
    if(image){
      try{
        await MediaLibrary.createAssetAsync(image);
        alert('Picture save! 🎉');
        setImage(null);
      } catch(e){
        console.log(e);
      }
    }
  }

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView className="px-4 mb-6 bg-black h-full">
      <Text className="text-2xl text-white font-psemibold my-6">Camera</Text>
      {!image ? (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >

          <View style={{ flexDirection:'row', justifyContent: 'space-between', padding: 30, }}>
            <Button color="#FF9C01" icon={'retweet'} onPress={() => {
              setType(type === CameraType.back ? CameraType.front : CameraType.back)
            }}/>
            <Button icon={'flash'} color={flash === Camera.Constants.FlashMode.off ? 'green' : 'red'} 
              onPress={() => {
                setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
            }}/>
          </View>


        </Camera>
      ) : (
        
        <View style={styles.container2}>
          <Image source={{ uri: image }} style={styles.image} />
          <Image source={images[emotions[emotionIndex]]} style={styles.imageOverlay} />
        </View>
      )}

      <View style={{ padding:15 }}>
        {image ? (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal:50 }}>
            <Button title={"Re-take"} icon="retweet" onPress={() => setImage(null)} color="red"/>
            <Button title={"Save"} icon="check" onPress={saveImage} color="green"/>
          </View>
        ) : (
          <Button
            className="my-6"
            title={"Teke a picture"}
            icon="camera"
            onPress={takePicture}
            color="#FF9C01"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default camera;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 15,
  },

  camera: {
    flex: 1,
    borderRadius: 20,
  },
  container2: {
    height: 550,
    width: '100%', 
    position: 'relative', 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover', 
  },
  imageOverlay: {
    width: '80%', 
    height: '50%', 
    resizeMode: 'contain',
    marginTop:'70%',
    marginLeft: '34%',
  },
});
