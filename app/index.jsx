import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="h-full">
      <Loader isLoading={loading} />

      <LinearGradient
        colors={['#fff', '#97D5EE']}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            height: "100%",
          }}
        >
          <View className="w-full flex justify-center items-center h-full px-4">
            {/* <Image
              source={images.logo}
              className="w-[130px] h-[84px]"
              resizeMode="contain"
            /> */}

            <Image
              source={images.cards}
              className="max-w-[450px] w-full h-[340px]"
              resizeMode="contain"
            />

            <View className="relative mt-5">
              <Text className="text-4xl text-black font-bold text-center">
                Study{""}
                <Text style={{ color: '#D06F2A' }}>Comrade</Text>
              </Text>

              <Image
                source={images.path}
                className="w-[180px] h-[15px] absolute -bottom-3 -right-8"
                resizeMode="contain"
              />
            </View>

            <Text className="text-sm font-pregular text-black-100 mt-7 text-center">
              StudyComrade: Empowering students with seamless learning and academic support.
            </Text>

            <CustomButton
              title="Continue with Email"
              handlePress={() => router.push("/sign-in")}
              containerStyles="w-full mt-7"
            />
          </View>
        </ScrollView>
      </LinearGradient>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
