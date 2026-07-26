import type { StringFormat } from "./types.ts";

export interface ImageData {
  id: number;
  created: Date;
  title: string;
  type: "jpg" | "png";
  size: number;
  url: string;
}

export interface RatingData {
  id: number;
  stars: number;
  title: string;
  text: string;
  images: Array<ImageData>;
}

export interface ProductData {
  id: number;
  created: Date;
  title: string;
  brand: string;
  description: string;
  price: number;
  discount: number | null;
  quantity: number;
  tags: Array<string>;
  images: Array<ImageData>;
  ratings: Array<RatingData>;
}

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

function variant(mutate: (data: ProductData) => void): unknown {
  const data = structuredClone(successData);
  mutate(data);
  return data;
}

/**
 * Copies of `successData` that each break exactly one constraint of the specified schema.
 *
 * Every library must reject all of these. A library that accepts one isn't performing a check
 * the others are, so its results aren't comparable - see `constraintGaps` in
 * `test/libraries.node.test.ts` for the deviations we know about and can't express.
 *
 * Values are chosen so that coercion can't rescue them (e.g. `"abc"`, not `"252"`). That rules
 * out a few checks entirely: `tags: [1]` is a type violation everywhere except `joi` and `yup`,
 * which cast it to `"1"` by design.
 */
export const constraintViolations: Record<string, unknown> = {
  "id: not a number": variant((data) => ((data as { id: unknown }).id = "abc")),
  "created: not a Date": variant((data) => ((data as { created: unknown }).created = {})),
  "title: too short": variant((data) => (data.title = "")),
  "title: too long": variant((data) => (data.title = "a".repeat(101))),
  "brand: too long": variant((data) => (data.brand = "a".repeat(31))),
  "description: too long": variant((data) => (data.description = "a".repeat(501))),
  "price: too low": variant((data) => (data.price = 0)),
  "price: too high": variant((data) => (data.price = 10_001)),
  "discount: too low": variant((data) => (data.discount = 0)),
  "discount: too high": variant((data) => (data.discount = 101)),
  "quantity: negative": variant((data) => (data.quantity = -1)),
  "quantity: too high": variant((data) => (data.quantity = 11)),
  "tags: item too short": variant((data) => (data.tags[0] = "")),
  "tags: item too long": variant((data) => (data.tags[0] = "a".repeat(31))),
  "images: not an array": variant((data) => ((data as { images: unknown }).images = {})),
  "images: missing property": variant((data) => delete (data.images[0] as Partial<ImageData>).url),
  "images: unknown enum member": variant(
    (data) => ((data.images[0] as { type: unknown }).type = "gif"),
  ),
  "images: malformed url": variant((data) => (data.images[0]!.url = "nope")),
  "images: created not a Date": variant(
    (data) => ((data.images[0] as { created: unknown }).created = {}),
  ),
  "ratings: stars negative": variant((data) => (data.ratings[0]!.stars = -1)),
  "ratings: stars too high": variant((data) => (data.ratings[0]!.stars = 6)),
  "ratings: text too long": variant((data) => (data.ratings[0]!.text = "a".repeat(1001))),
  "ratings: nested image malformed url": variant(
    (data) => (data.ratings[0]!.images[0]!.url = "nope"),
  ),
};

/**
 * Copies of `successData` sitting exactly on a bound of the specified schema.
 *
 * Every library must accept all of these. A library that rejects one is stricter than the schema
 * we specified, so it isn't validating the same thing as the others - which is how `stars` and
 * `quantity` ended up with a minimum of 1 in a third of the libraries and 0 in the rest.
 */
export const constraintBoundaries: Record<string, unknown> = {
  "title: shortest": variant((data) => (data.title = "a")),
  "title: longest": variant((data) => (data.title = "a".repeat(100))),
  "brand: longest": variant((data) => (data.brand = "a".repeat(30))),
  "description: longest": variant((data) => (data.description = "a".repeat(500))),
  "price: lowest": variant((data) => (data.price = 1)),
  "price: highest": variant((data) => (data.price = 10_000)),
  "discount: lowest": variant((data) => (data.discount = 1)),
  "discount: highest": variant((data) => (data.discount = 100)),
  "quantity: none left": variant((data) => (data.quantity = 0)),
  "quantity: highest": variant((data) => (data.quantity = 10)),
  "tags: empty": variant((data) => (data.tags = [])),
  "tags: item longest": variant((data) => (data.tags[0] = "a".repeat(30))),
  "images: empty": variant((data) => (data.images = [])),
  "ratings: empty": variant((data) => (data.ratings = [])),
  "ratings: no stars": variant((data) => (data.ratings[0]!.stars = 0)),
  "ratings: all stars": variant((data) => (data.ratings[0]!.stars = 5)),
  "ratings: text longest": variant((data) => (data.ratings[0]!.text = "a".repeat(1000))),
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
