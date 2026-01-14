export const HomePageLocators = {
  // Airport selection
  airportInput: '[data-test-id="airport-input"]',
  airportsPanel: ".dropModalScope_airports",
  airportBoxes: ".SelectAirports__parentGroup .inputs__CheckboxTextAligned",
  airportsApply: ".DropModal__footerContainer .DropModal__apply",

  // Destination selection
  destinationOpen: ".Package__destinations .inputs__children:visible",
  destinationPanel: ".dropModalScope_destinations",
  destinationLinks: ".DestinationsList__link:not(.DestinationsList__disabled)",
  destinationParentCheckbox: ".DestinationsList__droplistContainer .DestinationsList__parentCheckbox:visible",
  destinationApply: ".DropModal__footerContainer .DropModal__apply",

  // Departure date
  departureDateInput: '[data-test-id="departure-date-input"]',
  departureDatePanel: ".dropModalScope_Departuredate",
  availableDepartureDates: ".SelectLegacyDate__available",
  departureDateApply: ".DropModal__footerContainer .DropModal__apply",

  // Rooms & Guests
  roomsGuestsInput: '[data-test-id="rooms-and-guest-input"]',
  adultsSelect: ".AdultSelector__adultSelector select",
  childrenSelect: ".ChildrenSelector__childrenSelector select",
  childAgeSelect: ".ChildrenAge__childAgeSelector select",
  guestsPanel: ".dropModalScope_roomandguest",
  guestsApply: ".DropModal__footerContainer .DropModal__apply",

  // Search
  searchButton: '[data-test-id="search-button"]',
  searchResultsList: '[data-test-id="search-results-list"]',
} as const;
