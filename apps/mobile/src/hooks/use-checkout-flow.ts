import { Alert } from "react-native";

import { useDefaultAddress } from "@/hooks/use-addresses";
import { useCart } from "@/hooks/use-cart";
import { useCompleteCheckout } from "@/hooks/use-orders";
import {
  formatAddressLines,
  formatCurrency,
  getApiErrorMessage,
} from "@/utils";

type UseCheckoutFlowOptions = {
  onNavigateToAddress: (addressId?: string) => void;
  onOrderComplete: (params: { orderId: string; total: string }) => void;
};

export function useCheckoutFlow({
  onNavigateToAddress,
  onOrderComplete,
}: UseCheckoutFlowOptions) {
  const cart = useCart();
  const defaultAddress = useDefaultAddress();
  const completeCheckout = useCompleteCheckout();

  const address = defaultAddress.data;
  const hasAddress = Boolean(address);

  const totals = {
    subtotal: cart.data?.subtotal ?? "0.00",
    shipping: cart.data?.shipping ?? "0.00",
    total: cart.data?.total ?? "0.00",
  };

  const addressLines = defaultAddress.isLoading
    ? ["Carregando endereço..."]
    : address
      ? formatAddressLines(address)
      : ["Nenhum endereço cadastrado", "Toque para adicionar um endereço"];

  const showEditNotice = (section: string) => {
    Alert.alert(`Editar ${section}`, "Não disponível");
  };

  const openAddress = () => {
    onNavigateToAddress(address?.id);
  };

  const finishPurchase = () => {
    if (!hasAddress) {
      Alert.alert(
        "Endereço de entrega necessário",
        "Cadastre um endereço para poder finalizar a compra.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Cadastrar",
            onPress: () => onNavigateToAddress(),
          },
        ],
      );
      return;
    }

    completeCheckout.mutate(undefined, {
      onSuccess: (order) => {
        onOrderComplete({
          orderId: order.id,
          total: formatCurrency(Number(order.total)),
        });
      },
      onError: (error: unknown) => {
        const message = getApiErrorMessage(
          error,
          "Confira seu carrinho e endereço de entrega, depois tente novamente.",
        );

        Alert.alert("Não foi possível criar o pedido", message);
      },
    });
  };

  const isSubmitting = completeCheckout.isPending;
  const isConfirmDisabled =
    isSubmitting || cart.isPending || !cart.data?.items.length;

  return {
    totals,
    hasAddress,
    isAddressLoading: defaultAddress.isLoading,
    addressLines,
    isSubmitting,
    isConfirmDisabled,
    showEditNotice,
    openAddress,
    finishPurchase,
  };
}
