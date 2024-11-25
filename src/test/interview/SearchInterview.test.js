import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import SearchInterview from "~/components/SearchInterview";
import { fetchAllUser } from "~/services/userServices";

// Mocking the API call
jest.mock("~/services/userServices", () => ({
  fetchAllUser: jest.fn(),
}));

const mockUsers = [
  { fullName: "Recruiter 1", userRole: "ROLE_RECRUITER" },
  { fullName: "Recruiter 2", userRole: "ROLE_RECRUITER" },
];

describe("SearchInterview Component", () => {
  beforeEach(() => {
    fetchAllUser.mockResolvedValue({ data: mockUsers });
  });

  test("renders SearchInterview component and handles search", async () => {
    const handleSearch = jest.fn();
    render(<SearchInterview onSearch={handleSearch} />);

    // Check if elements are rendered
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /recruiter/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /status/i })
    ).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();

    // Wait for the recruiters to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText("Recruiter 1")).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText("Recruiter 2")).toBeInTheDocument();
    });

    // Simulate input change and search button click
    fireEvent.change(screen.getByPlaceholderText("Search"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /recruiter/i }), {
      target: { value: "Recruiter 1" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /status/i }), {
      target: { value: "1" },
    });
    fireEvent.click(screen.getByText("Search"));

    // Validate that the onSearch callback is called with correct parameters
    expect(handleSearch).toHaveBeenCalledWith("John", "1", "Recruiter 1");
  });

  // test("handles Enter key press for search", async () => {
  //   const handleSearch = jest.fn();
  //   render(<SearchInterview onSearch={handleSearch} />);

  //   // Check if elements are rendered
  //   expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  //   expect(
  //     screen.getByRole("combobox", { name: /recruiter/i })
  //   ).toBeInTheDocument();
  //   expect(
  //     screen.getByRole("combobox", { name: /status/i })
  //   ).toBeInTheDocument();
  //   expect(screen.getByText("Search")).toBeInTheDocument();

  //   // Wait for the recruiters to be fetched and rendered
  //   await waitFor(() => {
  //     expect(screen.getByText("Recruiter 1")).toBeInTheDocument();
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByText("Recruiter 2")).toBeInTheDocument();
  //   });

  //   // Simulate input change and Enter key press
  //   fireEvent.change(screen.getByPlaceholderText("Search"), {
  //     target: { value: "John" },
  //   });
  //   fireEvent.keyPress(screen.getByPlaceholderText("Search"), {
  //     key: "Enter",
  //     code: "Enter",
  //     charCode: 13,
  //   });

  //   // Validate that the onSearch callback is called with correct parameters
  //   expect(handleSearch).toHaveBeenCalledWith("John", 0, "");
  // });

  // test("handles no recruiters available", async () => {
  //   fetchAllUser.mockResolvedValue({ data: [] });

  //   render(<SearchInterview onSearch={jest.fn()} />);

  //   // Check if elements are rendered
  //   expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  //   expect(
  //     screen.getByRole("combobox", { name: /recruiter/i })
  //   ).toBeInTheDocument();
  //   expect(
  //     screen.getByRole("combobox", { name: /status/i })
  //   ).toBeInTheDocument();
  //   expect(screen.getByText("Search")).toBeInTheDocument();

  //   // Wait for the recruiters to be fetched and rendered
  //   await waitFor(() => {
  //     expect(screen.queryByText("Recruiter 1")).not.toBeInTheDocument();
  //   });
  //   await waitFor(() => {
  //     expect(screen.queryByText("Recruiter 2")).not.toBeInTheDocument();
  //   });
  // });

  // test("displays error when fetchAllUser fails", async () => {
  //   fetchAllUser.mockRejectedValue(new Error("API error"));

  //   const { getByText } = render(<SearchInterview onSearch={jest.fn()} />);

  //   // Check if elements are rendered
  //   expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  //   expect(
  //     screen.getByRole("combobox", { name: /recruiter/i })
  //   ).toBeInTheDocument();
  //   expect(
  //     screen.getByRole("combobox", { name: /status/i })
  //   ).toBeInTheDocument();
  //   expect(screen.getByText("Search")).toBeInTheDocument();

  //   // Check if error message is logged
  //   await waitFor(() => {
  //     expect(console.error).toHaveBeenCalledWith(
  //       "Error fetching interviewers:",
  //       expect.any(Error)
  //     );
  //   });
  // });
});
