import { GasStation } from "../model/GasStation";
import { GasStationDataSet } from "../model/GasStationDataSet";

// move attributes for address in seperate keys
export function prettifyDataSet(data: GasStationDataSet[]): GasStation[] {
    let newData: GasStation[] = [];
    const regex = /^([^\d]+)(\d+) \((\d+) ([^)]+)\)$/;
  
    data.map((element: GasStationDataSet) => {
      const matches = element.attributes.adresse.match(regex);
      if (matches != null) {
        let temp: GasStation = {
          street: matches[1],
          houseNumber: parseInt(matches[2]),
          zipCode: parseInt(matches[3]),
          city: matches[4],
          geometry: element.geometry,
        };
        newData = [...newData, temp];
      }
    });
  
    return newData;
  }