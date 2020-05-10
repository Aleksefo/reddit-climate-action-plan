import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Config from "../constants/Config";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

export default function HomeScreen() {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${Config.redditURL}${Config.subRedditName}new.json?sort=new`)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={data.data.children}
          keyExtractor={({ data }) => data.id}
          style={styles.flatListContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.data.id}
              onPress={() => handleLinkPress(item.data.permalink)}
              style={styles.postContainer}
            >
              <View style={styles.titleContainer}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Text
                    style={styles.titleText}
                    numberOfLines={3}
                    ellipsizeMode="tail"
                  >
                    {item.data.link_flair_text && (
                      <Text style={styles.flairText}>
                        {` ${item.data.link_flair_text} `}
                      </Text>
                    )}
                    {item.data.title}
                  </Text>
                </View>

                <Image
                  source={{ uri: item.data.thumbnail }}
                  style={styles.imageStyle}
                />
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoText}>By {item.data.author}</Text>
                  {item.data.author_flair_text && (
                    <Text style={styles.flairText}>
                      {item.data.author_flair_text}
                    </Text>
                  )}
                </View>
                <FontAwesome
                  name="comment"
                  size={16}
                  color="green"
                  style={styles.iconStyle}
                />
                <Text style={styles.infoText}>{item.data.ups}</Text>
                <AntDesign
                  name="like1"
                  size={17}
                  color="green"
                  style={styles.iconStyle}
                />
                <Text style={styles.infoText}>{item.data.num_comments}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.tabBarInfoContainer} />
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function handleLinkPress(link) {
  WebBrowser.openBrowserAsync(Config.redditURL + link);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e1f5e1",
  },
  flatListContainer: {
    padding: 8,
    marginBottom: 0,
  },
  postContainer: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#c5c5c5",
    backgroundColor: "#f5f5f5",
    margin: 4,
    padding: 4,
    height: 96,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        padding: 1,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
  },
  titleContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 18,
  },
  imageStyle: { width: 50, height: 50 },
  infoText: {
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  flairText: {
    backgroundColor: "#e3e3e3",
    color: "#838688",
    marginLeft: 4,
    paddingHorizontal: 2,
    fontSize: 14,
  },
  iconStyle: { marginHorizontal: 4 },
});
