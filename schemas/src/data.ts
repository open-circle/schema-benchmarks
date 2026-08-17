import { assert } from "@schema-benchmarks/utils";
import { create, type Draft } from "mutative";

import type { StringFormat } from "./types.ts";

export interface ImageData {
  id: number;
  created: Date;
  /** 1-100 characters */
  title: string;
  type: "jpg" | "png";
  size: number;
  /** URL format */
  url: string;
}

export interface RatingData {
  id: number;
  /** 1-5 */
  stars: number;
  /** 1-100 characters */
  title: string;
  /** 1-1000 characters */
  text: string;
  images: Array<ImageData>;
}

export interface ProductData {
  id: number;
  created: Date;
  /** 1-100 characters */
  title: string;
  /** 1-30 characters */
  brand: string;
  /** 1-500 characters */
  description: string;
  /** 1-10000 */
  price: number;
  /** 1-100, nullable */
  discount: number | null;
  /** 0-10 */
  quantity: number;
  /** Each 1-30 characters */
  tags: Array<string>;
  images: Array<ImageData>;
  ratings: Array<RatingData>;
}

/**
 * The standard JSON schema benchmarks use a small, JSON representable schema with a codec, so the
 * input and output JSON schemas differ. `Date` is deliberately left out - it has no JSON schema
 * representation, and several libraries refuse to convert it.
 */
export interface JsonSchemaInputData {
  id: number;
  name: string;
  /** encoded as a string */
  price: string;
}

export interface JsonSchemaOutputData extends Omit<JsonSchemaInputData, "price"> {
  price: number;
}

export const jsonSchemaInputData: JsonSchemaInputData = {
  id: 252,
  name: "Apple",
  price: "89",
};

export const jsonSchemaOutputData: JsonSchemaOutputData = {
  ...jsonSchemaInputData,
  price: Number(jsonSchemaInputData.price),
};

/** Representative JSON schema used as input for fromJson conversion benchmarks. */
export const fromJsonBenchSchema = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    price: { type: "string" },
  },
  required: ["id", "name", "price"],
} as const;

export const successData: ProductData = {
  id: 252,
  created: new Date(),
  title: "Apple",
  brand: "Sunny Backyard",
  description: "Red apple from Lake Constance",
  price: 89,
  discount: null,
  quantity: 5,
  tags: ["fruit", "red", "round", "sweet", "juicy", "healthy"],
  images: [
    {
      id: 248,
      created: new Date(),
      title: "Close up of an apple on a tree",
      type: "jpg",
      size: 92357232,
      url: "https://www.example.com/images/248",
    },
    {
      id: 295,
      created: new Date(),
      title: "Our apples in the final packaging",
      type: "jpg",
      size: 83247232,
      url: "https://www.example.com/images/295",
    },
    {
      id: 723,
      created: new Date(),
      title: "Our fruit fields at Lake Constance",
      type: "jpg",
      size: 72356345,
      url: "https://www.example.com/images/723",
    },
  ],
  ratings: [
    {
      id: 315,
      stars: 4.5,
      title: "Tastes super delicious",
      text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
      images: [
        {
          id: 835,
          created: new Date(),
          title: "The result of our apple pie",
          type: "jpg",
          size: 8247493,
          url: "https://www.example.com/images/835",
        },
      ],
    },
    {
      id: 642,
      stars: 5,
      title: "Very tasty! I will buy them again!",
      text: "In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.",
      images: [
        {
          id: 352,
          created: new Date(),
          title: "The fruit salad in a bowl",
          type: "jpg",
          size: 3582543,
          url: "https://www.example.com/images/352",
        },
        {
          id: 465,
          created: new Date(),
          title: "The fruit salad on a plate",
          type: "jpg",
          size: 9824742,
          url: "https://www.example.com/images/465",
        },
      ],
    },
  ],
};

