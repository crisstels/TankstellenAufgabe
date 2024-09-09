import { useQuery } from "@tanstack/react-query";
const url =
  "https://geoportal.stadt-koeln.de/arcgis/rest/services/verkehr/gefahrgutstrecken/MapServer/0/query?where=objectid+is+not+null&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson";

type GasStationDataSet = {
  attributes: {
    objectid: number;
    adresse: string;
  };
  geometry: {
    x: number;
    y: number;
  };
};

type GasStation = {
  street: string;
  houseNumber: number;
  zipCode: number;
  city: string;
  geometry: {
    x: number;
    y: number;
  };
};

// fetch gas station data from open data cologne
export function useFetchData() {
  return useQuery({
    queryKey: ["gasStation"],
    queryFn: async () => {
      const data = await fetch(url);

      const jsonData = await data.json();
      const myData = prettifyDataSet(jsonData.features);
      console.log(myData);

      return myData;
    },
  });
}

// move attributes for address in seperate keys
function prettifyDataSet(data: GasStationDataSet[]): GasStation[] {
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
