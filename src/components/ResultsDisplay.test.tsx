import { render, screen } from "@testing-library/react";
import ResultsDisplay from "./ResultsDisplay";

describe("ResultsDisplay Component", () => {
  test("renders message when fact is provided", () => {
    render(<ResultsDisplay fact="Born on Monday" />);
    expect(screen.getByText("Born on Monday")).toBeInTheDocument();
  });

  test("renders nothing when fact is empty", () => {
    render(<ResultsDisplay fact="" />);
    const container = screen.queryByText(/Born/);
    expect(container).toBeNull();
  });
});
