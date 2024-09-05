import {
  Column,
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
import { useEffect, useMemo, useState } from "react";

declare module "@tanstack/react-table" {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "range" | "select";
  }
}

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

  if (error) return <div>Request failed!</div>;
  if (isLoading) return <div>...Loading</div>;

  return (
    <div className="flex flex-col">
      <h1 className="mx-auto font-bold text-xl py-3">Der Tankstellen Finder</h1>
      <div className="relative overflow-x-auto mx-auto">
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
                            <Filter column={header.column} />
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
      </div>
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue()
  const { filterVariant } = column.columnDef.meta ?? {}

  return filterVariant === 'range' ? (
    <div>
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === 'select' ? (
    <select
      onChange={e => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      {/* See faceted column filters example for dynamic select options */}
      <option value="">All</option>
      <option value="complicated">complicated</option>
      <option value="relationship">relationship</option>
      <option value="single">single</option>
    </select>
  ) : (
    <DebouncedInput
      className="w-36 border shadow rounded"
      onChange={value => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? '') as string}
    />
    // See faceted column filters example for datalist search suggestions
  )
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

export default App;
