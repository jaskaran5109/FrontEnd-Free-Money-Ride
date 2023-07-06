import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { CurrencyList } from "../../CurrencyList";
import { TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getAllOffers } from "../../redux/actions/offer";
import { getMyProfile } from "../../redux/actions/user";

const OfferColumnsScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const { offers } = useSelector((state) => state.offer);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      dispatch(getMyProfile());
    }, 2000);
  }, []);
  useEffect(() => {
    dispatch(getAllOffers());
  }, [dispatch, refreshing]);
  return (
    <ScrollView
      style={{ paddingBottom: 5 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {offers &&
        offers.map((data) => {
          return (
            data?.isEnabled && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("OfferDetail", {
                    itemId: data?._id,
                  })
                }
                key={data?._id}
              >
                <View style={styles.container}>
                  <Image
                    style={styles.offerImage}
                    source={{
                      uri: data?.logo,
                    }}
                  />
                  <View style={styles.offerDetails}>
                    <Text style={styles.offerTitle}>{data?.offerName}</Text>
                    <Text style={styles.offerGeo}>{data?.geo}</Text>
                    <View style={{ alignSelf: "flex-start" }}>
                      <TouchableOpacity
                        style={{
                          backgroundColor: "#B24BF3",
                          borderRadius: 10,
                          alignItems: "center",
                          padding: 10,
                        }}
                        onPress={() =>
                          navigation.navigate("OfferDetail", {
                            itemId: data?._id,
                          })
                        }
                      >
                        <Text style={styles.offerPrice}>
                          {" "}
                          Get{" "}
                          {CurrencyList.map((list) => {
                            if (list.code === data?.geo) return list.symbol;
                          })}
                          ₹{data?.po}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          );
        })}
    </ScrollView>
  );
};

export default OfferColumnsScreen;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    paddingTop: 8,
    marginTop: 5,
  },
  offerImage: {
    width: 100,
    height: 100,
    marginRight: 16,
    borderRadius: 8,
    resizeMode: "cover",
  },
  offerDetails: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  offerGeo: {
    fontSize: 14,
    marginBottom: 5,
    textTransform: "capitalize",
    color: "gray",
  },
  offerDescription: {
    marginBottom: 8,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  offerCategory: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
    textTransform: "capitalize",
  },
});
