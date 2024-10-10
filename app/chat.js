import { FontAwesome6 } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { IpAddress } from "../Context";
import { FlashList } from "@shopify/flash-list";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function Chat() {
  const item = useLocalSearchParams();

  const [getChatArray, setChatArray] = useState([]);

  const [getChatText, setChatText] = useState("");

  const [loaded, error] = useFonts({
    PermanentMarker: require("../assets/fonts/PermanentMarker-Regular.ttf"),
    PlayfairDisplay: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
  });

  useEffect(() => {
    // console.log("3");
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  //from chat array from server

  async function fetchChatArray() {
    let userJson = await AsyncStorage.getItem("user");

    if (userJson != null) {
      let user = JSON.parse(userJson);

      let response = await fetch(
        `${IpAddress}/LoadChat?logged_user_id=` +
          user.id +
          `&other_user_id=` +
          item.other_user_id
      );

      if (response.ok) {
        let chatArray = await response.json();
        setChatArray(chatArray);
        // console.log(chatArray);
      }
    } else {
      router.replace("/");
    }
  }

  useEffect(() => {
    fetchChatArray();

    setInterval(() => {
      fetchChatArray();
    }, 5000);
  }, []);

  if (!loaded && !error) {
    // console.log("4");
    return null;
  }

  const logoPath = require("../assets/lionlogo.png");

  return (
    <LinearGradient
      colors={["#ef776d", "#707070"]}
      style={styleSheet.container}
    >
      <StatusBar hidden={true} />

      {/* Header Section */}
      <View style={styleSheet.headerContainer}>
        <View style={styleSheet.profilePicContainer}>
          {item.avatar_image_found == true ? (
            <Image
              source={{
                uri: `${IpAddress}/AvatarImages/${item.other_user_mobile}.png?timestamp=${new Date().getTime()}`,
              }}
              style={styleSheet.profilePic}
              contentFit="contain"
              onError={() => {
                console.log("Image failed to load");
                // Default image or error handling logic can go here
              }}
            />
          ) : (
            <Text style={styleSheet.text1}>
              {item.other_user_avatar_letter}
            </Text>
          )}
        </View>

        <View style={styleSheet.profileInfo}>
          <Text style={styleSheet.profileName}>{item.other_user_name}</Text>
          <Text style={styleSheet.profileStatus}>
            {item.other_user_status == 1 ? "Online" : "Offline"}
          </Text>
        </View>
      </View>

      {/* Messages Section */}
      <ScrollView style={styleSheet.messagesContainer}>
        <View style={{ width: 350, height: 600 }}>
          <FlashList
            data={getChatArray}
            renderItem={({ item }) => (
              <View
                style={
                  item.side == "right"
                    ? styleSheet.messageBubbleRight
                    : styleSheet.messageBubbleLeft
                }
              >
                <Text style={styleSheet.messageText}>{item.message}</Text>
                <View style={styleSheet.messageDetails}>
                  <Text style={styleSheet.messageTime}>{item.datetime}</Text>
                  {item.side == "right" ? (
                    <FontAwesome6
                      name={"check-double"}
                      size={18}
                      color={item.status == 1 ? "blue" : "lightgray"}
                    />
                  ) : null}
                </View>
              </View>
            )}
            estimatedItemSize={200}
          />
        </View>
      </ScrollView>

      {/* Input Section */}
      <View style={styleSheet.inputSection}>
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="#9E9E9E"
          style={styleSheet.inputField}
          value={getChatText}
          onChangeText={(text) => {
            setChatText(text);
          }}
        />
        <Pressable
          style={styleSheet.sendButton}
          onPress={async () => {
            if (getChatText.length == 0) {
              Alert.alert("Error", "Please enter your message");
            } else {
              let userJson = await AsyncStorage.getItem("user");
              let user = JSON.parse(userJson);

              let response = await fetch(
                `${IpAddress}/SendChat?logged_user_id=` +
                  user.id +
                  `&other_user_id=` +
                  item.other_user_id +
                  `&message=` +
                  getChatText
              );

              if (response.ok) {
                let json = await response.json();

                if (json.success) {
                  console.log("Message sent");
                  setChatText("");
                  fetchChatArray();
                }
              }
            }
          }}
        >
          <FontAwesome6 name={"paper-plane"} size={20} color="white" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F2F5FF",
  },

  // Header Section
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    boxShadow: "2px 2px 10px #E0E0E0",
    marginBottom: 20,
    elevation: 5,
  },
  profilePicContainer: {
    width: 70,
    height: 70,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  profilePic: {
    width: 70,
    height: 70,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    paddingLeft: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
  },
  profileStatus: {
    fontSize: 14,
    color: "#1ABC9C",
  },
  optionsIcon: {
    paddingHorizontal: 10,
  },

  // Messages Section
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  messageBubbleRight: {
    alignSelf: "flex-end",
    backgroundColor: "#A2D5F2",
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
    maxWidth: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },

  messageBubbleLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#D6F5C5",
    borderRadius: 30,
    padding: 15,
    marginVertical: 10,
    maxWidth: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  messageText: {
    fontSize: 16,
    color: "#4A4A4A",
  },
  messageDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  messageTime: {
    fontSize: 12,
    color: "#9E9E9E",
  },

  // Input Section
  inputSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 15,
  },
  inputField: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F1F1F1",
    borderRadius: 50,
    marginRight: 10,
    color: "#4A4A4A",
    elevation: 2,
  },
  sendButton: {
    backgroundColor: "#3498db",
    borderRadius: 50,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
});
