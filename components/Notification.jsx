// Notification.jsx
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import { Button, Platform, View } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Notification = ({ onRegister, onNotification }) => {
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => onRegister(token));
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  }

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Time to Feed Your Pet! 🐶",
        body: "It's time to feed your furry friend!",
        data: { data: "goes here" },
      },
      trigger: { seconds: 2 }, // Adjust according to actual needs
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Press to schedule a feeding reminder"
        onPress={schedulePushNotification}
      />
    </View>
  );
};

export default Notification;