export const errorData: unknown = {
  id: 252,
  created: new Date(),
  title: "", // "Apple"
  brand: "Sunny Backyard",
  description: "Red apple from Lake Constance",
  price: 0, // 89
  discount: null,
  quantity: 1000, // 5
  tags: ["fruit", null, "round", undefined, "juicy", "healthy"], // ["fruit", "red", "round", "sweet", "juicy", "healthy"]
  images: [
    {
      // id: 248,
      created: null, // new Date()
      title: "Close up of an apple on a tree",
      type: "mp4",
      size: 92357232,
      url: "https://www.example.com/images/248",
    },
    {
      id: 295,
      created: new Date(),
      title: "Our apples in the final packaging",
      type: "jpg",
      size: 83247232,
      // url: "https://www.example.com/images/295",
    },
    {
      id: 723,
      created: new Date(),
      title: "Our fruit fields at Lake Constance",
      type: "jpg",
      size: 72356345,
      url: "https://www.example.com/images/723",
    },
  ],
  ratings: [
    {
      id: 315,
      stars: 4.5,
      title:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.", // "Tastes super delicious"
      text: "Tastes super delicious", // "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor."
      images: [
        {
          id: 835,
          created: new Date(),
          title: "The result of our apple pie",
          type: "jpg",
          size: 8247493,
          url: "https://www.example.com/images/835",
        },
      ],
    },
    {
      id: 642,
      stars: 5,
      title: "Very tasty! I will buy them again!",
      text: "In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.",
      images: [
        {
          id: "352", // 352
          created: undefined, // new Date()
          title: "The fruit salad in a bowl",
          type: "jpg",
          size: 3582543,
          url: "INVALID_URL", // "https://www.example.com/images/352"
        },
        {
          id: 465,
          created: new Date(),
          // title: "The fruit salad on a plate",
          // type: "jpg",
          // size: 9824742,
          url: "https://www.example.com/images/465",
        },
      ],
    },
  ],
};

const variant = (mutate: (draft: Draft<ProductData>) => void) => {
  const [draft, finalize] = create(successData);
  mutate(draft);
  return finalize();
};

function getFirst<T>(array: Array<T>): T {
  const first = array[0];
  assert(first !== undefined, "Array is empty");
  return first;
}

/**
 * A specific case for each type of failure that schemas should catch:
 * - type errors
 * - string length errors
 * - numeric range errors
 */
export const failureCases = {
  // Type errors
  "id: not a number": variant((data) => {
    // @ts-expect-error
    data.id = "abc";
  }),
  "created: not a date": variant((data) => {
    // @ts-expect-error
    data.created = {};
  }),
  "title: not a string": variant((data) => {
    // @ts-expect-error
    data.title = 123;
  }),
  "discount: not a number": variant((data) => {
    // @ts-expect-error
    data.discount = {};
  }),
  "price: not a number": variant((data) => {
    // @ts-expect-error
    data.price = "89";
  }),
  "quantity: not a number": variant((data) => {
    // @ts-expect-error
    data.quantity = "5";
  }),
  "stars: not a number": variant((data) => {
    // @ts-expect-error
    getFirst(data.ratings).stars = "4";
  }),
  "image.created: not a date": variant((data) => {
    // @ts-expect-error
    getFirst(data.images).created = {};
  }),
  "image.size: not a number": variant((data) => {
    // @ts-expect-error
    getFirst(data.images).size = {};
  }),
  "image.type: invalid enum": variant((data) => {
    // @ts-expect-error
    getFirst(data.images).type = "gif";
  }),
  "image.url: invalid format": variant((data) => {
    getFirst(data.images).url = "not a url";
  }),

  // String length errors
  "title: too short": variant((data) => {
    data.title = "";
  }),
  "title: too long": variant((data) => {
    data.title = "a".repeat(101);
  }),
  "brand: too short": variant((data) => {
    data.brand = "";
  }),
  "brand: too long": variant((data) => {
    data.brand = "a".repeat(31);
  }),
  "description: too short": variant((data) => {
    data.description = "";
  }),
  "description: too long": variant((data) => {
    data.description = "a".repeat(501);
  }),
  "image.title: too short": variant((data) => {
    getFirst(data.images).title = "";
  }),
  "image.title: too long": variant((data) => {
    getFirst(data.images).title = "a".repeat(101);
  }),
  "rating.title: too short": variant((data) => {
    getFirst(data.ratings).title = "";
  }),
  "rating.title: too long": variant((data) => {
    getFirst(data.ratings).title = "a".repeat(101);
  }),
  "rating.text: too short": variant((data) => {
    getFirst(data.ratings).text = "";
  }),
  "rating.text: too long": variant((data) => {
    getFirst(data.ratings).text = "a".repeat(1001);
  }),
  "tags: item too short": variant((data) => {
    data.tags[0] = "";
  }),
  "tags: item too long": variant((data) => {
    data.tags[0] = "a".repeat(31);
  }),

  // Numeric range errors
  "stars: too small": variant((data) => {
    getFirst(data.ratings).stars = 0;
  }),
  "stars: too big": variant((data) => {
    getFirst(data.ratings).stars = 6;
  }),
  "price: too small": variant((data) => {
    data.price = 0;
  }),
  "price: too big": variant((data) => {
    data.price = 10001;
  }),
  "discount: too small": variant((data) => {
    data.discount = 0;
  }),
  "discount: too big": variant((data) => {
    data.discount = 101;
  }),
  "quantity: too small": variant((data) => {
    data.quantity = -1;
  }),
  "quantity: too big": variant((data) => {
    data.quantity = 11;
  }),
};

