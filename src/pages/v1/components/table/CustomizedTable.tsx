import { Box, TableSortLabel, Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import React, { ChangeEvent, Dispatch, SetStateAction, useMemo, useState } from 'react';
import { visuallyHidden } from '@mui/utils';
import { getComparator } from '../../utils/sorter/sorter';

interface TableComponent {
    columns: readonly Column[]
    data: [any[], Dispatch<SetStateAction<any[]>>]
}

export interface Column {
    dataIndex: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    render?: (row: any) => void;
    sorter?: boolean;
}

export default function CustomizedTable(props: TableComponent) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [order, setOrder] = useState<{ order: 'asc' | 'desc', orderBy: keyof any }>({ order: 'asc', orderBy: '' });

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const createSortHandler = (property: keyof any) => (event: React.MouseEvent<unknown>) => {
        setOrder({ order: order.order === 'asc' ? 'desc' : 'asc', orderBy: property })
        const row = props.data[0].sort(getComparator(order.order, order.orderBy))
        props.data[1](row)
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {props.columns.map((column) => (
                                <TableCell
                                    key={column.dataIndex}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    sortDirection={order.orderBy === column.dataIndex ? order.order : false}
                                >
                                    {column.sorter ? <TableSortLabel
                                        active={order.orderBy === column.dataIndex}
                                        direction={order.orderBy === column.dataIndex ? order.order : 'asc'}
                                        onClick={createSortHandler(column.dataIndex)}
                                    >
                                        {column.label}
                                        {order.orderBy === column.dataIndex ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel> : column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.data[0]!.length !== 0 ? (props.data[0]!
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row: any, rowIndex: number) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.nis || rowIndex}>
                                        {props.columns.map((column, index) => {
                                            const value = row[column.dataIndex];
                                            return (
                                                <TableCell key={column.dataIndex} align={column.align}>
                                                    {
                                                        (column.dataIndex === Object.keys(row)[index] || column.dataIndex === 'action')
                                                            && column.render
                                                            ? column.render(row)
                                                            : value
                                                    }
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })) : (<TableRow
                                style={{
                                    height: '30vh',
                                }}
                            >
                                <TableCell align='center' colSpan={props.columns.length} >
                                    <Typography variant='caption'>Data Kosong</Typography>
                                </TableCell>
                            </TableRow>)}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={props.data[0].length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}