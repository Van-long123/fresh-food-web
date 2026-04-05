import { computed, ref } from "vue";

type CartItem = {
  id: number;
  name: string;
  variant: string;
  qty: number;
  price: number;
  image: string;
};

type ProductInput = {
  id?: number;
  name: string;
  price: number;
  image?: string;
};

const cartItems = ref<CartItem[]>([
  {
    id: 1001,
    name: "[RTC] Cá chua dồn thịt 3S (khay 450g)",
    variant: "KHAY",
    qty: 1,
    price: 59000,
    image: "https://picsum.photos/seed/cart-1/100/100",
  },
  {
    id: 1002,
    name: "[RTC] Cá lóc kho tiêu (khay 300g)",
    variant: "KHAY",
    qty: 1,
    price: 99000,
    image: "https://picsum.photos/seed/cart-2/100/100",
  },
  {
    id: 1003,
    name: "[RTC] Canh bí đao dồn thịt 3S (khay 450g)",
    variant: "KHAY",
    qty: 1,
    price: 50000,
    image: "https://picsum.photos/seed/cart-3/100/100",
  },
]);

const notice = ref("");
const noticeKey = ref(0);

const itemCount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.qty, 0),
);

const totalAmount = computed(() =>
  cartItems.value.reduce((sum, item) => sum + item.qty * item.price, 0),
);

const formatVnd = (value: number) => `${value.toLocaleString("vi-VN")}đ`;

const triggerNotice = (message: string) => {
  notice.value = message;
  noticeKey.value += 1;
};

const addToCart = (product: ProductInput) => {
  const existing = cartItems.value.find((item) => item.name === product.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cartItems.value.unshift({
      id: product.id ?? Date.now(),
      name: product.name,
      variant: "KHAY",
      qty: 1,
      price: product.price,
      image: product.image ?? "https://picsum.photos/seed/cart-default/100/100",
    });
  }

  triggerNotice(`Đã thêm "${product.name}" vào giỏ hàng`);
};

const increaseQty = (id: number) => {
  const item = cartItems.value.find((it) => it.id === id);
  if (!item) return;
  item.qty += 1;
};

const decreaseQty = (id: number) => {
  const item = cartItems.value.find((it) => it.id === id);
  if (!item) return;
  if (item.qty <= 1) return;
  item.qty -= 1;
};

const removeItem = (id: number) => {
  cartItems.value = cartItems.value.filter((item) => item.id !== id);
  triggerNotice("Đã xóa sản phẩm khỏi giỏ hàng");
};

export const useCart = () => ({
  cartItems,
  notice,
  noticeKey,
  itemCount,
  totalAmount,
  formatVnd,
  addToCart,
  increaseQty,
  decreaseQty,
  removeItem,
});
