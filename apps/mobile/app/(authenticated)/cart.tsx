import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useCartInteraction } from "@/hooks/use-cart-interaction";
import { colors } from "@/lib/theme";
import { formatCurrency } from "@/utils";

const TAB_BAR_CLEARANCE = 118;

type QuantityControlProps = {
  title: string;
  quantity: number;
  decreaseDisabled: boolean;
  increaseDisabled: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
};

function QuantityControl({
  title,
  quantity,
  decreaseDisabled,
  increaseDisabled,
  onDecrease,
  onIncrease,
}: QuantityControlProps) {
  return (
    <View
      className="h-10 flex-row items-center overflow-hidden rounded-xl px-1"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.82)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.24)",
      }}
      accessibilityRole="adjustable"
      accessibilityLabel={`Quantidade de ${title}`}
      accessibilityValue={{ min: 0, now: quantity }}
    >
      <Pressable
        onPress={onDecrease}
        disabled={decreaseDisabled}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Diminuir quantidade de ${title}`}
        className="h-8 w-8 items-center justify-center rounded-full active:opacity-70 disabled:opacity-40"
        style={{ backgroundColor: "rgba(38, 36, 41, 0.22)" }}
      >
        <Ionicons name="remove" size={18} color="#29282B" />
      </Pressable>

      <Text className="w-12 text-center font-golos text-lg text-[#242326]">
        {quantity}
      </Text>

      <Pressable
        onPress={onIncrease}
        disabled={increaseDisabled}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Aumentar quantidade de ${title}`}
        className="h-8 w-8 items-center justify-center rounded-full active:opacity-70 disabled:opacity-40"
        style={{ backgroundColor: "rgba(38, 36, 41, 0.22)" }}
      >
        <Ionicons name="add" size={18} color="#29282B" />
      </Pressable>
    </View>
  );
}

