"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  useReactTable,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, EllipsisVerticalIcon } from "lucide-react"

import type { DynamicDataTableProps, ViewMode } from "../types/table.types"
import type { DynamicColumnDef } from "../types/column.types"
import { ImageCell } from "../cells/image-cell"
import { EditableCell } from "../cells/editable-cell"
import { DragHandle } from "./drag-handle"
import { DraggableRow } from "./draggable-row"
import { TableToolbar } from "./table-toolbar"
import { TableFooter } from "./table-footer"

// --- HELPER FOR NESTED UPDATES ---
function setNestedValue<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const newObj = structuredClone(obj)
  const keys = path.split(".")
  let current: Record<string, unknown> = newObj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!current[key]) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
  return newObj
}

interface ExtendedDataTableProps<TData extends Record<string, unknown>>
  extends DynamicDataTableProps<TData> {
  onSave?: (data: TData[]) => void
  onDeleteSelected?: (selectedRows: TData[]) => void
  isLoading?: boolean
}

export function DynamicDataTable<TData extends Record<string, unknown>>(
  props: ExtendedDataTableProps<TData>
) {
  const {
    data: initialData,
    columnConfig,
    rowIdKey,
    enableRowSelection = false,
    enableRowDrag = false,
    enableColumnVisibility = true,
    enableGlobalFilter = true,
    viewMode: initialViewMode = "comfortable",
    toolbarTitle,
    toolbarSubtitle,
    onViewRow,
    onEditRow,
    onDeleteRow,
    onDataChange,
    onAddRow,
    onSave,
    onDeleteSelected,
    isLoading = false,
  } = props

  // -- STATE --
  const [data, setData] = React.useState<TData[]>(() => initialData)
  const [originalData, setOriginalData] = React.useState<TData[]>(() => initialData)
  const [viewMode, setViewMode] = React.useState<ViewMode>(initialViewMode)
  const isInternalChange = React.useRef(false)

  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [globalFilter, setGlobalFilter] = React.useState<string>("")

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const densityClass = React.useMemo(() => getDensityClass(viewMode), [viewMode])

  // -- EFFECTS --
  React.useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }
    setData(initialData)
    setOriginalData(initialData)
  }, [initialData])

  const hasUnsavedChanges = React.useMemo(() => {
    return JSON.stringify(data) !== JSON.stringify(originalData)
  }, [data, originalData])

  // -- HANDLERS --
  const updateCell = React.useCallback(
    (rowId: string | number, accessorKey: keyof TData & string, value: unknown) => {
      isInternalChange.current = true
      const nextData = data.map((row) => {
        if (String(row[rowIdKey]) === String(rowId)) {
          if (accessorKey.includes(".")) {
            return setNestedValue(row, accessorKey, value)
          }
          return { ...row, [accessorKey]: value }
        }
        return row
      })
      setData(nextData)
      if (onDataChange) onDataChange(nextData)
    },
    [data, onDataChange, rowIdKey]
  )

  const handleBatchDelete = React.useCallback(() => {
    if (!onDeleteSelected) return
    isInternalChange.current = true
    const selectedIds = new Set(Object.keys(rowSelection))
    const rowsToDelete = data.filter((row) => selectedIds.has(String(row[rowIdKey])))
    const nextData = data.filter((row) => !selectedIds.has(String(row[rowIdKey])))
    onDeleteSelected(rowsToDelete)
    onDataChange?.(nextData)
    setData(nextData)
    setOriginalData(nextData)
    setRowSelection({})
  }, [data, rowSelection, onDeleteSelected, onDataChange, rowIdKey])

  const handleSave = React.useCallback(() => {
    onSave?.(data)
    setOriginalData(data)
  }, [data, onSave])


  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data.map((row) => String(row[rowIdKey])),
    [data, rowIdKey]
  )

  const columns = React.useMemo(
    () =>
      buildColumns<TData>({
        columnConfig,
        enableRowDrag,
        enableRowSelection,
        onViewRow,
        onEditRow,
        onDeleteRow,
        rowIdKey,
        updateCell,
      }),
    [columnConfig, enableRowDrag, enableRowSelection, onViewRow, onEditRow, onDeleteRow, rowIdKey, updateCell]
  )

  const defaultColumn = React.useMemo<Partial<ColumnDef<TData, unknown>>>(
    () => ({ minSize: 50, maxSize: 500 }), []
  )

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable<TData>({
    data,
    columns,
    defaultColumn,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination, globalFilter },
    getRowId: (row) => String(row[rowIdKey]),
    enableRowSelection,
    filterFromLeafRows: true,
    autoResetPageIndex: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onGlobalFilterChange: (val) => setGlobalFilter(String(val ?? "")),
    getCoreRowModel: getCoreRowModel<TData>(),
    getFilteredRowModel: getFilteredRowModel<TData>(),
    getPaginationRowModel: getPaginationRowModel<TData>(),
    getSortedRowModel: getSortedRowModel<TData>(),
    getFacetedRowModel: getFacetedRowModel<TData>(),
    getFacetedUniqueValues: getFacetedUniqueValues<TData>(),
  })

  const handleExport = React.useCallback(() => {
    const exportableColumns = table.getVisibleFlatColumns().filter(
      (col) =>
        col.id !== "__select__" &&
        col.id !== "__drag__" &&
        col.id !== "__actions__"
    )
    const headers = exportableColumns.map((col) => {
      const headerVal = col.columnDef.header
      return typeof headerVal === "string" ? headerVal : col.id
    })
    const rows = table.getFilteredRowModel().rows.map((row) =>
      exportableColumns
        .map((col) => {
          const val = row.getValue(col.id)
          let cellData = ""
          if (val instanceof Date) {
             cellData = val.toISOString()
          } else if (typeof val === 'object' && val !== null) {
             cellData = JSON.stringify(val)
          } else {
             cellData = String(val ?? "")
          }
          return `"${cellData.replace(/"/g, '""')}"`
        })
        .join(",")
    )
    const csvContent = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `export_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [table])

  const handleDragEnd = (event: DragEndEvent): void => {
    if (!enableRowDrag) return
    const { active, over } = event
    if (!over || active.id === over.id) return
    isInternalChange.current = true
    const oldIndex = data.findIndex((item) => String(item[rowIdKey]) === active.id)
    const newIndex = data.findIndex((item) => String(item[rowIdKey]) === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const nextData = arrayMove(data, oldIndex, newIndex)
    setData(nextData)
    if (onDataChange) onDataChange(nextData)
  }

  // Define utility columns to remove padding from
  const utilityCols = ["__select__", "__drag__", "__actions__"]

  return (
    <Tabs defaultValue="table" className="flex w-full flex-col gap-4">
      <TableToolbar
        table={table}
        columnConfig={columnConfig}
        enableGlobalFilter={enableGlobalFilter}
        globalFilter={globalFilter}
        onGlobalFilterChange={setGlobalFilter}
        enableColumnVisibility={enableColumnVisibility}
        title={toolbarTitle}
        subtitle={toolbarSubtitle}
        onAddRow={onAddRow}
        onSave={onSave ? handleSave : undefined}
        onDeleteSelected={onDeleteSelected ? handleBatchDelete : undefined}
        onExport={handleExport}
        hasChanges={hasUnsavedChanges}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <TabsContent value="table" className="relative flex flex-col gap-3 px-2 pb-2 sm:px-4">
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={enableRowDrag ? [restrictToVerticalAxis] : []}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className={densityClass}>
                    {headerGroup.headers.map((header) => {
                      // Check if this is a utility column
                      const isUtility = utilityCols.includes(header.column.id)
                      
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          // FIX: Apply px-0 if it's a utility column to ensure perfect center alignment
                          className={cn(
                            "whitespace-nowrap font-medium",
                            densityClass,
                            isUtility && "px-0 text-center" 
                          )}
                          style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={cn(
                                "flex items-center space-x-2",
                                // If it's a utility column, force center justification
                                isUtility ? "justify-center" : "",
                                header.column.getCanSort() ? "cursor-pointer select-none" : ""
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              {header.column.getCanSort() && (
                                <span className="ml-1">
                                  {{
                                    asc: <ArrowUpIcon className="h-3.5 w-3.5" />,
                                    desc: <ArrowDownIcon className="h-3.5 w-3.5" />,
                                  }[header.column.getIsSorted() as string] ?? (
                                    <ArrowUpDownIcon className="h-3.5 w-3.5 opacity-50" />
                                  )}
                                </span>
                              )}
                            </div>
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i} className={densityClass}>
                       {table.getVisibleFlatColumns().map((col) => (
                         <TableCell key={col.id}>
                            <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                         </TableCell>
                       ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length > 0 ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} densityClass={densityClass} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={table.getAllLeafColumns().length} className="h-24 text-center text-sm text-muted-foreground">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <TableFooter table={table} />
      </TabsContent>
    </Tabs>
  )
}

// ... Build Columns Functions ...
interface BuildColumnsParams<TData extends Record<string, unknown>> {
  columnConfig: DynamicColumnDef<TData, unknown>[]
  enableRowDrag: boolean
  enableRowSelection: boolean
  onViewRow?: (row: TData) => void
  onEditRow?: (row: TData) => void
  onDeleteRow?: (row: TData) => void
  rowIdKey: keyof TData & string
  updateCell: (rowId: string | number, accessorKey: keyof TData & string, value: unknown) => void
}

function buildColumns<TData extends Record<string, unknown>>({
  columnConfig,
  enableRowDrag,
  enableRowSelection,
  onViewRow,
  onEditRow,
  onDeleteRow,
  rowIdKey,
  updateCell,
}: BuildColumnsParams<TData>): ColumnDef<TData, unknown>[] {
  const baseCols: DynamicColumnDef<TData, unknown>[] = columnConfig.map((col) => {
      const accessorKey = col.accessorKey
      const enhanced: DynamicColumnDef<TData, unknown> = { ...col }

      if (!enhanced.id && accessorKey) {
        enhanced.id = accessorKey
      }

      if (!enhanced.cell && col.displayMode && accessorKey) {
        enhanced.cell = ({ row }) => (
          <ImageCell row={row.original} imageKey={accessorKey} altKey={col.imageAltKey} displayMode={col.displayMode} imageSize={col.imageSize} />
        )
      }

      if (col.editable && accessorKey) {
        enhanced.cell = ({ row, getValue }) => {
          const rowId = row.original[rowIdKey] as string | number
          const value = getValue()
          return (
            <EditableCell<TData, unknown> 
              value={value} 
              row={row.original} 
              rowId={rowId} 
              accessorKey={accessorKey} 
              onChange={(val) => updateCell(rowId, accessorKey, val)} 
              col={col} 
            />
          )
        }
      }
      return enhanced
    })

  const finalCols: ColumnDef<TData, unknown>[] = []

  if (enableRowDrag) {
    finalCols.push({
      id: "__drag__",
      header: () => null,
      enableHiding: false,
      enableSorting: false,
      size: 40,
      cell: () => (
        <div className="flex h-full w-full items-center justify-center">
          <DragHandle />
        </div>
      ),
    })
  }

  if (enableRowSelection) {
    finalCols.push({
      id: "__select__",
      enableHiding: false,
      enableSorting: false,
      size: 40,
      header: ({ table }) => (
        <div className="flex h-full w-full items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="translate-y-0.5"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex h-full w-full items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        </div>
      ),
    })
  }

  finalCols.push(...baseCols)

  if (onViewRow || onEditRow || onDeleteRow) {
    finalCols.push({
      id: "__actions__",
      enableHiding: false,
      enableSorting: false,
      size: 40,
      cell: ({ row }) => {
        const rowData = row.original
        return (
          <div className="flex h-full w-full items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 text-muted-foreground data-[state=open]:bg-muted">
                  <EllipsisVerticalIcon className="size-4" />
                  <span className="sr-only">Open row actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {onViewRow && <DropdownMenuItem onClick={() => onViewRow(rowData)}>View</DropdownMenuItem>}
                {onEditRow && <DropdownMenuItem onClick={() => onEditRow(rowData)}>Edit</DropdownMenuItem>}
                {onDeleteRow && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDeleteRow(rowData)}>Delete</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    })
  }
  return finalCols
}

function getDensityClass(viewMode: ViewMode): string {
  switch (viewMode) {
    case "compact":
      return "h-8 text-xs [&_th]:px-2 [&_td]:px-2"
    case "spacious":
      return "h-14 text-sm [&_th]:px-4 [&_td]:px-4"
    case "comfortable":
    default:
      return "h-11 text-sm [&_th]:px-4 [&_td]:px-4"
  }
}