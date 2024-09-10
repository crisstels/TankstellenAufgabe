import {
  ColumnDef,
  ColumnFiltersState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import "./App.css";
import { useFetchData } from "./hooks/useFetchData";
import { useMemo, useState } from "react";
import { ColumnFilter } from "./Components/ColumnFilter";
import ErrorPage from "./Components/Error";
import { NavLink } from "react-router-dom";


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
      x: 7.1027216,
      y: 50.7385753,
    },
  },
];

// main app
function App() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columnHelper = createColumnHelper<GasStation>();

  const columns = useMemo<ColumnDef<GasStation, any>[]>(() =>[
    columnHelper.accessor("street", {
      id: "street",
      cell: (info) => info.getValue(),
      header: () => <span>Straße</span>,
    }),
    columnHelper.accessor("houseNumber", {
      id: "houseNumber",
      cell: (info) => info.getValue().toString(),
      header: () => <span>Hausnummer</span>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("zipCode", {
      id: "zipCode",
      cell: (info) => info.getValue().toString(),
      header: () => <span>PLZ</span>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("city", {
      id: "city",
      cell: (info) => info.getValue(),
      header: () => <span>Stadtteil</span>,
      enableColumnFilter: false,
    }),
    columnHelper.accessor("geometry", {
      id: "mapsLink",
      cell: ({row}) => {return <NavLink to={`https://maps.google.com/?ll=${row.original.geometry.y.toString()},${row.original.geometry.x.toString()}`} className="text-blue-500" target="_blank">Öffne Karte</NavLink>},
      header: () => <span>Link zu Google Maps</span>,
      enableColumnFilter: false,
      enableSorting: false,
    })
  ], []);


  const { data, error, isLoading } = useFetchData();

  const table = useReactTable({
    data: data || fallbackData,
    columns,
    filterFns: {},
    state: {columnFilters,},
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (error) return <ErrorPage message={error.message}></ErrorPage>;
  if (isLoading) return <div>Daten werden geladen...</div>;

  return (
    <div className="flex flex-col">
      <h1 className="mx-auto font-bold text-xl py-3">Der Kölner Tankstellen Finder ⛽</h1>
      <div className="relative overflow-x-auto mx-auto pt-3">
        <table className="w-32 text-sm text-center rtl:text-right">
          <thead className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-6 py-3">
                    {header.isPlaceholder
                      ? null
                      : (<>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                
                        </div>
                        {header.column.getCanFilter() ? (
                          <div>
                            <ColumnFilter column={header.column} />
                          </div>
                        ) : null}
                      </>)}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="even:bg-gray-100 odd:bg-white border-b"
              >
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
        <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[5, 10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      </div>
    </div>
  );
}

export default App;
