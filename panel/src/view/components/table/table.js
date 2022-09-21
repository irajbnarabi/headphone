import './table.scss';
import React, { useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { TableHead } from '@material-ui/core';

function TablePaginationActions({ count, page, rowsPerPage, onChangePage }) {
	const theme = useTheme();

	const handleFirstPageButtonClick = (event) => {
		onChangePage(event, 1);
	};

	const handleBackButtonClick = (event) => {
		onChangePage(event, page - 1);
	};

	const handleNextButtonClick = (event) => {
		onChangePage(event, page + 1);
	};

	const handleLastPageButtonClick = (event) => {
		onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<div style={{ display: 'flex' }}>
			<div style={{ display: 'flex', alignItems: 'center', width: '70px' }}>
				<span>صفحه : </span>
				<span style={{ marginRight: '4px' }}>{page}</span>
			</div>
			<IconButton onClick={handleFirstPageButtonClick} disabled={page === 1} aria-label='first page'>
				{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton onClick={handleBackButtonClick} disabled={page === 1} aria-label='previous page'>
				{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
			</IconButton>
			<IconButton onClick={handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label='next page'>
				{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
			</IconButton>
			<IconButton onClick={handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label='last page'>
				{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</div>
	);
}

const useStyles2 = makeStyles({
	root: {
		width: '100%',
	},
	header: {
		width: '100%',
		display: 'block',
	},
	headerRow: {
		width: '100%',
		display: 'block',
	},
	container: {
		maxHeight: 350,
		minHeight: 300,
	},
	table: {
		minWidth: 500,
		display: 'block',
	},
	tableBody: {
		width: '100%',
		display: 'block',
	},
	tableBodyRow: {
		width: '100%',
		display: 'block',
	},
});

export default function CustomTable({ data, headers, totalPage = 1, currentPage, loadSelectedPage }) {
	const classes = useStyles2();
	const [page] = useState(currentPage);
	const pageSize = 20;

	const handleChangePage = (event, newPage) => {
		loadSelectedPage(newPage);
	};

	return (
		<Paper className={classes.root}>
			<TableHead className={classes.header}>
				<TableRow className={classes.headerRow}>
					{headers?.map((column, index) => (
						<TableCell component='th' key={index} align={column.align} style={{ width: `${100 / headers.length}%`, display: 'inline-block', boxSizing: 'border-box' }}>
							{column.label}
						</TableCell>
					))}
				</TableRow>
			</TableHead>
			<TableContainer className={classes.container}>
				<Table className={classes.table} aria-label='custom pagination table'>
					<TableBody className={classes.tableBody}>
						{data?.map((row, index) => (
							<TableRow key={index} className={classes.tableBodyRow}>
								{Object.values(row).map((value, index) => {
									return (
										<TableCell
											component='td'
											className='text-truncate'
											style={{ width: `${100 / headers.length}%`, display: 'inline-block', boxSizing: 'border-box' }}
											align={index === 0 ? 'left' : index === Object.values(row).length - 1 ? 'right' : 'center'}
											scope='row'
										>
											{value}
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			{totalPage > 1 ? (
				<TablePagination
					colSpan={3}
					count={pageSize * (totalPage + 1)}
					rowsPerPageOptions={[pageSize]}
					rowsPerPage={pageSize}
					page={page}
					onChangePage={handleChangePage}
					ActionsComponent={TablePaginationActions}
				/>
			) : null}
		</Paper>
	);
}
