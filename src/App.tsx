import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import "./App.css";
import {useFetchData}  from "./hooks/useFetchData";

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
const fallbackData: GasStation[] = [
  {
    street: "Sandkaule",
    houseNumber: 13,
    zipCode: 53111,
    city: "Bonn",
    geometry: {
      x: 6.960644911005172,
      y: 50.916095041454554,
    },
  },
];
function App() {
  const columnHelper = createColumnHelper<GasStation>();

  const columns = [
    columnHelper.accessor("street", {
      id: "street",
      cell: (info) => info.getValue(),
      header: () => <span>Straße</span>,
    }),
    columnHelper.accessor("houseNumber", {
      id: "houseNumber",
      cell: (info) => info.getValue().toString(),
      header: () => <span>Hausnummer</span>
    }),
    columnHelper.accessor("zipCode", {
      id: "zipCode",
      cell: (info) => info.getValue().toString(),
      header: () => <span>PLZ</span>
    }),
    columnHelper.accessor("city", {
      id: "city",
      cell: (info) => info.getValue(),
      header: () => <span>Stadtteil</span>
    })
  ];
  const {data, error, isLoading} = useFetchData();

  const table = useReactTable({
    data: data || fallbackData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

   if(error) return <div>Request failed!</div>
  if(isLoading) return <div>...Loading</div>

  return (
    <>
      <h1>Der Tankstellen Finder</h1>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-center rtl:text-right">
          <thead className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="even:bg-gray-100 odd:bg-white border-b">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default App;
