"use client";

import { useState, useCallback, useRef } from "react";
import { TerminalSession, CommandOutput, UseTerminalReturn } from "@/types";
import { executeCommand as executeCommandHandler } from "@/utils/commandHandlers";

const useTerminal = (): UseTerminalReturn => {
  const [session, setSession] = useState<TerminalSession>({
    history: [],
    output: [],
    currentDirectory: "~",
    user: "visitor",
    hostname: "yashsuthar.com",
  });

  const commandIndex = useRef<number>(-1);

  const addToHistory = useCallback((command: string): void => {
    setSession(prev => ({
      ...prev,
      history: [...prev.history, command],
    }));
    commandIndex.current = -1;
  }, []);

  const addOutput = useCallback((output: CommandOutput): void => {
    setSession(prev => ({
      ...prev,
      output: [...prev.output, output],
    }));
  }, []);

  const clearTerminal = useCallback((): void => {
    setSession(prev => ({
      ...prev,
      output: [],
    }));
  }, []);

  const executeCommand = useCallback(
    async (command: string): Promise<void> => {
      const trimmedCommand = command.trim();

      if (!trimmedCommand) return;

      // Add command to history
      addToHistory(trimmedCommand);

      // Add command to output (echo)
      addOutput({
        type: "text",
        content: `${session.user}@${session.hostname}:${session.currentDirectory}$ ${trimmedCommand}`,
        timestamp: new Date(),
      });

      // Parse command and arguments
      const [cmd, ...args] = trimmedCommand.split(" ");
      const commandName = cmd?.toLowerCase() || "";

      // Handle special cases
      if (commandName === "clear") {
        clearTerminal();
        return;
      }

      // Execute command using command handlers
      try {
        const response = await executeCommandHandler(
          commandName,
          args,
          session
        );
        addOutput(response);
      } catch (error) {
        addOutput({
          type: "text",
          content: `Error executing command '${commandName}': ${error instanceof Error ? error.message : "Unknown error"}`,
          timestamp: new Date(),
        });
      }
    },
    [session, addToHistory, addOutput, clearTerminal]
  );

  return {
    session,
    executeCommand,
    clearTerminal,
    addToHistory,
  };
};

export default useTerminal;
