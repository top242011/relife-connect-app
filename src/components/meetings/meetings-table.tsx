'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  MoreHorizontal,
  PlusCircle,
  Eye,
  Edit
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
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import type { Meeting } from '@/lib/types';
import { Card, CardContent } from '../ui/card';
import { EditMeetingForm } from './edit-meeting-form';
import { NewMeetingForm } from './new-meeting-form';
import { useLanguage } from '@/hooks/use-language';

export function MeetingsTable({ data }: { data: Meeting[] }) {
  const { t } = useLanguage();

  const columns: ColumnDef<Meeting>[] = [
    {
      accessorKey: 'title',
      header: t('title'),
      cell: ({ row }) => {
          const meeting = row.original;
          const displayTitle = (meeting as any).displayTitle || meeting.title;
          return (
            <div>
              <div className="font-medium">{displayTitle}</div>
              {meeting.meetingType === 'การประชุมกรรมาธิการ' && (
                <Badge variant="outline" className='mt-1'>{meeting.committeeName}</Badge>
              )}
            </div>
          )
      }
    },
    {
      accessorKey: 'date',
      header: t('date'),
    },
    {
      accessorKey: 'presidingOfficer',
      header: t('presiding_officer'),
      cell: ({ row }) => {
        const officerName = row.getValue('presidingOfficer') as string;
        return officerName;
      },
    },
    {
      accessorKey: 'attendees',
      header: t('attendees'),
      cell: ({ row }) => {
        const attendees = row.getValue('attendees') as string[];
        return <Badge variant="outline">{attendees.length} {t('members')}</Badge>;
      },
    },
    {
      accessorKey: 'motions',
      header: t('motions'),
      cell: ({ row }) => {
          const motions = row.getValue('motions') as {id: string, title: string}[];
          return <Badge variant="outline">{motions.length} {t('motions')}</Badge>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const meeting = row.original;
  
        return (
          <div className="text-right">
               <Button asChild variant="ghost" className="h-8 w-8 p-0">
                  <Link href={`/meetings/manage/${meeting.id}`}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">{t('view_meeting')}</span>
                  </Link>
              </Button>
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">{t('open_menu')}</span>
                  <MoreHorizontal className="h-4 w-4" />
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigator.clipboard.writeText(meeting.id)}>
                    {t('copy_meeting_id')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                   <EditMeetingForm meeting={meeting}>
                      <button className="w-full">
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="mr-2 h-4 w-4" />
                              {t('edit_meeting')}
                          </DropdownMenuItem>
                      </button>
                  </EditMeetingForm>
                  <DropdownMenuItem className="text-red-600">{t('delete_meeting')}</DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const processedData = React.useMemo(() => {
    const sortedData = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const counts: Record<string, number> = {};

    return sortedData.map(meeting => {
      let displayTitle = meeting.meetingNumber 
        ? `${meeting.title} (${t('meeting_number_short')} ${meeting.meetingNumber})`
        : meeting.title;

      if (!meeting.meetingNumber) {
        const key = `${meeting.meetingType}-${meeting.meetingSession}`;
        counts[key] = (counts[key] || 0) + 1;
        displayTitle = `${t(meeting.meetingType as any)} ${t(meeting.meetingSession as any)} ${t('meeting_number_short')} ${counts[key]}`;
      }

      return {
        ...meeting,
        displayTitle,
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data, t]);

  const table = useReactTable({
    data: processedData,
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
                placeholder={t('filter_meetings_placeholder')}
                value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                    table.getColumn('title')?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
                />
                 <NewMeetingForm>
                    <Button className="ml-4">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {t('new_meeting_button')}
                    </Button>
                 </NewMeetingForm>
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