/**
 * Cases that should be accepted, but lie on the boundaries of a refinement (e.g. minLength 1 -> 1 char string)
 * Should help catch typos and inconsistencies
 */
export const successCases = {
  "title: shortest": variant((data) => {
    data.title = "a";
  }),
  "title: longest": variant((data) => {
    data.title = "a".repeat(100);
  }),
  "brand: shortest": variant((data) => {
    data.brand = "a";
  }),
  "brand: longest": variant((data) => {
    data.brand = "a".repeat(30);
  }),
  "description: shortest": variant((data) => {
    data.description = "a";
  }),
  "description: longest": variant((data) => {
    data.description = "a".repeat(500);
  }),
  "price: lowest": variant((data) => {
    data.price = 1;
  }),
  "price: highest": variant((data) => {
    data.price = 10_000;
  }),
  "discount: lowest": variant((data) => {
    data.discount = 1;
  }),
  "discount: highest": variant((data) => {
    data.discount = 100;
  }),
  "discount: null": variant((data) => {
    data.discount = null;
  }),
  "quantity: none left": variant((data) => {
    data.quantity = 0;
  }),
  "quantity: highest": variant((data) => {
    data.quantity = 10;
  }),
  "tags: empty": variant((data) => {
    data.tags = [];
  }),
  "tags: item longest": variant((data) => {
    data.tags[0] = "a".repeat(30);
  }),
  "tags: item shortest": variant((data) => {
    data.tags[0] = "a";
  }),
  "images: empty": variant((data) => {
    data.images = [];
  }),
  "ratings: empty": variant((data) => {
    data.ratings = [];
  }),
  "ratings: one star": variant((data) => {
    getFirst(data.ratings).stars = 1;
  }),
  "ratings: all stars": variant((data) => {
    getFirst(data.ratings).stars = 5;
  }),
  "rating.title: shortest": variant((data) => {
    getFirst(data.ratings).title = "a";
  }),
  "rating.text: shortest": variant((data) => {
    getFirst(data.ratings).text = "a";
  }),
  "ratings: text longest": variant((data) => {
    getFirst(data.ratings).text = "a".repeat(1000);
  }),
  "image.title: shortest": variant((data) => {
    getFirst(data.images).title = "a";
  }),
  "image.type: png": variant((data) => {
    getFirst(data.images).type = "png";
  }),
};

export const validStrings: Record<StringFormat, string> = {
  email: "test@example.com",
  url: "https://www.example.com",
  uuid: "20354d7a-e4fe-47af-8ff6-187bca92f3f9",
  ipv4: "192.168.0.1",
  ipv6: "2001:0db8:85a3:08d3:1319:8a2e:0370:7344",
  "date-time": "2021-01-01T00:00:00Z",
  date: "2021-01-01",
  time: "00:00:00Z",
  duration: "P1Y2M3DT4H5M6S",
};

export const invalidStrings: Record<StringFormat, string> = {
  email: "invalid",
  url: "invalid",
  uuid: "invalid",
  ipv4: "invalid",
  ipv6: "invalid",
  "date-time": "invalid",
  date: "invalid",
  time: "invalid",
  duration: "invalid",
};
