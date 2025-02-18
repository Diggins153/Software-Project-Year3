import "@testing-library/jest-dom";
import LoginPage from "@/app/@publicRoutes/login/page";
import { render, screen } from "@testing-library/react";

describe("Login Page", () => {
    it("should contain a login heading", () => {
        render(<LoginPage/>);

        const heading = screen.getByRole("heading", { name: "Login", level: 2 });

        expect(heading).toBeInTheDocument();
    });
});
