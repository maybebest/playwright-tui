/**
 * Test data type definitions
 */

/**
 * Booking data structure
 */
export interface BookingData {
  departureAirport: string;
  destination: string;
  departureDate: string;
  adults: number;
  children: number;
  childAge?: number;
}

/**
 * Passenger information data
 */
export interface PassengerData {
  firstName: string;
  surname: string;
  address?: string;
  houseNumber?: string;
  postalCode?: string;
  town?: string;
  mobileNumber?: string;
  emailAddress?: string;
}

/**
 * Validation field configuration
 */
export interface ValidationField {
  id: string;
  errorMessage?: string;
  isRequired: boolean;
}

/**
 * Passenger type classification
 */
export type PassengerType = "adult" | "child" | "infant";

/**
 * Booking section type for validation
 */
export type BookingSectionType = "adult_mainBooker" | "child_passenger" | "infant_passenger";

/**
 * Booking scenario from test data
 */
export interface BookingScenario {
  name: string;
  adults: number;
  children: number;
  childAgeRange?: {
    min: number;
    max: number;
  };
  description: string;
}

/**
 * Complete booking scenarios data structure
 */
export interface BookingScenariosData {
  scenarios: BookingScenario[];
}
