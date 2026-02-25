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

export const validStrings: Record<StringFormat, string> = {
  email: "test@example.com",
  url: "https://www.example.com",
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  ipv4: "192.168.0.1",
  ipv6: "2001:0db8:85a3:08d3:1319:8a2e:0370:7344",
  "date-time": "2021-01-01T00:00:00Z",
  date: "2021-01-01",
  time: "00:00:00Z",
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
};
