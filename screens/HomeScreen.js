import Colors from "../constants/Colors";
import SortButton from "../components/SortButton";
import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  Image,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import Config from "../constants/Config";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

const HEADER_EXPANDED_HEIGHT = 100;
const HEADER_COLLAPSED_HEIGHT = 0;

export default function HomeScreen() {
  const [isLoading, setLoading] = useState(true);
  const [sort, setSort] = useState("hot");
  const [data, setData] = useState([]);
  const [scrollY] = useState(new Animated.Value(0));

  useEffect(() => {
    setLoading(true);
    fetch(
      `${Config.redditURL}${Config.subRedditName}${sort}.json?sort=new&t=month`
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [sort]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - HEADER_COLLAPSED_HEIGHT],
    outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
    extrapolate: "clamp",
  });
  const heroTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_EXPANDED_HEIGHT - 75],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const { width: SCREEN_WIDTH } = Dimensions.get("screen");

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Climate Action Plan</Text>
        </View>
        <Animated.View
          style={{
            height: headerHeight,
            width: SCREEN_WIDTH,
            position: "absolute",
            top: 0,
            left: 0,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Animated.Text
            style={{
              bottom: 0,
              opacity: heroTitleOpacity,
              fontSize: 20,
              color: Colors.gray500,
            }}
          >
            r/ClimateActionPlan
          </Animated.Text>
        </Animated.View>
        <View style={styles.headerShadow} />
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
            onScroll={Animated.event([
              {
                nativeEvent: {
                  contentOffset: {
                    y: scrollY,
                  },
                },
              },
            ])}
            scrollEventThrottle={16}
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
      </View>
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
  loading: { height: "80%" },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerStyle: {
    paddingTop: 48,
    paddingBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    textAlign: "center",
  },
  headerShadow: {
    height: 1,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2.62,
    backgroundColor: Colors.gray200,
    elevation: 4,
  },
  flatListContainer: {
    padding: 8,
  },
  flatListBottom: {
    paddingBottom: 256,
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
