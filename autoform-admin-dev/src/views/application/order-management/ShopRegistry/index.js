import * as React from "react";
import API from "api/axios";

import { useTheme } from "@mui/material/styles";
import {
  CardContent,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Tooltip,
  Box,
  Button,
} from "@mui/material";

import MainCard from "ui-component/cards/MainCard";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { successAlert, apiErrorHandler } from "views/helpers";
import usePermission from "hooks/usePermission";
import AddProductModal from "./AddProductModal";

const ShopRegistryList = () => {
    const theme = useTheme();
    const { isUserModerator } = usePermission();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [search, setSearch] = React.useState("");
    const [registryItems, setRegistryItems] = React.useState([]);
    const [totalCount, setTotalCount] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [isAddModalOpen, setAddModalOpen] = React.useState(false);

    const fetchRegistry = async (currentPage, limit, searchTerm) => {
        setLoading(true);
        try {
            // Fetching ONLY products already in the registry
            const response = await API.get(
                `/online-shop/ecommerce-shop?page=${currentPage + 1}&limit=${limit}&search=${searchTerm}`
            );
            if (response?.data?.data) {
                setRegistryItems(response.data.data.list || []);
                setTotalCount(response.data.data.total_count || 0);
            }
        } catch (error) {
            apiErrorHandler(error, "Failed to fetch shop registry");
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRegistry(page, rowsPerPage, search);
    }, [page, rowsPerPage]);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearch(value);
        setPage(0);
        fetchRegistry(0, rowsPerPage, value);
    };

    const handleRemoveFromShop = async (productId, productName) => {
        try {
            await API.delete(`/online-shop/ecommerce-shop/${productId}`);
            successAlert(`${productName} removed from Online Shop`);
            fetchRegistry(page, rowsPerPage, search);
        } catch (error) {
            apiErrorHandler(error, "Failed to remove product");
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <MainCard 
            title="Online Shop Management" 
            subheader="Products listed here will show 'Add to Cart' and 'Buy Now' on the website."
            secondary={
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setAddModalOpen(true)}
                    disabled={isUserModerator}
                >
                    Add Product
                </Button>
            }
        >
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Search Registry..."
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

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Product Code</TableCell>
                                <TableCell align="center">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {registryItems?.map((item) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle1">{item.product?.name}</Typography>
                                    </TableCell>
                                    <TableCell>{item.product?.product_code || 'N/A'}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Remove from Online Shop">
                                            <IconButton 
                                                color="error" 
                                                onClick={() => handleRemoveFromShop(item.product_id, item.product?.name)}
                                                disabled={isUserModerator}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {registryItems.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        <Box sx={{ py: 3 }}>
                                            <Typography variant="body2" color="textSecondary">
                                                No products found in the registry. 
                                                Click "Add Product" to enable online sales for your items.
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={totalCount}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>

            {isAddModalOpen && (
                <AddProductModal 
                    open={isAddModalOpen} 
                    handleClose={() => setAddModalOpen(false)} 
                    onSuccess={() => {
                        setAddModalOpen(false);
                        fetchRegistry(page, rowsPerPage, search);
                    }}
                />
            )}
        </MainCard>
    );
};

export default ShopRegistryList;
