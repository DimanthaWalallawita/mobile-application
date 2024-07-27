import { ActivityIndicator, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={{ opacity: isLoading ? 0.5 : 1 }}
      disabled={isLoading}
    >
      <LinearGradient
        colors={["#D06F2A", "#943E01"]}
        style={[styles.button, containerStyles]}
      >
        <Text className={`text-black font-psemibold text-lg ${textStyles}`}>
          {title}
        </Text>

        {isLoading && (
          <ActivityIndicator
            animating={isLoading}
            color="#000"
            size="small"
            className="ml-2"
          />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width:375,
    minHeight: 64,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:25,
  },
  text: {
    color: '#000', // Replace with your text color
    fontSize: 18,
    fontWeight: '600', // Equivalent to font-psemibold
  },
  loader: {
    marginLeft: 8,
  },
});

export default CustomButton;
