import { LanguageType } from "src/api/keymap/types";

// Do NOT modify this object - languages available in 1.3.8 and before
const legacyLanguage: { [key: string]: string } = {
  english: "en-US",
  british: "en-GB",
  spanish: "es-ES",
  german: "de-DE",
  french: "fr-FR",
  frenchBepo: "fr-XX-bepo",
  frenchOptimot: "fr-XX-optimot",
  swedish: "sv-SE",
  finnish: "fi-FI",
  danish: "da-DK",
  norwegian: "nb-NO",
  icelandic: "is-IS",
  japanese: "ja-JP",
  korean: "ko-KR",
  swissGerman: "de-CH",
  eurkey: "en-XX-eurkey",
};

/**
 * Helper function to convert legacy languages stored in config.js
 * @param {string} storedLanguage Stored language
 * @param {string} defaultLanguage Default language
 */
function getLanguage(storedLanguage: string, defaultLanguage = "en-US"): LanguageType {
  const language = storedLanguage || defaultLanguage;

  if (legacyLanguage[language] !== undefined) {
    return legacyLanguage[language] as LanguageType;
  }

  return language as LanguageType;
}

export default getLanguage;
