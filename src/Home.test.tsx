import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

describe("Home Component", () => {
    test('renders "Are you ready to be a pokemon master?"', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(
            screen.getByText("Are you ready to be a pokemon master?")
        ).toBeInTheDocument();
    });

    test('renders red text when input is not "Ready!"', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );
        expect(screen.getByText("I am not ready yet!")).toBeInTheDocument();
    });

    test('hides red text and shows image when input is "Ready!"', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "Ready!" } });

        expect(screen.queryByText("I am not ready yet!")).not.toBeInTheDocument();
        const image = screen.getByAltText("logo");
        expect(image).toBeVisible();
    });

    test('image is clickable and navigates to "/pokedex"', () => {
        render(
            <MemoryRouter>
                <Home />
            </MemoryRouter>
        );

        const input = screen.getByRole("textbox");
        fireEvent.change(input, { target: { value: "Ready!" } });

        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "#/pokedex");
    });
});
