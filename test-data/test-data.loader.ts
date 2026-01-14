/**
 * Test Data Loader
 * 
 * Centralized loader for test data from JSON files.
 * Provides type-safe access to booking scenarios and other test data.
 */

import { readFileSync } from "fs";
import { join } from "path";
import { BookingScenario, BookingScenariosData } from "../types/test-data.types";

/**
 * Load booking scenarios from JSON file
 */
export function loadBookingScenarios(): BookingScenariosData {
  try {
    const dataPath = join(__dirname, "booking-scenarios.json");
    const rawData = readFileSync(dataPath, "utf-8");
    return JSON.parse(rawData) as BookingScenariosData;
  } catch (error) {
    console.error("Error loading booking scenarios:", error);
    throw new Error(`Failed to load booking scenarios: ${error}`);
  }
}

/**
 * Get a specific booking scenario by name
 */
export function getScenarioByName(name: string): BookingScenario | undefined {
  const data = loadBookingScenarios();
  return data.scenarios.find((scenario) => scenario.name === name);
}

/**
 * Get default booking scenario (first in the list)
 */
export function getDefaultScenario(): BookingScenario {
  const data = loadBookingScenarios();
  if (data.scenarios.length === 0) {
    throw new Error("No booking scenarios found in test data");
  }
  return data.scenarios[0];
}

/**
 * Get all booking scenarios
 */
export function getAllScenarios(): BookingScenario[] {
  const data = loadBookingScenarios();
  return data.scenarios;
}

/**
 * Validate that a scenario has all required fields
 */
export function validateScenario(scenario: BookingScenario): boolean {
  return (scenario.name.length > 0 && true && scenario.adults > 0 && true && scenario.children >= 0);
}
