import React, { useEffect, useRef, useState } from "react";
import Accordion from "../../components/Accordian";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getSingleOffer } from "../../redux/actions/offer";
import { getUserReport, updateUserWallet } from "../../redux/actions/user";
import LeftIcon from "../../assets/angle-left.png";
import {
  createUserEarnings,
  getUserEarnings,
} from "../../redux/actions/payout";

const OfferDetailsScreen = ({ route, navigation }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const { offer, loading } = useSelector((state) => state.offer);
  const { user, reports } = useSelector((state) => state.user);
  const { itemId } = route.params;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSingleOffer(itemId));
    dispatch(getUserEarnings(user?._id));
  }, [dispatch, itemId]);
  const match = offer?.offerLink.match(/o=(\d+)/);
  const oId = match ? match[1] : null;

  const timerRef = useRef(null);
  useEffect(() => {
    const fetchReport = () => {
      // dispatch(getUserReport(oId, user?._id));

      if (reports[0].Conversions === 1) {
        clearTimeout(timerRef.current); // Clear the timer immediately
        setIsTimerRunning(false); // Reset the timer running flag
        dispatch(updateUserWallet(user?._id, offer?.po));
        dispatch(
          createUserEarnings(
            user?._id,
            offer?.po,
            "INR",
            "Congratulations, your reward has been added to your wallet."
          )
        );
        console.log("Dispatch function works");
        return; // End the function execution
      }

      if (isTimerRunning) {
        timerRef.current = setTimeout(fetchReport, 5000); // Call fetchReport again after 5 seconds
      }
    };

    if (!isTimerRunning && reports !== undefined) {
      setIsTimerRunning(true); // Set the timer running flag
      fetchReport(); // Initial fetch if the timer is not already running
    }

    return () => {
      clearTimeout(timerRef.current); // Cleanup the timer when the component unmounts
    };
  }, [dispatch, reports]);

  const handleOffer = () => {
    Linking.openURL(`${offer.offerLink}&aff_sub2=${user?._id}`);
    dispatch(getUserReport(oId, user?._id));
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#36d7b7" />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={LeftIcon}
                style={{
                  width: 20,
                  height: 20,
                  marginRight: 15,
                  paddingRight: 30,
                }}
              />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {offer?.offerName}
            </Text>
            <TouchableOpacity
              style={{
                height: 40,
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderRadius: 10,
                borderColor: "#A020F0",
                borderWidth: 1,
              }}
              onPress={() => navigation.navigate("Wallet", { replace: true })}
            >
              <Text style={{ fontWeight: "bold" }}>₹{user?.wallet.amount}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            <Image
              source={{
                uri: `${offer?.coverImage}`,
              }}
              style={{
                width: "100%",
                height: undefined,
                borderRadius: 10,
                aspectRatio: 1,
                transform: [{ scale: 1 }],
                resizeMode: "contain",
              }}
            />
            <View
              style={{ alignSelf: "flex-end", marginRight: 20, marginTop: -25 }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#B24BF3",
                  borderRadius: 10,
                  padding: 10,
                }}
                onPress={() => handleOffer()}
              >
                <Text
                  style={{ color: "white", fontWeight: "800", fontSize: 16 }}
                >
                  Get ₹{offer?.po}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ display: "flex", flexDirection: "row", marginTop: 20 }}
            >
              <Image
                source={{
                  uri: `${offer?.logo}`,
                }}
                style={{ width: 60, height: 60, borderRadius: 10 }}
              />
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {offer?.offerName}
                </Text>
                <Text
                  style={{ color: "gray", fontSize: 14, fontWeight: "600" }}
                >
                  {offer?.geo}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderWidth: 0.5,
                borderColor: "lightgray",
                marginTop: 20,
              }}
            />

            <Accordion
              title="About Application"
              content={<Text>{offer?.appDescription}</Text>}
              expand={true}
            />
            <View style={{ borderWidth: 0.5, borderColor: "lightgray" }} />
            <Accordion
              title="Today's Task"
              content={<Text>{offer?.task}</Text>}
              expand={true}
            />

            <View style={{ borderWidth: 0.5, borderColor: "lightgray" }} />
          </ScrollView>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleOffer()}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Start Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default OfferDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    marginTop: "10%",
    height: 50,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  content: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#B24BF3",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
});
