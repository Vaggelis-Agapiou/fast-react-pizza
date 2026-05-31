import { test, expect } from "vitest";
import cartReducer, { addItem } from "./cartSlice";
 

const mockPizza = {
    pizzaId: 1,
    name: "Margherita",
    quantity: 1,
    unitPrice: 12,
    totalPrice: 12,
}

test("addItem adds a pizza to the cart", () => {
    const initalState = { cart: [] }
    const newState = cartReducer(initalState, addItem(mockPizza));

    expect(newState.cart).toHaveLength(1);
});