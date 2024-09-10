import { useQuery } from "@tanstack/react-query";
import { prettifyDataSet } from "../utils/prettifyData";
const url =
  "https://geoportal.stadt-koeln.de/arcgis/rest/services/verkehr/gefahrgutstrecken/MapServer/0/query?where=objectid+is+not+null&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson";

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
