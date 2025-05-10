//draft for later hook implementation - needs error handling bc users need to have seller profile set up

import { useState, useEffect } from 'react';

// Replace this with the actual API URL
const USE_SUGGESTED_PRICE_API_URL = 'https://api.discogs.com/marketplace/price_suggestions';

export const useSuggestedPrice = (releaseId: string) => {
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!releaseId) return;

    const fetchSuggestedPrice = async () => {
      setLoading(true);
      setError(null);

      try {
        // Log the releaseId to confirm it's being passed correctly
        console.log('Fetching suggested price for release ID:', releaseId);

        const response = await fetch(`${USE_SUGGESTED_PRICE_API_URL}/${releaseId}`, {
          headers: {
            Authorization: `Discogs token RdrvXEBTzPsnMmycwuPtxQsGzeWkPzjsWFULdMvl`, // Use your Discogs API token here
          },
        });

        // Log the response status and body
        console.log('API Response Status:', response.status);
        const data = await response.json();
        console.log('API Response Data:', data);

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        // Ensure that the data contains the suggested price
        if (data && data.suggested_price) {
          setSuggestedPrice(data.suggested_price.value);
        } else {
          setSuggestedPrice(null); // If no suggested price, set to null
        }
      } catch (err) {
        console.error('Error fetching suggested price:', err);
        setError(err.message || 'Failed to fetch suggested price');
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedPrice();
  }, [releaseId]);

  return { suggestedPrice, loading, error };
};
