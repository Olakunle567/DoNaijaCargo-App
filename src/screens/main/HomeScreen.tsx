import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { HomeStackParamList, MainTabParamList } from "../../navigation/types";
import { ScreenContainer } from "../../ui/ScreenContainer";
import { AppHeader } from "../../ui/AppHeader";
import { WireframeBox } from "../../ui/WireframeBox";
import { useSettings } from "../../settings/SettingsContext";
import type { TranslationKey } from "../../lib/i18n";

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, "Home">,
  BottomTabScreenProps<MainTabParamList>
>;

const GRID_ITEMS: {
  key: string;
  icon: string;
  family: "feather" | "mci";
  titleKey: TranslationKey;
  descKey: TranslationKey;
}[] = [
  { key: "ship", icon: "box", family: "feather", titleKey: "shipCargoTitle", descKey: "shipCargoDesc" },
  { key: "track", icon: "map-pin", family: "feather", titleKey: "trackShipmentTitle", descKey: "trackShipmentDesc" },
  { key: "myshipments", icon: "clipboard", family: "feather", titleKey: "myShipmentsTitle", descKey: "myShipmentsDesc" },
  { key: "riding", icon: "moped", family: "mci", titleKey: "dispatchRidingTitle", descKey: "dispatchRidingDesc" },
  { key: "haulage", icon: "truck", family: "feather", titleKey: "haulageTitle", descKey: "haulageDesc" },
  { key: "shop", icon: "shopping-bag", family: "feather", titleKey: "shopTitle", descKey: "shopDesc" },
];

function GridIcon({ family, name }: { family: "feather" | "mci"; name: string }) {
  return family === "feather" ? (
    <Feather name={name as any} size={24} color="#1B4332" />
  ) : (
    <MaterialCommunityIcons name={name as any} size={24} color="#1B4332" />
  );
}

export function HomeScreen({ navigation }: Props) {
  const { t } = useSettings();
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
          <Text className="text-subhead font-outfit text-white/70">{t("welcomeBack")}</Text>
          <Text className="pt-1 text-largeTitle font-outfit-extrabold text-white">{t("welcome")}</Text>
          <View className="absolute right-6 top-5">
            <WireframeBox />
          </View>
        </View>

        <View className="mt-4 flex-row flex-wrap gap-3">
          {GRID_ITEMS.map((item) => (
            <Pressable
              key={item.key}
              onPress={() => handlePress(item.key)}
              className="w-[47.5%] justify-center rounded-[18px] border-[0.661px] border-[rgba(27,67,50,0.06)] bg-surface px-4 py-4 active:opacity-70"
            >
              <GridIcon family={item.family} name={item.icon} />
              <Text className="pt-3 text-headline font-outfit-semibold text-ink">{t(item.titleKey)}</Text>
              <Text className="pt-1 text-footnote font-outfit text-muted">{t(item.descKey)}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={() => navigation.getParent()?.navigate("RidingTab")}
          className="mt-4 h-[130px] flex-row overflow-hidden rounded-[20px] border-[0.661px] border-[rgba(27,67,50,0.07)] bg-[#EEF1EF] active:opacity-70"
        >
          <View className="flex-1 justify-between p-5">
            <View>
              <Text className="text-title font-outfit-bold text-ink">{t("dispatchPromoTitle")}</Text>
              <Text className="w-[150px] pt-1 text-footnote font-outfit text-muted">{t("dispatchPromoDesc")}</Text>
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
