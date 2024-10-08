import init from "../../../src/commands/init";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import os from "os";

// Mock built-in methods (os, fs, path, fs/promises)
jest.mock("fs/promises");
jest.mock("fs", () => ({
  existsSync: jest.fn(),
}));
jest.mock("path", () => ({
  resolve: jest.fn(),
  join: jest.fn((...args) => args.join("/")),
}));
jest.mock("os", () => ({
  userInfo: jest.fn(),
}));

describe("bit init", () => {
  beforeEach(() => {
    // reset all mocks
    jest.clearAllMocks();
    // set test user for os.userInfo
    (os.userInfo as jest.Mock).mockReturnValue({ username: "testuser" });
  });

  it("should initialize a new repository", async () => {
    // Setup mock return values
    const mockRootPath = "/test/path/.bit";
    (existsSync as jest.Mock).mockReturnValue(false);
    (path.resolve as jest.Mock).mockReturnValue(mockRootPath);

    // Setup spies (allows you to track calls + mock implementations)
    const mkdirSpy = jest.spyOn(fs, "mkdir").mockResolvedValue(undefined);
    const writeFileSpy = jest
      .spyOn(fs, "writeFile")
      .mockResolvedValue(undefined);
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

    // Call init method
    await init();

    // Assert function calls
    expect(existsSync).toHaveBeenCalledWith(".bit");
    expect(path.resolve).toHaveBeenCalledWith(".bit");
    expect(mkdirSpy).toHaveBeenCalledWith(".bit");
    expect(mkdirSpy).toHaveBeenCalledWith("/test/path/.bit/refs/heads", {
      recursive: true,
    });
    expect(mkdirSpy).toHaveBeenCalledWith("/test/path/.bit/objects");
    expect(writeFileSpy).toHaveBeenCalledWith(
      "/test/path/.bit/HEAD",
      expect.any(String)
    );
    expect(writeFileSpy).toHaveBeenCalledWith(
      "/test/path/.bit/config",
      expect.stringContaining("testuser")
    );
    expect(writeFileSpy).toHaveBeenCalledWith("/test/path/.bit/index", "");
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Successfully initialized bit repository for testuser"
    );
  });

  it("should not initalize a new repository if it already exists", async () => {
    // Set up mock return values
    (existsSync as jest.Mock).mockReturnValue(true);

    // Set up spies
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    const mkdirSpy = jest.spyOn(fs, "mkdir");

    await init();

    // Assert function calls
    expect(existsSync).toHaveBeenCalledWith(".bit");
    expect(mkdirSpy).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(".bit directory already exists");
  });
});
