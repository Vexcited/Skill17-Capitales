import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'

import data_csv from "./assets/data.csv" with { type: "file" };
import { CountrySchema, fromCSV } from "./from-csv";

const buffer = await Bun.file(data_csv).arrayBuffer();
const csv = new TextDecoder("latin1").decode(buffer);
const countries = fromCSV(csv);

const v1 = new Elysia({ prefix: "/v1/api" })
  .get("/countries", () => countries, {
    detail: {
      description: "Retrieve a list of countries",
    },
    response: t.Array(CountrySchema)
  })
  .post("/countries", ({ body, status }) => {
    countries.push(body);
    return status(201, body);
  }, {
    detail: {
      description: "Create a new country",
    },

    body: CountrySchema,
    response: {
      201: CountrySchema,
      400: t.Null()
    },

    error({ set }) {
      set.status = 400;
    }
  })
  .get("/countries/:rank", ({ params: { rank } }) => {
    // NOTE: d'après le fichier openapi, on ne traite pas le 404.
    return countries.find((country) => country.rank === rank)!;
  }, {
    detail: {
      description: "Retrieve information about a specific country",
    },
    params: t.Object({
      rank: t.Number({ description: "Country rank", minimum: 1 })
    }),
    response: CountrySchema
  })
  .put("/countries/:rank", ({ params: { rank }, body, status }) => {
    const index = countries.findIndex((country) => country.rank === rank);
    if (index === -1) return status(400, null);

    countries[index] = {
      ...body,
      rank // NOTE: on ne modifie pas le rank !
    };

    return status(200, countries[index]);
  }, {
    detail: {
      description: "Update information of an existing country"
    },
    params: t.Object({
      rank: t.Number({ description: "Country rank", minimum: 1 })
    }),
    body: CountrySchema,
    response: {
      200: CountrySchema,
      400: t.Null(),
    },
    error({ set }) {
      set.status = 400;
    }
  })

export default new Elysia()
  .use(swagger({
    documentation: {
      info: {
        title: "Country Data API",
        description: "RESTful API for retrieving country data",
        version: "1.0.0",
      }
    }
  }))
  .use(v1)
  .listen(8100, () => void 0);
