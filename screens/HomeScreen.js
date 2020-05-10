import Colors from "../constants/Colors";
import SortButton from "../components/SortButton";
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
  const [sort, setSort] = useState("hot");
  const [data, setData] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch(`${Config.redditURL}${Config.subRedditName}${sort}.json?sort=new`)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [sort]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          style={styles.loading}
          color={Colors.primary}
        />
      ) : (
        <FlatList
          data={data.data.children}
          keyExtractor={({ data }) => data.id}
          style={styles.flatListContainer}
          contentContainerStyle={styles.flatListBottom}
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
                  color={Colors.primary}
                  style={styles.iconStyle}
                />
                <Text style={styles.infoText}>{item.data.ups}</Text>
                <AntDesign
                  name="like1"
                  size={17}
                  color={Colors.primary}
                  style={styles.iconStyle}
                />
                <Text style={styles.infoText}>{item.data.num_comments}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={styles.sortingContainer}>
        <SortButton
          name={"md-bonfire"}
          title={"Hot"}
          onPress={() => setSort("hot")}
        />
        <SortButton
          name={"md-egg"}
          title={"New"}
          onPress={() => setSort("new")}
        />
        <SortButton
          name={"md-arrow-up"}
          title={"Top"}
          onPress={() => setSort("top")}
        />
      </View>
    </View>
  );
}

function handleLinkPress(link) {
  WebBrowser.openBrowserAsync(Config.redditURL + link);
}

const styles = StyleSheet.create({
  loading: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flatListContainer: {
    padding: 8,
  },
  flatListBottom: {
    paddingBottom: 32,
  },
  postContainer: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
    margin: 4,
    padding: 4,
    height: 96,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
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
    backgroundColor: Colors.gray100,
    color: Colors.gray500,
    marginLeft: 4,
    paddingHorizontal: 2,
    fontSize: 14,
  },
  iconStyle: { marginHorizontal: 4 },
  sortingContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    width: "100%",
    bottom: 32,
  },
});
