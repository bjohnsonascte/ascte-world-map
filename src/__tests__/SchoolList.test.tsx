import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SchoolList from "../components/SchoolList";

describe("SchoolList", () => {
  it("renders all schools when no filter is applied", () => {
    render(<SchoolList selectedState={null} />);
    expect(screen.getByText("Schools Attended")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search schools...")
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBeGreaterThan(0);
  });

  it("filters by selected state", () => {
    render(<SchoolList selectedState="Alabama" />);
    expect(screen.getByText(/Filtered: Alabama/)).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    items.forEach((item) => {
      expect(item).toHaveTextContent("Alabama");
    });
  });

  it("filters by search text", async () => {
    render(<SchoolList selectedState={null} />);
    const input = screen.getByPlaceholderText("Search schools...");
    await userEvent.type(input, "Vanderbilt");
    const items = screen.getAllByRole("listitem");
    expect(items.length).toBe(1);
    expect(items[0]).toHaveTextContent("Vanderbilt");
  });

  it("shows empty state when no results match", async () => {
    render(<SchoolList selectedState={null} />);
    const input = screen.getByPlaceholderText("Search schools...");
    await userEvent.type(input, "xyznonexistent");
    expect(screen.getByText("No schools found")).toBeInTheDocument();
  });
});
