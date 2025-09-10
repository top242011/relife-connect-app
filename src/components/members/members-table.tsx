'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ArrowUpDown,
  ChevronDown,
  Eye,
  PlusCircle,
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
import { useLanguage } from '@/hooks/use-language';
import { NewMemberForm } from './new-member-form';

type DataType = Member | MP;

const getMemberColumns = (t: (key: string) => string): ColumnDef<Member>[] => [
    { 
        accessorKey: 'name', 
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {t('name')}
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
              {t('age')}
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
              {t('gender')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => t(row.getValue('gender') as any)
    },
    { 
        accessorKey: 'location', 
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {t('location')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
         cell: ({ row }) => t(row.getValue('location') as any)
    },
    { 
        accessorKey: 'professionalBackground', 
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {t('profession')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
         cell: ({ row }) => t(row.getValue('professionalBackground') as any)
    },
    {
        accessorKey: 'committeeMemberships',
        header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              {t('committees')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const committees = row.getValue('committeeMemberships') as string[];
            if (!committees || committees.length === 0) return null;
            return <div className="flex flex-wrap gap-1">{committees.map(c => <Badge key={c} variant="secondary">{t(c as any)}</Badge>)}</div>
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

const getMPColumns = (t: (key: string) => string): ColumnDef<MP>[] => [
    { 
        accessorKey: 'name', 
        header: t('name')
    },
    { accessorKey: 'location', header: t('constituency'), cell: ({ row }) => t(row.getValue('location') as any) },
    { accessorKey: 'parliamentaryRoles', header: t('role'), cell: ({ row }) => t(row.getValue('parliamentaryRoles') as any) },
    {
        accessorKey: 'keyPolicyInterests',
        header: t('policy_interests'),
        cell: ({ row }) => {
            const interests = (row.getValue('keyPolicyInterests') as string).split(', ');
            return <div className="flex flex-wrap gap-1">{interests.map(i => <Badge key={i} variant="secondary">{t(i as any)}</Badge>)}</div>
        }
    },
    { accessorKey: 'votingRecord', header: t('voting_record'), cell: ({ row }) => t(row.getValue('votingRecord') as any) },
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
    const { t } = useLanguage();
    const columns = React.useMemo(() => (type === 'member' ? getMemberColumns(t) : getMPColumns(t)), [type, t]);
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
                placeholder={t('filter_by_name_placeholder')}
                value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                    table.getColumn('name')?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
                />
                {type === 'member' && (
                    <NewMemberForm>
                        <Button className="ml-4">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            {t('new_member_button')}
                        </Button>
                    </NewMemberForm>
                )}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    {t('columns')} <ChevronDown className="ml-2 h-4 w-4" />
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
                            {t(column.id as any)}
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
                        {t('no_results')}
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                {t('table_footer_selected_rows', { 
                    selected: table.getFilteredSelectedRowModel().rows.length,
                    total: table.getFilteredRowModel().rows.length 
                })}
                </div>
                <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {t('previous')}
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {t('next')}
                </Button>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
