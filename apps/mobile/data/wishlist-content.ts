import { PRODUCTS, type Product } from "./products-content";

// Mantém os itens da wishlist alinhados com a rota /product/[id]
// (ou seja: o clique no card mostra as mesmas infos na tela de detalhe).
export const WISHLIST_ITEMS: Product[] = PRODUCTS.slice(0, 6);

