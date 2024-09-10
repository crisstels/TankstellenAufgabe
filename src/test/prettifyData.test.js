import { expect, test } from "vitest";
import { prettifyDataSet } from "../utils/prettifyData";

const testData = [
  {
    attributes: {
      objectid: 1,
      adresse: "Bonner Str. 98 (50677 Neustadt/Süd)",
    },
    geometry: { x: 6.960644911005172, y: 50.916095041454554 },
  },
];

const notValidData = [
  {
    attributes: { objectid: 2, adresse: "Sandkaule1353111Bonn" },
    geometry: { x: 6.960644911005172, y: 50.916095041454554 },
  },
];

test("moves address attributes to separate keys", () => {
  expect(prettifyDataSet(testData)).toStrictEqual([
    {
      street: "Bonner Str. ",
      houseNumber: 98,
      zipCode: 50677,
      city: "Neustadt/Süd",
      geometry: { x: 6.960644911005172, y: 50.916095041454554 },
    },
  ]);
});

test("should return empty array if there is no data", () => {
  expect(prettifyDataSet([])).toStrictEqual([]);
});

test("should return empty array when adresse is not valid", () => {
  expect(prettifyDataSet(notValidData)).toStrictEqual([]);
});

test("should at least return one object when some data is not valid", () => {
  expect(prettifyDataSet([testData[0], notValidData[0]])).toStrictEqual([
    {
      street: "Bonner Str. ",
      houseNumber: 98,
      zipCode: 50677,
      city: "Neustadt/Süd",
      geometry: { x: 6.960644911005172, y: 50.916095041454554 },
    },
  ]);
});
