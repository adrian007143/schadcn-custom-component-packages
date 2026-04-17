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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon, EllipsisVerticalIcon, InboxIcon } from "lucide-react"

import type { DataGridProps, ViewMode } from "../types/table"
import type { DataGridColumn } from "../types/columns"
import { AvatarCell } from "../cells/AvatarCell"
import { EditableTextCell } from "../cells/EditableTextCell"
import { RowDragHandle } from "./RowDragHandle"
import { SortableRow } from "./SortableRow"
import { DataGridToolbar } from "./DataGridToolbar"
import { DataGridFooter } from "./DataGridFooter"

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
  extends DataGridProps<TData> {
  onSave?: (data: TData[]) => void
  onDeleteSelected?: (selectedRows: TData[]) => void
  isLoading?: boolean
}

export function DataGrid<TData extends Record<string, unknown>>(
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
  const [pendingDeleteRow, setPendingDeleteRow] = React.useState<TData | null>(null)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false)

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

  const selectedRows = React.useMemo(
    () =>
      data.filter((row) => rowSelection[String(row[rowIdKey])]),
    [data, rowIdKey, rowSelection]
  )

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

  const selectedRowCount = selectedRows.length

  const handleConfirmRowDelete = React.useCallback(() => {
    if (!pendingDeleteRow || !onDeleteRow) return
    onDeleteRow(pendingDeleteRow)
    setPendingDeleteRow(null)
  }, [onDeleteRow, pendingDeleteRow])

  const handleConfirmBulkDelete = React.useCallback(() => {
    handleBatchDelete()
    setIsBulkDeleteOpen(false)
  }, [handleBatchDelete])

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
        onDeleteRow: onDeleteRow ? setPendingDeleteRow : undefined,
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
    <>
      <Tabs defaultValue="table" className="flex w-full flex-col gap-4">
      <DataGridToolbar
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
        onDeleteSelected={
          onDeleteSelected
            ? () => setIsBulkDeleteOpen(true)
            : undefined
        }
        onExport={handleExport}
        hasChanges={hasUnsavedChanges}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <TabsContent value="table" className="relative flex flex-col gap-3 px-2 pb-2 sm:px-4">
        <div className="overflow-hidden rounded-xl border border-border/70 bg-background shadow-sm">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={enableRowDrag ? [restrictToVerticalAxis] : []}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <Table>
              <TableHeader className="sticky top-0 z-10 border-b border-border/70 bg-muted/60 backdrop-blur-sm">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className={cn(densityClass, "hover:bg-transparent border-0")}>
                    {headerGroup.headers.map((header) => {
                      const isUtility = utilityCols.includes(header.column.id)
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          className={cn(
                            "whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                            densityClass,
                            isUtility && "px-0 text-center"
                          )}
                          style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={cn(
                                "flex items-center gap-1.5",
                                isUtility ? "justify-center" : "",
                                header.column.getCanSort()
                                  ? "cursor-pointer select-none rounded px-1 -ml-1 hover:text-foreground transition-colors"
                                  : ""
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span>
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              {header.column.getCanSort() && (
                                <span className="text-muted-foreground/50">
                                  {{
                                    asc: <ArrowUpIcon className="h-3 w-3 text-primary" />,
                                    desc: <ArrowDownIcon className="h-3 w-3 text-primary" />,
                                  }[header.column.getIsSorted() as string] ?? (
                                    <ArrowUpDownIcon className="h-3 w-3" />
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
                    <TableRow key={i} className={cn(densityClass, "border-border/50")}>
                      {table.getVisibleFlatColumns().map((col) => (
                        <TableCell key={col.id} className="py-3">
                          <div className="h-4 w-full animate-pulse rounded-md bg-muted/60" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows.length > 0 ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <SortableRow key={row.id} row={row} densityClass={cn(densityClass, "border-border/50 transition-colors hover:bg-muted/30")} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow className="hover:bg-transparent">
                    <TableCell
                      colSpan={table.getAllLeafColumns().length}
                      className="h-36 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                        <InboxIcon className="h-8 w-8 opacity-30" />
                        <p className="text-sm">No results found.</p>
                        <p className="text-xs opacity-60">Try adjusting your search or filters.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <DataGridFooter table={table} />
      </TabsContent>
      </Tabs>

      <AlertDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete selected rows?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedRowCount === 0
                ? "No rows are currently selected."
                : `This will permanently remove ${selectedRowCount} selected row${selectedRowCount === 1 ? "" : "s"}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={selectedRowCount === 0}
              onClick={handleConfirmBulkDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={pendingDeleteRow !== null}
        onOpenChange={(open: boolean) => {
          if (!open) setPendingDeleteRow(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this row?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRowDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ... Build Columns Functions ...
interface BuildColumnsParams<TData extends Record<string, unknown>> {
  columnConfig: DataGridColumn<TData, unknown>[]
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
  const baseCols: DataGridColumn<TData, unknown>[] = columnConfig.map((col) => {
      const accessorKey = col.accessorKey
      const enhanced: DataGridColumn<TData, unknown> = { ...col }

      if (!enhanced.id && accessorKey) {
        enhanced.id = accessorKey
      }

      if (!enhanced.cell && col.displayMode && accessorKey) {
        enhanced.cell = ({ row }) => (
          <AvatarCell row={row.original} imageKey={accessorKey} altKey={col.imageAltKey} displayMode={col.displayMode} imageSize={col.imageSize} />
        )
      }

      if (col.editable && accessorKey) {
        enhanced.cell = ({ row, getValue }) => {
          const rowId = row.original[rowIdKey] as string | number
          const value = getValue()
          return (
            <EditableTextCell<TData, unknown> 
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
          <RowDragHandle />
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
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => onDeleteRow(rowData)}
                    >
                      Delete
                    </DropdownMenuItem>
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

/** @deprecated Use DataGrid instead. */
export const DynamicDataTable = DataGrid
