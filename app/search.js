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
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IpAddress } from "../Context";
import { FlashList } from "@shopify/flash-list";

SplashScreen.preventAutoHideAsync();

const mainImagePath = require("../assets/lionlogo.png"); // App logo

export default function Search() {
  const [getChatArray, setChatArray] = useState([]);
  const [getSearchText, setSearchText] = useState("");

  const [loaded, error] = useFonts({
    PermanentMarker: require("../assets/fonts/PermanentMarker-Regular.ttf"),
    PlayfairDisplay: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
  });

  async function fetchData() {
    let userJson = await AsyncStorage.getItem("user");

    if (userJson != null) {
      let user = JSON.parse(userJson);

      let response = await fetch(
        `${IpAddress}/LoadHome?id=` + user.id + `&searchText=` + getSearchText
      );

      if (response.ok) {
        let json = await response.json();

        if (json.success) {
          let chatArray = json.jsonChatArray;
          setChatArray(chatArray);
          console.log(chatArray);
        }
      }
    } else {
      router.replace("/");
    }
  }

  useEffect(() => {
    fetchData();
  }, [getSearchText]);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={["#ef776d", "#707070"]} style={styleSheet.view1}>
      <StatusBar hidden={true} />

      {/* Profile Section */}
      <View style={styleSheet.profileCard}>
        <Image source={mainImagePath} style={styleSheet.profileImage} />
        <View>
          <View style={styleSheet.view7}>
            <Text style={styleSheet.text4}>Lion Chat</Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/home");
              }}
            >
              <FontAwesome6
                name={"arrow-left"}
                size={24}
                color={"#B0BEC5"}
                style={styleSheet.optionsIcon}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            style={styleSheet.input1}
            placeholder="Search User..."
            placeholderTextColor={"#7F8C8D"}
            value={getSearchText}
            inputMode={"search"}
            onChangeText={(e) => {
              setSearchText(e);
            }}
          />
        </View>
      </View>

      {/* Scrollable List */}
      <ScrollView style={styleSheet.scrollView1}>
        <View style={{ width: 500, height: 600 }}>
          <FlashList
            data={getChatArray}
            renderItem={({ item }) => (
              <Pressable
                style={styleSheet.itemCard}
                onPress={() => {
                  router.push({
                    pathname: "/chat",
                    params: item,
                  });
                }}
              >
                <View
                  style={
                    item.other_user_status == 1
                      ? styleSheet.view6_2
                      : styleSheet.view6_1
                  }
                >
                  {item.avatar_image_found ? (
                    <Image
                      source={
                        `${IpAddress}/AvatarImages/` +
                        item.other_user_mobile +
                        `.png?timestamp=${new Date().getTime()}`
                      }
                      contentFit="contain"
                      style={styleSheet.image1}
                    />
                  ) : (
                    <Text style={styleSheet.text6}>
                      {item.other_user_avatar_letter}
                    </Text>
                  )}
                </View>

                <View>
                  <Text style={styleSheet.text7}>{item.other_user_name}</Text>
                  <Text style={styleSheet.text1} numberOfLines={1}>
                    Let's start new conbercation
                  </Text>
                </View>
              </Pressable>
            )}
            estimatedItemSize={200}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styleSheet = StyleSheet.create({
  view1: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: "#E6F7FF",
  },

  optionsIcon: {
    paddingHorizontal: 110,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },

  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 20,
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  // iconContainer: {
  //   backgroundColor: '#BCE6FF',
  //   borderRadius: 10,
  //   padding: 10,
  //   marginRight: 15,
  // },

  view6_1: {
    width: 70,
    height: 70,
    backgroundColor: "#BCE6FF",
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: "lightgray",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginRight: 15,
  },

  view6_2: {
    width: 70,
    height: 70,
    backgroundColor: "#BCE6FF",
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 3,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginRight: 15,
  },

  text1: {
    fontSize: 13,
    color: "#023246",
  },

  text2: {
    fontSize: 10,
    fontFamily: "PlayfairDisplay",
    color: "#023246",
    alignSelf: "flex-end",
    marginLeft: 100,
  },

  text4: {
    fontSize: 20,
    fontFamily: "PermanentMarker",
    color: "#023246",
    marginLeft: 2,
  },

  text5: {
    fontSize: 16,
    fontFamily: "PlayfairDisplay",
    color: "#023246",
    marginTop: 5,
  },

  text6: {
    fontSize: 28,
    color: "white",
  },

  text7: {
    fontSize: 18,
    fontFamily: "PlayfairDisplay",
    color: "#023246",
  },

  scrollView1: {
    marginTop: 20,
  },

  view7: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-end",
  },

  image1: {
    width: 70,
    height: 70,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  input1: {
    width: "60%",
    height: 28,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    paddingLeft: 15,
    marginTop: 5,
    backgroundColor: "#ECF0F1",
    color: "#34495E",
    fontFamily: "PlayfairDisplay",
  },
});
