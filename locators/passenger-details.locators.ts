export const PassengerDetailsLocators = {
  paxForm: "#pax-form",
  continueButton: "#PassengerV2ContinueButton__component .ContinueButtonV2__continue:visible button",
  
  // Input fields by prefix
  inputs: {
    firstNameAdult: '[id^="FIRSTNAMEADULT"]',
    surnameAdult: '[id^="SURNAMEADULT"]',
    address: '[id^="ADDRESS1ADULT"]',
    houseNumber: '[id^="HOUSENUMBERADULT"]',
    postalCode: '[id^="POSTALCODEADULT"]',
    town: '[id^="TOWNADULT"]',
    mobileNumber: '[id^="MOBILENUMBERADULT"]',
    emailAddress: '[id^="EMAILADDRESSADULT"]',
    firstNameChild: '[id^="FIRSTNAMECHILD"]',
    surnameChild: '[id^="SURNAMECHILD"]',
    firstNameInfant: '[id^="FIRSTNAMEINFANT"]',
    surnameInfant: '[id^="SURNAMEINFANT"]',
  },

  // Error message pattern
  errorMessageSuffix: "__errorMessage",
} as const;

export const PassengerValidationFields = {
  adult_mainBooker: [
    "FIRSTNAMEADULT",
    "SURNAMEADULT",
    "ADDRESS1ADULT",
    "HOUSENUMBERADULT",
    "POSTALCODEADULT",
    "TOWNADULT",
    "MOBILENUMBERADULT",
    "EMAILADDRESSADULT",
  ],
  child_passenger: ["FIRSTNAMECHILD", "SURNAMECHILD"],
  infant_passenger: ["FIRSTNAMEINFANT", "SURNAMEINFANT"],
} as const;
