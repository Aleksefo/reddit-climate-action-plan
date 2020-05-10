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
import { FontAwesome5, AntDesign } from "@expo/vector-icons";

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
        <ActivityIndicator />
      ) : (
        <FlatList
          data={data.data.children}
          style={{ margin: 4 }}
          keyExtractor={({ data }) => data.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.data.id}
              onPress={() => handleLinkPress(item.data.permalink)}
              style={{
                borderWidth: 1,
                borderRadius: 4,
                borderColor: "#c5c5c5",
                backgroundColor: "#f5f5f5",
                margin: 4,
                padding: 4,
                height: 96,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
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
                  style={{ width: 50, height: 50 }}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Text style={styles.infoText}>By {item.data.author}</Text>
                  {item.data.author_flair_text && (
                    <Text style={styles.flairText}>
                      {item.data.author_flair_text}
                    </Text>
                  )}
                </View>
                <FontAwesome5
                  name="hotjar"
                  size={14}
                  color="green"
                  style={{ marginHorizontal: 4 }}
                />
                <Text style={styles.infoText}>{item.data.ups}</Text>
                <AntDesign
                  name="like1"
                  size={14}
                  color="green"
                  style={{ marginHorizontal: 4 }}
                />
                <Text style={styles.infoText}>{item.data.num_comments}</Text>
              </View>
              {/*<Text>{item.data.created}</Text>*/}
              {/*<Text>{item.data.created}</Text>*/}
              {/*<Text>{item.data.permalink}</Text>*/}
              {/*<Text style={styles.codeHighlightText}>{item.data.link_flair_text}</Text>*/}
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
  tabBarInfoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: "center",
    backgroundColor: "#fbfbfb",
    paddingVertical: 1,
  },
  titleText: {
    fontSize: 18,
    // lineHeight: 22,
  },
  infoText: {
    fontSize: 14,
  },
  flairText: {
    backgroundColor: "#d2d2d2",
    marginLeft: 4,
    paddingHorizontal: 2,
    fontSize: 14,
    // lineHeight: 22,
  },
});
