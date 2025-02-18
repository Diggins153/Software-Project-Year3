import "@testing-library/jest-dom";
import LoginPage from "@/app/@publicRoutes/login/page";
import { fireEvent, render, screen } from "@testing-library/react";
import { login } from "@/lib/actions/authentication";
import { LoginFormSchema } from "@/lib/formSchemas";


let formState: {};
const formData = new FormData();

formData.append("email", "test@gmail.com");
formData.append("password", "test1234");

const renderComponent = () => {
    return render(<LoginPage/>);
};

jest.mock("react-dom", () => ({
    ...jest.requireActual("react-dom"),
    useFormState: (mockLoginAction: any, state: any) => {
        formState = state;
        return [
            formState,
            (formData: FormData) => {
                mockLoginAction(formData).then((newState: any) => {
                    formState = newState;
                });
            },
        ];
    },
}));

jest.mock("../lib/actions", () => ({
    ...jest.requireActual("../lib/actions"),
    login: jest.fn((formData: FormData) => {
        const email = formData.get("email");
        const password = formData.get("password");

        const validatedFields = LoginFormSchema.safeParse({
            email: email,
            password: password,
        });

        if (!validatedFields.success) {
            return Promise.resolve({
                message: "validation error",
                errors: validatedFields.error.flatten().fieldErrors,
            });
        }

        return Promise.resolve({
            message: "success",
            errors: {},
        });
    }),
}));

// TODO: Edit to fit login page and not root from example
describe("Root", () => {
    it("should render root page", () => {
        renderComponent();
    });

    it("should grab the form components", () => {
        renderComponent();

        const emailInput = screen.getByPlaceholderText("email");
        const passwordInput = screen.getByPlaceholderText("password");
        const button = screen.getByRole("button");

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(button).toBeInTheDocument();
    });

    it("should call login action on form submit", async () => {
        renderComponent();

        const emailInput = screen.getByPlaceholderText("email");
        const passwordInput = screen.getByPlaceholderText("password");
        const button = screen.getByRole("button");

        fireEvent.input(emailInput, {
            target: { value: "test@gmail.com" },
        });
        expect(emailInput).toHaveValue("test@gmail.com");

        fireEvent.click(button);
        expect(login).not.toHaveBeenCalled();

        fireEvent.input(passwordInput, { target: { value: "test1234" } });
        expect(passwordInput).toHaveValue("test1234");

        fireEvent.click(button);

        expect(login).toHaveBeenCalled();
    });
});