import { test, expect } from "vitest";
import cartReducer, { addItem, clearCart, increaseItemQuantity } from "./cartSlice";
 

const mockPizza = {
    pizzaId: 1,
    name: "Margherita",
    quantity: 1,
    unitPrice: 12,
    totalPrice: 12,
}

test("addItem adds a pizza to the cart", () => {
    const initalState = { cart: [] };
    const newState = cartReducer(initalState, addItem(mockPizza));

    expect(newState.cart).toHaveLength(1);
});

test("increaseItemQuantity updates quantity & totalPrice", () => {
    const initialState =  {cart: [mockPizza]};
    const newState = cartReducer(initialState, increaseItemQuantity(1));

    expect(newState.cart[0].quantity).toBe(2);
    expect(newState.cart[0].totalPrice).toBe(24);
});

test("clearCart empties cart", () => {
    const initialState =  {cart: [mockPizza]};
    const newState = cartReducer(initialState, clearCart());

    expect(newState.cart).toHaveLength(0);
});