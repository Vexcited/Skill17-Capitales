import { t, type Static } from "elysia";

export const CountrySchema = t.Object({
  rank: t.Number(),
  capital: t.String(),
  country: t.String(),
  population: t.Number(),
});

export type Country = Static<typeof CountrySchema>;

export const fromCSV = (csv: string): Array<Country> => {
  const lines = csv.trim().split("\r\n");
  const firstLine = lines.shift();
  const headers = firstLine?.split(",").map((header) => header.trim()) as Array<
    "Rang" | "Capitale" | "Pays" | "Population"
  >;

  return lines.map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const entry = {} as Country;

    headers.forEach((header, index) => {
      switch (header) {
        case "Rang":
          entry.rank = parseInt(values[index]);
          break;
        case "Capitale":
          entry.capital = values[index];
          break;
        case "Pays":
          entry.country = values[index];
          break;
        case "Population":
          entry.population = parseInt(values[index].replace(/ /g, ""));
          break;
      }
    });

    return entry;
  });
};
