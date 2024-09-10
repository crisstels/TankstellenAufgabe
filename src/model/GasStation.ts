export type GasStation = {
    street: string;
    houseNumber: number;
    zipCode: number;
    city: string;
    geometry: {
      x: number;
      y: number;
    };
  };