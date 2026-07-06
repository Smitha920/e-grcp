import React from 'react'
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, TableSortLabel, Paper, Box, Typography, Skeleton, LinearProgress
} from '@mui/material'
import { useTheme } from '@mui/material/styles'

function DataTable({
  columns = [],
  rows = [],
  loading = false,
  total = 0,
  page = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  orderBy,
  order,
  onSort,
  emptyMessage = 'No records found.',
  stickyHeader = true,
  maxHeight = 560,
}) {
  const theme = useTheme()

  if (loading && rows.length === 0) {
    return (
      <Paper>
        <LinearProgress />
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.id} sx={{ fontWeight: 600 }}>{col.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: pageSize }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.id}><Skeleton variant="text" /></TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    )
  }

  return (
    <Paper sx={{ overflow: 'hidden' }}>
      {loading && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, right: 0 }} />}
      <TableContainer sx={{ maxHeight }}>
        <Table stickyHeader={stickyHeader} size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    minWidth: col.minWidth,
                    width: col.width,
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'text.secondary',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.sortable && onSort ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : 'asc'}
                      onClick={() => onSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ py: 6, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">{emptyMessage}</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, idx) => (
                <TableRow
                  key={row.id || idx}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 } }}
                >
                  {columns.map((col) => (
                    <TableCell key={col.id} align={col.align || 'left'} sx={{ py: 1.5 }}>
                      {col.render ? col.render(row[col.id], row) : row[col.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {onPageChange && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={pageSize}
          onPageChange={(_, newPage) => onPageChange(newPage)}
          onRowsPerPageChange={(e) => onPageSizeChange && onPageSizeChange(parseInt(e.target.value))}
          rowsPerPageOptions={[5, 10, 20, 50]}
        />
      )}
    </Paper>
  )
}

export default React.memo(DataTable)
