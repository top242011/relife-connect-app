
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
} from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '../ui/badge';
import type { Member, MP } from '@/lib/types';
import { Card, CardContent } from '../ui/card';

type DataType = Member | MP;

const getMemberColumns = (): ColumnDef<Member>[] => [
    { 
        accessorKey: 'name', 
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    { 
        accessorKey: 'age', 
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Age
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    { 
        accessorKey: 'gender', 
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Gender
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    { 
        accessorKey: 'location', 
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Location
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    { 
        accessorKey: 'professionalBackground', 
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Profession
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
    },
    {
        accessorKey: 'committeeMemberships',
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Committees
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const committees = row.getValue('committeeMemberships') as string[];
            if (!committees || committees.length === 0) return null;
            return <div className="flex flex-wrap gap-1">{committees.map(c => <Badge key={c} variant="secondary">{c}</Badge>)}</div>
        },
        sortingFn: (rowA, rowB, columnId) => {
            const a = (rowA.getValue(columnId) as string[]).join(', ');
            const b = (rowB.getValue(columnId) as string[]).join(', ');
            return a.localeCompare(b);
        }
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const member = row.original;
            return (
                 <div className="text-right">
                    <Button asChild variant="ghost" className="h-8 w-8 p-0">
                        <Link href={`/members/${member.id}`}> 
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )
        }
    }
];

const getMPColumns = (): ColumnDef<MP>[] => [
    { 
        accessorKey: 'name', 
        header: 'Name' 
    },
    { accessorKey: 'location', header: 'Constituency' },
    { accessorKey: 'parliamentaryRoles', header: 'Role' },
    {
        accessorKey: 'keyPolicyInterests',
        header: 'Policy Interests',
        cell: ({ row }) => {
            const interests = (row.getValue('keyPolicyInterests') as string).split(', ');
            return <div className="flex flex-wrap gap-1">{interests.map(i => <Badge key={i} variant="secondary">{i}</Badge>)}</div>
        }
    },
    { accessorKey: 'votingRecord', header: 'Voting Record' },
    {
        id: 'actions',
        cell: ({ row }) => {
            const mp = row.original;
            return (
                <div className="text-right">
                    <Button asChild variant="ghost" className="h-8 w-8 p-0">
                        <Link href={`/parliament/${mp.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )
        }
    }
];

export function MembersTable({ data, type }: { data: DataType[], type: 'member' | 'mp' }) {
    const columns = React.useMemo(() => (type === 'member' ? getMemberColumns() : getMPColumns()), [type]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Card>
      <CardContent className="p-4">
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                placeholder="Filter by name..."
                value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                    table.getColumn('name')?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
                />
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                            }
                        >
                            {column.id === 'professionalBackground' ? 'Profession' : column.id === 'committeeMemberships' ? 'Committees' : column.id}
                        </DropdownMenuCheckboxItem>
                        );
                    })}
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                        return (
                            <TableHead key={header.id}>
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </TableHead>
                        );
                        })}
                    </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                        >
                        No results.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
