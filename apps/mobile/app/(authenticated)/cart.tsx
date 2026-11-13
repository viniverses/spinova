import { useRouter } from "expo-router";

import { CartView } from "@/components/cart/cart-view";
import { useCartInteraction } from "@/hooks/use-cart-interaction";

export default function CartScreen() {
  const router = useRouter();
  const cart = useCartInteraction();

  return (
    <CartView
      {...cart}
      onBack={() => router.back()}
      onExplore={() => router.replace("/home")}
      onProductPress={(productId) =>
        router.push({
          pathname: "/product/[id]",
          params: { id: productId },
        })
      }
      onCheckout={() => router.push("/checkout")}
    />
  );
}
