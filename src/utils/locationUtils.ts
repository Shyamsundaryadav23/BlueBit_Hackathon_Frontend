
/**
 * Utility functions for geolocation and currency detection
 */

// Common currency codes by country
const countryCurrencyMap: Record<string, string> = {
    'US': 'USD',
    'CA': 'CAD',
    'GB': 'GBP',
    'EU': 'EUR',
    'JP': 'JPY',
    'CN': 'CNY',
    'AU': 'AUD',
    'IN': 'INR',
    'BR': 'BRL',
    'RU': 'RUB',
    'ZA': 'ZAR',
    'MX': 'MXN',
    'SG': 'SGD',
    'CH': 'CHF',
    // Add more as needed
  };
  
  // Default currency if geolocation fails
  export const DEFAULT_CURRENCY = 'USD';
  
  /**
   * Get user's location using browser geolocation API
   */
  export const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };
  
  /**
   * Get currency code based on coordinates
   */
  export const getCurrencyFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      // Use reverse geocoding to get country from coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get location data');
      }
      
      const data = await response.json();
      const countryCode = data.address?.country_code?.toUpperCase();
      
      // Return the currency code for the country, or default if not found
      return countryCode && countryCurrencyMap[countryCode] 
        ? countryCurrencyMap[countryCode] 
        : DEFAULT_CURRENCY;
    } catch (error) {
      console.error('Error getting currency from coordinates:', error);
      return DEFAULT_CURRENCY;
    }
  };
  
  /**
   * Get currency symbol for a currency code
   */
  export const getCurrencySymbol = (currencyCode: string): string => {
    try {
      // Use the Intl API to get the currency symbol
      return new Intl.NumberFormat('en', { style: 'currency', currency: currencyCode })
        .formatToParts(0)
        .find(part => part.type === 'currency')?.value || '$';
    } catch (error) {
      console.error('Error getting currency symbol:', error);
      return '$'; // Default to USD symbol
    }
  };
  
  /**
   * Detect user's local currency based on browser geolocation
   */
  export const detectUserCurrency = async (): Promise<{ code: string, symbol: string }> => {
    try {
      // First try to get currency from geolocation
      const position = await getUserLocation();
      const currencyCode = await getCurrencyFromCoordinates(
        position.coords.latitude, 
        position.coords.longitude
      );
      const symbol = getCurrencySymbol(currencyCode);
      
      return { code: currencyCode, symbol };
    } catch (error) {
      // If geolocation fails, fall back to the browser's locale
      try {
        const browserLocale = navigator.language;
        // Extract region code from locale (e.g., 'en-US' -> 'US')
        const regionCode = browserLocale.split('-')[1]?.toUpperCase();
        
        if (regionCode && countryCurrencyMap[regionCode]) {
          const currencyCode = countryCurrencyMap[regionCode];
          const symbol = getCurrencySymbol(currencyCode);
          return { code: currencyCode, symbol };
        }
      } catch (e) {
        console.error('Error detecting currency from browser locale:', e);
      }
      
      // Default fallback
      return { 
        code: DEFAULT_CURRENCY, 
        symbol: getCurrencySymbol(DEFAULT_CURRENCY) 
      };
    }
  };