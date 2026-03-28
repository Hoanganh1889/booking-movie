export const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (item) => {
  const cart = getCart();

  const index = cart.findIndex(
    (x) => x.showtimeId === item.showtimeId
  );

  if (index !== -1) {
    cart[index].seats += item.seats;
  } else {
    cart.push(item);
  }

  saveCart(cart);
};

export const removeFromCart = (showtimeId) => {
  const cart = getCart().filter((item) => item.showtimeId !== showtimeId);
  saveCart(cart);
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};