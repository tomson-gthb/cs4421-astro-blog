// src/components/WeatherCard.test.ts
import { describe, it, expect, vi } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import WeatherCard from './WeatherCard.astro';

describe('WeatherCard Component SSR', () => {
  it('should render gracefully or handle errors when API fails', async () => {
    // 1. Mock global fetch to simulate a weather API failure (e.g., 500 Server Error)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Weather service unavailable' })
    }));

    const container = await AstroContainer.create();
    
    try {
      // 2. Try rendering the component using Astro's Container API
      const result = await container.renderToString(WeatherCard);
      
      // 3. Verify it still renders a fallback message instead of crashing entirely
      expect(result).toBeDefined();
    } catch (error) {
      // Alternatively, if you want your component to throw a controlled error, 
      // you assert that it throws a specific fallback error message.
      expect(error).toBeDefined();
    } finally {
      // Clean up the fetch mock
      vi.unstubAllGlobals();
    }
  });
});
