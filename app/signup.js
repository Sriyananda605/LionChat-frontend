import { FontAwesome6 } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useEffect, useState } from "react";
import { useFonts } from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import { IpAddress } from "../Context";

SplashScreen.preventAutoHideAsync();

const mainImagePath = require('../assets/lionlogo.png');  // App logo

export default function SignUp() {

  const [getImage, setImage] = useState(null);
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

  const [loaded, error] = useFonts({
    'PermanentMarker': require('../assets/fonts/PermanentMarker-Regular.ttf'),
    'PlayfairDisplay': require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
  });

  useEffect(
    () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    }, [loaded, error]
  );

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={['#ef776d', '#707070']} style={styleSheet.view1}>

      <ScrollView contentContainerStyle={styleSheet.scrollView}>
        <View style={styleSheet.container}>

          <View style={styleSheet.logoContainer}>
            <Image source={mainImagePath} style={styleSheet.image1} contentFit={"cover"} />
          </View>

          <Text style={styleSheet.text1}>Sign Up</Text>
          <Text style={styleSheet.text2}>Explore the future of communication</Text>

          <Pressable style={styleSheet.avatarContainer} title={"Select Image"} onPress={
            async () => {
              let result = await ImagePicker.launchImageLibraryAsync(
                {

                }
              );

              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }
          }>
            <Image source={getImage} style={styleSheet.avatar1} contentFit={"cover"} />
            <Text style={styleSheet.avatarText}>Upload Profile</Text>
          </Pressable>

          <Text style={styleSheet.text3}>Mobile</Text>
          <TextInput
            style={styleSheet.input1}
            placeholder="Enter mobile number"
            placeholderTextColor={"#7F8C8D"}
            inputMode={"tel"}
            maxLength={10}
            onChangeText={
              (text) => {
                setMobile(text);
              }
            }
          />

          <Text style={styleSheet.text3}>First Name</Text>
          <TextInput
            style={styleSheet.input1}
            placeholder="Enter first name"
            placeholderTextColor={"#7F8C8D"}
            inputMode={"text"}
            onChangeText={
              (text) => {
                setFirstName(text);
              }
            }
          />

          <Text style={styleSheet.text3}>Last Name</Text>
          <TextInput
            style={styleSheet.input1}
            placeholder="Enter last name"
            placeholderTextColor={"#7F8C8D"}
            inputMode={"text"}
            onChangeText={
              (text) => {
                setLastName(text);
              }
            }
          />

          <Text style={styleSheet.text3}>Password</Text>
          <TextInput
            style={styleSheet.input1}
            placeholder="Enter password"
            placeholderTextColor={"#7F8C8D"}
            secureTextEntry={true}
            inputMode={"text"}
            onChangeText={
              (text) => {
                setPassword(text);
              }
            }
          />

          <Pressable style={styleSheet.createAccountButton} onPress={
            async () => {

              let formData = new FormData();
              formData.append("mobile", getMobile);
              formData.append("firstName", getFirstName);
              formData.append("lastName", getLastName);
              formData.append("password", getPassword);

              if (getImage != null) {
                formData.append("avatarImage",
                  {
                    name: "avatar.png",
                    type: "image/png",
                    uri: getImage,
                  }
                );
              }

              let response = await fetch(
                `${IpAddress}/SignUp`,
                {
                  method: "POST",
                  body: formData
                }
              );

              if (response.ok) {
                let json = await response.json();

                if (json.Success) {

                  router.replace("/");

                } else {
                  Alert.alert("Error", json.message);
                }
              }
            }
          }>
            <FontAwesome6 name={"check-circle"} color={"#1ABC9C"} size={22} />
            <Text style={styleSheet.text4}>Create Account</Text>
          </Pressable>

          <Pressable style={styleSheet.signInLink} onPress={
            () => {
              router.replace("/");
            }
          }>
            <Text style={styleSheet.text5}>Already have an account? Sign In</Text>
          </Pressable>

        </View>
      </ScrollView>

    </LinearGradient>
  );
}

const styleSheet = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: "center",
  },

  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "85%",
    padding: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 25,
    elevation: 10,
    alignItems: 'center',
  },

  logoContainer: {
    marginBottom: 40,
  },

  image1: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },

  text1: {
    fontSize: 30,
    fontFamily: "PermanentMarker",
    color: "#34495E",
    marginBottom: 10,
    textAlign: "center",
  },

  text2: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    marginBottom: 40,
  },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },

  avatar1: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#BDC3C7",
    alignSelf: "center",
    marginBottom: 10,
  },

  avatarText: {
    color: "#7F8C8D",
    fontSize: 16,
    borderColor: "lightblue",
    borderWidth: 2,
    borderRadius: 10,
  },

  text3: {
    fontSize: 16,
    color: "#2C3E50",
    alignSelf: "flex-start",
    marginBottom: 5,
    fontFamily: "PlayfairDisplay",
  },

  input1: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    backgroundColor: "#ECF0F1",
    color: "#34495E",
    fontFamily: "PlayfairDisplay",
  },

  createAccountButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#34495E",
    flexDirection: "row",
    columnGap: 10,
    marginTop: 20,
  },

  text4: {
    fontSize: 18,
    color: "#1ABC9C",
    fontWeight: "bold",
  },

  signInLink: {
    marginTop: 20,
  },

  text5: {
    fontSize: 14,
    color: "#2C3E50",
  }
});