import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Checkbox,
    TextField,
    InputAdornment,
    Typography,
    Box,
    TablePagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import API from 'api/axios';
import { successAlert, apiErrorHandler } from 'views/helpers';

const AddProductModal = ({ open, handleClose, onSuccess }) => {
    const [products, setProducts] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchAllProducts = async (currentPage, limit, searchTerm) => {
        setLoading(true);
        try {
            const response = await API.get(
                `/product/get-list?page=${currentPage + 1}&limit=${limit}&search=${searchTerm}`
            );
            if (response?.data?.data) {
                setProducts(response.data.data.list || []);
                setTotalCount(response.data.data.total_count || 0);
            }
        } catch (error) {
            apiErrorHandler(error, "Failed to fetch product catalog");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchAllProducts(page, rowsPerPage, search);
        }
    }, [open, page, rowsPerPage]);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearch(value);
        setPage(0);
        fetchAllProducts(0, rowsPerPage, value);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = products.map((n) => n.id);
            setSelected(prev => [...new Set([...prev, ...newSelected])]);
            return;
        }
        // Deselect only items currently visible
        const currentIds = products.map(n => n.id);
        setSelected(prev => prev.filter(id => !currentIds.includes(id)));
    };

    const handleClick = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else {
            newSelected = selected.filter(item => item !== id);
        }
        setSelected(newSelected);
    };

    const handleBulkSave = async () => {
        if (selected.length === 0) return;
        
        try {
            await API.post('/online-shop/ecommerce-shop/bulk', {
                product_ids: selected
            });
            successAlert(`${selected.length} products added to Online Shop`);
            onSuccess();
        } catch (error) {
            apiErrorHandler(error, "Failed to add products");
        }
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4">Select Products to Add</Typography>
                    <TextField
                        size="small"
                        placeholder="Search Catalog..."
                        value={search}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <TableContainer sx={{ maxHeight: 400 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < totalCount}
                                        checked={products.length > 0 && products.every(p => isSelected(p.id))}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Product Code</TableCell>
                                <TableCell>Current Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products?.map((product) => (
                                <TableRow
                                    key={product.id}
                                    hover
                                    onClick={() => handleClick(product.id)}
                                    role="checkbox"
                                    aria-checked={isSelected(product.id)}
                                    selected={isSelected(product.id)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={isSelected(product.id)} />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.product_code || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                px: 1, py: 0.5, borderRadius: 1,
                                                bgcolor: product.is_saleable ? 'success.light' : 'grey.100',
                                                color: product.is_saleable ? 'success.dark' : 'text.secondary'
                                            }}
                                        >
                                            {product.is_saleable ? 'Already in Shop' : 'Enquiry Only'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} color="inherit">Cancel</Button>
                <Button 
                    onClick={handleBulkSave} 
                    variant="contained" 
                    disabled={selected.length === 0}
                >
                    Add {selected.length > 0 ? `(${selected.length})` : ''} Selected
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddProductModal;
