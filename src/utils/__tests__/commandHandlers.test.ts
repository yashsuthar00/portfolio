import {
  executeCommand,
  createUnknownCommandResponse,
  allCommands,
} from "@/utils/commandHandlers";
import { TerminalSession } from "@/types";

describe("Command Handlers", () => {
  const mockSession: TerminalSession = {
    history: [],
    output: [],
    currentDirectory: "~",
    user: "yash",
    hostname: "portfolio",
  };

  describe("executeCommand", () => {
    it("should execute help command", async () => {
      const result = await executeCommand("help", [], mockSession);
      expect(result.type).toBe("text");
      expect(result.content).toContain("Portfolio Terminal");
    });

    it("should execute about command", async () => {
      const result = await executeCommand("about", [], mockSession);
      expect(result.type).toBe("text");
      expect(result.content).toContain("Yash Suthar");
    });

    it("should handle unknown command with suggestions", async () => {
      const result = await executeCommand("halp", [], mockSession);
      expect(result.type).toBe("error");
      expect(result.content).toContain("Command not found: halp");
      expect(result.content).toContain("help");
    });

    it("should handle matrix command", async () => {
      const result = await executeCommand("matrix", [], mockSession);
      expect(result.type).toBe("component");
      expect(result.content).toBe("MATRIX_RAIN_COMPONENT");
    });

    it("should handle snake command", async () => {
      const result = await executeCommand("snake", [], mockSession);
      expect(result.type).toBe("component");
      expect(result.content).toBe("SNAKE_GAME_COMPONENT");
    });
  });

  describe("createUnknownCommandResponse", () => {
    it("should suggest similar commands for typos", () => {
      const result = createUnknownCommandResponse("halp");
      expect(result.type).toBe("error");
      expect(result.content).toContain("Did you mean:");
      expect(result.content).toContain("help");
    });

    it("should handle commands with no close matches", () => {
      const result = createUnknownCommandResponse("xyz123");
      expect(result.type).toBe("error");
      expect(result.content).toContain("Command not found: xyz123");
      expect(result.content).toContain(
        "Type 'help' to see all available commands"
      );
    });
  });

  describe("Command completeness", () => {
    it("should include all required commands", () => {
      const requiredCommands = [
        "help",
        "about",
        "skills",
        "experience",
        "education",
        "projects",
        "certifications",
        "contact",
        "funfact",
        "ls",
        "pwd",
        "cd",
        "cat",
        "grep",
        "whoami",
        "date",
        "clear",
        "neofetch",
        "matrix",
        "figlet",
        "cowsay",
        "fortune",
        "snake",
        "man",
        "history",
        "alias",
        "cmatrix",
      ];

      requiredCommands.forEach(cmd => {
        expect(allCommands).toContain(cmd);
      });
    });
  });
});
