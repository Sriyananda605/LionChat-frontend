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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { IpAddress } from "../Context";
import Checkbox from "expo-checkbox";

SplashScreen.preventAutoHideAsync();

const logoImage = require("../assets/lionlogo.png"); // App logo instead of profile image

export default function Index() {
  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getName, setName] = useState("");
  const [isChecked, setChecked] = useState(false);

  const [loaded, error] = useFonts({
    PermanentMarker: require("../assets/fonts/PermanentMarker-Regular.ttf"),
    PlayfairDisplay: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
  });

  useEffect(() => {
    checkRemember();
  }, []);

  const checkRemember = async () => {
    const storedData = await AsyncStorage.getItem("remember-me");
    if (storedData !== null) {
      const userData = JSON.parse(storedData);
      setMobile(userData.mobile);
      setPassword(userData.password);
    }
  };

  useEffect(() => {
    async function CheckUserInAsyncStorage() {
      try {
        let userJson = await AsyncStorage.getItem("user");

        if (userJson != null) {
          router.replace("/home");
        }
      } catch (error) {
        console.log(e);
      }
    }
    CheckUserInAsyncStorage();
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
    <LinearGradient
      colors={["#ef776d", "#707070"]}
      style={styles.gradientBackground}
    >
      <StatusBar hidden={false} />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          {/* App Logo */}
          <View style={styles.logoContainer}>
            <Image source={logoImage} style={styles.logoImage} />
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Login</Text>
          <Text style={styles.subHeading}>
            Enter your details to access your account
          </Text>

          <View style={styles.avatar1}>
            <Text style={styles.text6}>{getName}</Text>
          </View>

          {/* Input Fields */}
          <TextInput
            style={styles.inputField}
            placeholder="Mobile Number"
            placeholderTextColor="#A3A3A3"
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(text) => {
              setMobile(text);
            }}
            onEndEditing={async () => {
              if (getMobile.length == 10) {
                let response = await fetch(
                  `${IpAddress}/GetLetters?mobile=` + getMobile
                );

                if (response.ok) {
                  let json = await response.json();
                  setName(json.letters);
                }
              }
            }}
          />

          <TextInput
            style={styles.inputField}
            placeholder="Password"
            placeholderTextColor="#A3A3A3"
            secureTextEntry={true}
            inputMode={"text"}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />

          <View style={styles.section}>
            <Checkbox
              style={styles.checkbox}
              value={isChecked}
              onValueChange={setChecked}
              color={isChecked ? "#4630EB" : undefined}
            />
            <Text style={styles.paragraph}>Remember me</Text>
          </View>

          {/* Buttons */}
          <Pressable
            style={styles.loginButton}
            onPress={async () => {
              let response = await fetch(`${IpAddress}/SignIn`, {
                method: "POST",
                body: JSON.stringify({
                  mobile: getMobile,
                  password: getPassword,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (response.ok) {
                let json = await response.json();

                if (json.Success) {
                  //user sign in success
                  let user = json.user;

                  if (isChecked) {
                    const rememberObject = {
                      mobile: getMobile,
                      password: getPassword,
                    };

                    AsyncStorage.setItem(
                      "remember-me",
                      JSON.stringify(rememberObject)
                    );
                  } else {
                    AsyncStorage.removeItem("remember-me");
                  }

                  try {
                    // console.log(user);
                    await AsyncStorage.setItem(
                      "user",
                      JSON.stringify(json.user)
                    );
                    router.replace("/home");
                  } catch (e) {
                    console.log;
                  }
                } else {
                  //problem occured
                  Alert.alert("Error", json.message);
                }
              }
            }}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </Pressable>

          <Pressable
            style={styles.signupButton}
            onPress={() => {
              router.replace("/signup");
            }}
          >
            <Text style={styles.signupText}>Create an account</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: "center",
  },

  scrollView: {
    paddingHorizontal: 20,
    paddingVertical: 60,
    alignItems: "center",
  },

  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },

  logoContainer: {
    marginBottom: 40,
  },

  logoImage: {
    width: 80,
    height: 80,
  },

  heading: {
    fontSize: 28,
    fontFamily: "PermanentMarker",
    color: "#1A1A1A",
    marginBottom: 10,
    textAlign: "center",
  },

  subHeading: {
    fontSize: 16,
    fontFamily: "PlayfairDisplay",
    color: "#6F6F6F",
    marginBottom: 30,
    textAlign: "center",
  },

  inputField: {
    width: "100%",
    height: 50,
    borderRadius: 15,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: "PlayfairDisplay",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E90FF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "PermanentMarker",
  },

  signupButton: {
    marginTop: 20,
  },

  signupText: {
    color: "#1E90FF",
    fontSize: 16,
    fontFamily: "PermanentMarker",
  },

  avatar1: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "white",
    alignSelf: "center",
    justifyContent: "center",
  },

  text6: {
    fontSize: 30,
    fontFamily: "PlayfairDisplay",
    fontWeight: "bold",
    alignSelf: "center",
  },

  section: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