export default function CartScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const compact = width < 370;
  const cart = useCartInteraction();

  const handleCheckout = () => {
    router.push("/checkout");
  };

  return (
    <View className="flex-1 bg-[#151315]">
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: compact ? 16 : 23,
            paddingBottom: TAB_BAR_CLEARANCE,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="mt-6 h-14 w-14 items-center justify-center rounded-xl bg-[#272628] active:opacity-75"
          >
            <Ionicons name="chevron-back" size={24} color="#D5D4D7" />
          </Pressable>

          <Text className="mb-3 mt-8 font-sans text-[28px] leading-9 text-[#F7F6F7]">
            Carrinho
          </Text>

          {cart.isLoading ? (
            <View className="flex-1 items-center justify-center pb-28 pt-16">
              <ActivityIndicator color={colors.primary.DEFAULT} size="large" />
              <Text className="mt-4 font-golos text-sm text-white/65">
                Carregando seu carrinho…
              </Text>
            </View>
          ) : cart.isLoadError ? (
            <View className="flex-1 items-center justify-center px-5 pb-28 pt-12">
              <Ionicons
                name="cloud-offline-outline"
                size={48}
                color="#777179"
              />
              <Text className="mt-5 text-center font-sans text-xl text-white">
                Seu carrinho não carregou
              </Text>
              <Text className="mt-2 text-center font-golos text-sm leading-5 text-white/60">
                Verifique sua conexão e tente novamente.
              </Text>
              <Pressable
                onPress={() => void cart.retry()}
                accessibilityRole="button"
                className="mt-6 min-h-12 items-center justify-center rounded-xl bg-primary px-6 active:opacity-80"
              >
                <Text className="font-golos-semibold text-sm text-white">
                  Tentar novamente
                </Text>
              </Pressable>
            </View>
          ) : cart.items.length === 0 ? (
            <View className="flex-1 items-center justify-center px-5 pb-28 pt-12">
              <Ionicons name="cart-outline" size={52} color="#777179" />
              <Text className="mt-5 text-center font-sans text-xl text-white">
                Seu carrinho está vazio
              </Text>
              <Text className="mt-2 max-w-72 text-center font-golos text-sm leading-5 text-white/60">
                Adicione um disco para encontrá-lo aqui.
              </Text>
              <Pressable
                onPress={() => router.replace("/home")}
                accessibilityRole="button"
                className="mt-6 min-h-12 items-center justify-center rounded-xl bg-primary px-6 active:opacity-80"
              >
                <Text className="font-golos-semibold text-sm text-white">
                  Explorar discos
                </Text>
              </Pressable>
            </View>
          ) : (
            <>
              <View className="gap-2.5">
                {cart.items.map(
                  ({ item, decreaseDisabled, increaseDisabled }) => {
                    const coverSize = compact ? 86 : 102;

                    return (
                      <View
                        key={item.id}
                        className="relative rounded-xl bg-[#272627]"
                        style={{ minHeight: coverSize + 32 }}
                      >
                        <Pressable
                          onPress={() =>
                            router.push({
                              pathname: "/product/[id]",
                              params: { id: item.product.id },
                            })
                          }
                          accessibilityRole="button"
                          accessibilityLabel={`Abrir ${item.product.title}, de ${item.product.artist.name}`}
                          className="flex-row rounded-xl px-2.5 py-4 active:opacity-85"
                        >
                          {item.product.image?.url ? (
                            <Image
                              source={{ uri: item.product.image.url }}
                              contentFit="cover"
                              transition={160}
                              style={{
                                width: coverSize,
                                height: coverSize,
                                borderRadius: 12,
                              }}
                              accessibilityLabel={
                                item.product.image.altText ??
                                `Capa do álbum ${item.product.title}`
                              }
                            />
                          ) : (
                            <View
                              className="items-center justify-center rounded-xl bg-[#363438]"
                              style={{ width: coverSize, height: coverSize }}
                              accessibilityLabel={`Capa indisponível para ${item.product.title}`}
                            >
                              <Ionicons
                                name="disc-outline"
                                size={36}
                                color="#8F8991"
                              />
                            </View>
                          )}

                          <View className="ml-3 min-w-0 flex-1 justify-between py-0.5 pr-20">
                            <View>
                              <Text
                                numberOfLines={1}
                                className="font-sans text-[20px] leading-6 text-[#F8F7F8]"
                              >
                                {item.product.title}
                              </Text>
                              <Text
                                numberOfLines={1}
                                className="mt-1 font-golos text-[15px] leading-5 text-[#ECEAEC]"
                              >
                                {item.product.artist.name}
                              </Text>
                            </View>

                            <Text
                              numberOfLines={1}
                              adjustsFontSizeToFit
                              className="font-golos-semibold text-[17px] text-[#F8F7F8]"
                            >
                              {formatCurrency(Number(item.product.price))}
                            </Text>
                          </View>
                        </Pressable>

                        <View className="absolute bottom-4 right-2.5">
                          <QuantityControl
                            title={item.product.title}
                            quantity={item.quantity}
                            decreaseDisabled={decreaseDisabled}
                            increaseDisabled={increaseDisabled}
                            onDecrease={() =>
                              cart.changeQuantity(item, "decrease")
                            }
                            onIncrease={() =>
                              cart.changeQuantity(item, "increase")
                            }
                          />
                        </View>
                      </View>
                    );
                  },
                )}
              </View>

              {cart.hasUpdateError ? (
                <Pressable
                  onPress={cart.dismissUpdateError}
                  accessibilityRole="alert"
                  className="mt-3 rounded-xl bg-[#34272A] px-4 py-3 active:opacity-80"
                >
                  <Text className="font-golos text-sm text-[#FFB1AD]">
                    Não foi possível atualizar a quantidade. Toque para fechar e
                    tente novamente.
                  </Text>
                </Pressable>
              ) : null}

              <View className="mt-6 gap-1">
                <View className="flex-row items-center justify-between">
                  <Text className="font-golos text-[17px] text-[#F2F0F2]">
                    Subtotal
                  </Text>
                  <Text className="font-golos text-[17px] text-[#F2F0F2]">
                    {formatCurrency(cart.totals.subtotal)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="font-golos text-[17px] text-[#F2F0F2]">
                    Frete
                  </Text>
                  <Text className="font-golos text-[17px] text-[#F2F0F2]">
                    {formatCurrency(cart.totals.shipping)}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <Text className="font-golos text-[17px] text-[#F2F0F2]">
                    Total
                  </Text>
                  <Text className="font-golos text-[17px] text-[#F2F0F2]">
                    {formatCurrency(cart.totals.total)}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={handleCheckout}
                disabled={cart.isUpdating}
                accessibilityRole="button"
                accessibilityLabel={`Continuar para o checkout, total ${formatCurrency(cart.totals.total)}`}
                accessibilityState={{ disabled: cart.isUpdating }}
                className="mt-3 min-h-[50px] flex-row items-center justify-center gap-2 rounded-[11px] bg-primary px-5 active:opacity-85 disabled:bg-[#4D474E]"
              >
                <Text className="font-sans text-xl text-white">Check-out</Text>
                <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
              </Pressable>
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={cart.pendingRemoval !== null}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={cart.cancelRemoval}
      >
        <View className="flex-1 items-center justify-center bg-black/75 px-6">
          <View
            className="w-full max-w-sm rounded-2xl bg-[#2A282B] p-5"
            accessibilityViewIsModal
          >
            <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/15">
              <Ionicons
                name="trash-outline"
                size={23}
                color={colors.primary.DEFAULT}
              />
            </View>

            <Text className="mt-4 font-sans text-xl text-white">
              Remover do carrinho?
            </Text>
            <Text className="mt-2 font-golos text-sm leading-5 text-white/65">
              {cart.pendingRemoval?.title
                ? `${cart.pendingRemoval.title} será removido do seu carrinho.`
                : "Este item será removido do seu carrinho."}
            </Text>

            <View className="mt-6 flex-row gap-3">
              <Pressable
                onPress={cart.cancelRemoval}
                accessibilityRole="button"
                accessibilityLabel="Cancelar remoção"
                className="min-h-12 flex-1 items-center justify-center rounded-xl bg-white/10 px-4 active:opacity-70"
              >
                <Text className="font-golos-semibold text-sm text-white">
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                onPress={cart.confirmRemoval}
                accessibilityRole="button"
                accessibilityLabel={`Remover ${cart.pendingRemoval?.title ?? "item"} do carrinho`}
                className="min-h-12 flex-1 items-center justify-center rounded-xl bg-primary px-4 active:opacity-80"
              >
                <Text className="font-golos-semibold text-sm text-white">
                  Remover
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
