import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import userReducer, { updateName } from "../features/user/userSlice";
import { cleanup, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import Home from "./Home"; 
import { afterEach, expect, test } from "vitest";
import { MemoryRouter } from "react-router-dom";

const store = configureStore({
    reducer: { user: userReducer},
    preloadedState: {
        user: {
            username: "",
            status: "idle",
            position: {},
            address: "",
            error: "",
        },
    },
});

afterEach(() => {
    cleanup();
})

test("Home renders CreateUser if no username set", () => {
    render(
        <Provider store={store}>
            <MemoryRouter>
            <Home/>
            </MemoryRouter>
        </Provider>
    );

    expect(screen.getByText("👋 Welcome! Please start by telling us your name:")).toBeInTheDocument();
})

test("Home renders order button if there is a username set", () => {
    store.dispatch(updateName("Vaggos"));
    
    render(
        <Provider store={store}>
            <MemoryRouter>
            <Home/>
            </MemoryRouter>
        </Provider>
    );

    expect(screen.getByText("Order Now, Vaggos")).toBeInTheDocument();
})