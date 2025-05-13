import { describe, expect, it } from 'bun:test'
import app from ".";

describe('Country API', () => {
  it("gets countries", async () => {
    const response = await app
      .handle(new Request('http://localhost:8100/v1/api/countries', { method: "GET" }));

    expect(response.status).toBe(200);

    const countries = await response.json();
    expect(countries).toBeInstanceOf(Array);
    expect(countries.length).toBe(191);

    for (const country of countries) {
      expect(country).toHaveProperty('rank');
      expect(country).toHaveProperty('capital');
      expect(country).toHaveProperty('country');
      expect(country).toHaveProperty('population');

      expect(country.rank).toBeGreaterThanOrEqual(1);
      expect(country.capital).not.toBeEmpty();
      expect(country.country).not.toBeEmpty();
      expect(country.population).toBeGreaterThanOrEqual(1);
    }
  });

  it("creates a country", async () => {
    const data = {
      rank: 194,
      capital: "New Country",
      country: "New Country",
      population: 1_000_000
    };

    const response = await app
      .handle(new Request('http://localhost:8100/v1/api/countries', {
        method: "POST",
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }));

    expect(response.status).toBe(201);

    const country = await response.json();

    expect(country).toHaveProperty('rank');
    expect(country).toHaveProperty('capital');
    expect(country).toHaveProperty('country');
    expect(country).toHaveProperty('population');

    expect(country.rank).toBe(194);
    expect(country.capital).toBe("New Country");
    expect(country.country).toBe("New Country");
    expect(country.population).toBe(1_000_000);
  });

  it("updates a country from rank", async () => {
    const data = {
      rank: 194,
      capital: "New Capital",
      country: "New Country",
      population: 1_000_000
    };

    const response = await app
      .handle(new Request('http://localhost:8100/v1/api/countries/194', {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      }));

    expect(response.status).toBe(200);

    const country = await response.json();

    expect(country).toHaveProperty('rank');
    expect(country).toHaveProperty('capital');
    expect(country).toHaveProperty('country');
    expect(country).toHaveProperty('population');

    expect(country.rank).toBe(194);
    expect(country.capital).toBe("New Capital");
    expect(country.country).toBe("New Country");
    expect(country.population).toBe(1_000_000);
  });
})
