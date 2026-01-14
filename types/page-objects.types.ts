/**
 * Type definitions for Page Object Model classes
 */

/**
 * Booking selection data returned from HomePage
 */
export interface BookingSelectionData {
  departureAirport: string;
  destination: string;
  departureDate: string;
  adults: number;
  children: number;
  childAge?: number;
}

/**
 * Hotel search result data
 */
export interface HotelSearchResult {
  hotelName: string;
  url?: string;
}

/**
 * Passenger validation section types
 */
export type PassengerSectionType = "adult_mainBooker" | "child_passenger" | "infant_passenger";

/**
 * Passenger validation IDs by section
 */
export interface PassengerValidationIds {
  adult_mainBooker: readonly string[];
  child_passenger: readonly string[];
  infant_passenger: readonly string[];
}

/**
 * Click options for UI interactions
 */
export interface ClickOptions {
  timeout?: number;
}

/**
 * Navigation options
 */
export interface NavigationOptions {
  waitUntil?: "load" | "domcontentloaded" | "networkidle";
  timeout?: number;
}
