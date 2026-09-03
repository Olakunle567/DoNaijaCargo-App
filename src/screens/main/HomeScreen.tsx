import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { HomeStackParamList, MainTabParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { AppHeader } from "../../ui/AppHeader";
import { WireframeBox } from "../../ui/WireframeBox";

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, "Home">,
  BottomTabScreenProps<MainTabParamList>
>;

const GRID_ITEMS = [
  { key: "ship", icon: "box" as const, family: "feather" as const, title: "Ship Cargo", desc: "Send your cargo easily" },
  { key: "track", icon: "map-pin" as const, family: "feather" as const, title: "Track Shipment", desc: "Track your cargo in real time" },
  { key: "myshipments", icon: "clipboard" as const, family: "feather" as const, title: "My Shipments", desc: "View and manage your shipments" },
  { key: "riding", icon: "moped" as const, family: "mci" as const, title: "Dispatch Riding", desc: "Book a rider for fast dispatch" },
  { key: "haulage", icon: "truck" as const, family: "feather" as const, title: "Haulage", desc: "Move heavy loads & bulk cargo" },
  { key: "shop", icon: "shopping-bag" as const, family: "feather" as const, title: "Shop", desc: "Order goods, we deliver them" },
];

function GridIcon({ family, name }: { family: "feather" | "mci"; name: string }) {
  return family === "feather" ? (
    <Feather name={name as any} size={24} color="#1B4332" />
  ) : (
    <MaterialCommunityIcons name={name as any} size={24} color="#1B4332" />
  );
}

export function HomeScreen({ navigation }: Props) {
  const handlePress = (key: string) => {
    switch (key) {
      case "ship":
        navigation.getParent()?.navigate("ShipTab");
        break;
      case "track":
        navigation.getParent()?.navigate("TrackingTab");
        break;
      case "myshipments":
        navigation.navigate("MyShipments");
        break;
      case "riding":
        navigation.getParent()?.navigate("RidingTab");
        break;
      case "haulage":
        navigation.navigate("Haulage");
        break;
      case "shop":
        navigation.navigate("Shop");
        break;
    }
  };

  return (
    <ScreenContainer className="px-0">
      <View className="px-5">
        <AppHeader />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="px-4 pb-6 pt-2">
        <View className="overflow-hidden rounded-[20px] bg-brand px-6 py-5">
          <View className="absolute -right-5 -top-5 size-[180px] rounded-full bg-white/[0.04]" />
          <Text className="font-outfit text-[14px] text-white/70">Welcome back,</Text>
          <Text className="pt-[2px] font-outfit-extrabold text-[30px] text-white">Welcome!</Text>
          <View className="absolute right-6 top-5">
            <WireframeBox />
          </View>
        </View>

        <View className="mt-4 flex-row flex-wrap gap-3">
          {GRID_ITEMS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => handlePress(item.key)}
              className="w-[47.5%] justify-center rounded-[18px] border-[0.661px] border-[rgba(27,67,50,0.06)] bg-surface px-4 pb-4 pt-[18px]"
            >
              <GridIcon family={item.family} name={item.icon} />
              <Text className="pt-3 font-outfit-bold text-[14px] text-ink">{item.title}</Text>
              <Text className="pt-[3px] font-outfit text-[11.5px] text-muted">{item.desc}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => navigation.getParent()?.navigate("RidingTab")}
          className="mt-4 h-[130px] flex-row overflow-hidden rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.07)] bg-[#EEF1EF]"
        >
          <View className="flex-1 justify-between p-5">
            <View>
              <Text className="font-outfit-extrabold text-[18px] leading-[21.6px] text-ink">Dispatch{"\n"}Riding</Text>
              <Text className="w-[150px] pt-[6px] font-outfit text-[11.5px] leading-[17.25px] text-muted">
                Need something delivered fast? Book a rider in minutes.
              </Text>
            </View>
          </View>
          <View className="w-[155px] overflow-hidden">
            <Image
              source={require("../../../assets/images/delivery-rider.jpg")}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
          <View className="absolute right-4 top-[77px] size-[38px] items-center justify-center rounded-full bg-white shadow">
            <Feather name="arrow-right" size={18} color="#1B4332" />
          </View>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}
