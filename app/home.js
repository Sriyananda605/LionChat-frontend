import { FontAwesome6 } from "@expo/vector-icons";
import * as SplashScreen from "expo-splash-screen";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { IpAddress } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

const mainImagePath = require("../assets/lionlogo.png"); // App logo

export default function Home() {
  const [getChatArray, setChatArray] = useState([]);

  const [loaded, error] = useFonts({
    PermanentMarker: require("../assets/fonts/PermanentMarker-Regular.ttf"),
    PlayfairDisplay: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
  });

  const [popupMenuVisible, setPopupMenuVisible] = useState(false);

  const OpenPopupMenuModal = () => {
    setPopupMenuVisible(true);
  };
  const ClosePopupMenuModal = () => {
    setPopupMenuVisible(false);
  };

  async function fetchData() {
    let userJson = await AsyncStorage.getItem("user");

    if (userJson != null) {
      let user = JSON.parse(userJson);

      let response = await fetch(`${IpAddress}/LoadHomeData?id=` + user.id);

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
  }, []);

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

            <TouchableOpacity onPress={OpenPopupMenuModal}>
              <FontAwesome6
                name={"ellipsis"}
                size={24}
                color={"#B0BEC5"}
                style={styleSheet.optionsIcon}
              />
            </TouchableOpacity>

            <Modal
              animationType="fade"
              transparent={true}
              visible={popupMenuVisible}
              onRequestClose={ClosePopupMenuModal}
            >
              <TouchableWithoutFeedback onPress={ClosePopupMenuModal}>
                <View style={styleSheet.menu}>
                  <View style={[styleSheet.menuView]}>
                    <TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          router.push("/search");
                        }}
                      >
                        <Text>Search</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ marginTop: 15 }}
                        onPress={() => {
                          router.push("/profile");
                        }}
                      >
                        <Text>Profile</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ marginTop: 15 }}
                        onPress={() => {
                          AsyncStorage.removeItem("user");
                          router.replace("/");
                        }}
                      >
                        <Text>Log Out</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
          <Text style={styleSheet.text5}>Chat Platform</Text>
        </View>
      </View>

      {/* Scrollable List */}
      <ScrollView style={styleSheet.scrollView1}>
        <View style={{ width: 500, height: 600 }}>
          <FlashList
            ListEmptyComponent={
              <View style={styleSheet.emptyList}>
                <Image source={mainImagePath} style={styleSheet.HomeImage} />
              </View>
            }
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
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text style={styleSheet.text7}>{item.other_user_name}</Text>
                    {item.count > 0 && (
                      <View style={styleSheet.countView}>
                        <Text style={styleSheet.count}>{item.count}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styleSheet.text1} numberOfLines={1}>
                    {item.message}
                  </Text>
                  <View style={styleSheet.view7}>
                    <Text style={styleSheet.text2}>Due: {item.datetime}</Text>
                    <FontAwesome6
                      name={"check-double"}
                      color={item.chat_status_id == 1 ? "blue" : "lightgray"}
                      size={15}
                    />
                  </View>
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

  emptyList: {
    flex: 1,
    height: 300,
    width: 350,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },

  optionsIcon: {
    paddingHorizontal: 90,
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

  HomeImage: {
    width: 300,
    height: 300,
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
    marginTop: 30,
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

  menu: {
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingRight: 50,
    marginTop: 100,
  },
  menuView: {
    width: 120,
    borderRadius: 8,
    paddingVertical: 15,
    borderWidth: 2,
    paddingHorizontal: 30,
    rowGap: 10,
  },
  menuItemText: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "500",
  },

  countView: {
    width: 33,
    paddingVertical: 5,
    backgroundColor: "#0c4eac",
    alignItems: "center",
    borderRadius: 9999,
    marginLeft: 60,
  },
  count: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 18,
  },
});
