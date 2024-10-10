import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
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
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IpAddress } from "../Context";
import * as ImagePicker from "expo-image-picker";

const logoPath = require("../assets/user.png");

export default function Profile() {
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [user, setUser] = useState(null);
  const [getImage, setImage] = useState(logoPath);

  const [loaded, error] = useFonts({
    PermanentMarker: require("../assets/fonts/PermanentMarker-Regular.ttf"),
    PlayfairDisplay: require("../assets/fonts/PlayfairDisplay-Regular.ttf"),
  });

  const getUser = async () => {
    const storedData = await AsyncStorage.getItem("user");
    if (storedData) {
      const user = JSON.parse(storedData);
      setUser(user);
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setMobile(user.mobile || "");
      if (user.mobile) {
        setImage(`${IpAddress}/AvatarImages/${user.mobile}.png?timestamp=${new Date().getTime()}`);
      } else {
        // Fallback to default image if mobile is not defined
        setImage(logoPath);
      }
    } else {
      router.replace("/");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {}
  };

  const handleUpdateProfile = async () => {
    try {
      let formData = new FormData();
      formData.append("mobile", getMobile);
      formData.append("firstName", getFirstName);
      formData.append("lastName", getLastName);

      if (getImage) {
        formData.append("image", {
          uri: getImage,
          type: "image/png",
          name: "avatar.png",
        });
      }

      const response = await fetch(`${IpAddress}/Profile`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.ok) {
        const jsonResponse = await response.json();

        if (jsonResponse.success) {
          await AsyncStorage.setItem("user", 
            JSON.stringify(jsonResponse.user)
          );
          Alert.alert("Success", "User profile update successfully");
        } else {
          console.error(jsonResponse.message);
        }
      } else {
        console.error("Not working");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#ef776d", "#707070"]}
      style={styles.gradientBackground}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: `${IpAddress}/AvatarImages/${getMobile}.png?timestamp=${new Date().getTime()}` }} // Display the selected or default image
              style={styles.avatar}
              contentFit="cover"
            />

            <View
              style={{
                borderColor: "#464646",
                borderWidth: 2,
                height: 30,
                width: 30,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 15,
                marginTop: 140,
              }}
            >
              <TouchableOpacity onPress={handleImagePicker}>
                <FontAwesome6 name={"pencil"} color={"#464646"} size={18} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.nameText}>
            {getFirstName} {getLastName}
          </Text>
          <Text style={styles.mobileText}>📞 {getMobile}</Text>

          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>First Name</Text>
            <TextInput
              style={styles.inputField}
              value={getFirstName}
              onChangeText={setFirstName}
              editable={true}
            />

            <Text style={styles.infoTitle}>Last Name</Text>
            <TextInput
              style={styles.inputField}
              value={getLastName}
              onChangeText={setLastName}
              editable={true}
            />

            <Text style={styles.infoTitle}>Mobile</Text>
            <TextInput
              style={styles.inputField}
              value={getMobile}
              onChangeText={setMobile}
              keyboardType={"phone-pad"}
              maxLength={10}
              editable={false}
            />
          </View>

          <Pressable style={styles.updateButton} onPress={handleUpdateProfile}>
            <FontAwesome6 name={"file"} color={"#fff"} size={22} />
            <Text style={styles.buttonText}>Update Profile</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  container: {
    width: "90%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 20,
    flex: 1,
    flexDirection: "row",
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#ECF0F1",
    borderColor: "#fff",
    borderWidth: 1,
  },
  nameText: {
    fontSize: 28,
    color: "#34495E",
    marginBottom: 5,
    fontWeight: "bold",
  },
  mobileText: {
    fontSize: 18,
    color: "#7F8C8D",
    marginBottom: 30,
  },
  infoSection: {
    width: "100%",
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    color: "#2C3E50",
    marginBottom: 8,
    fontWeight: "bold",
  },
  inputField: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 20,
    backgroundColor: "#F7F9FA",
    color: "#34495E",
  },
  updateButton: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6afa46",
    flexDirection: "row",
    columnGap: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
