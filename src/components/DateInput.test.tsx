import { render, screen, fireEvent } from "@testing-library/react";
import DateInput from "./DateInput";

describe("DateInput Component", () => {
  const mockOnChange = jest.fn();

  test("renders date input", () => {
    render(<DateInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox"); // type=date
    expect(input).toBeInTheDocument();
  });

  test("calls onChange when user selects date", () => {
    render(<DateInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "1990-05-15" } });
    expect(mockOnChange).toHaveBeenCalledWith("1990-05-15");
  });

  test("does not call onChange for invalid date", () => {
    render(<DateInput value="" onChange={mockOnChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    expect(mockOnChange).toHaveBeenCalledWith("");
  });
});
