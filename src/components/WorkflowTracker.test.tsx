import { render, screen } from "@testing-library/react";
import WorkflowTracker from "./WorkflowTracker";

describe("WorkflowTracker Component", () => {
  const steps = [
    { step: 1, text: "Enter DOB", status: "completed" },
    { step: 2, text: "View results", status: "current" },
  ];

  test("renders all steps correctly", () => {
    render(<WorkflowTracker steps={steps} />);
    steps.forEach(step => {
      expect(screen.getByText(step.text)).toBeInTheDocument();
    });
  });

  test("highlights current step", () => {
    render(<WorkflowTracker steps={steps} />);
    const currentStep = screen.getByText("View results");
    expect(currentStep).toHaveClass("current"); // assuming you add className based on status
  });
});
