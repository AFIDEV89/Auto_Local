import React, { useEffect, useState } from "react";
import API from "api/axios";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/AddTwoTone";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteModal from "../e-commerce/components/deleteModal";

import {
    CardContent,
    Button,
    Grid,
    IconButton,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Chip,
    Dialog,
    Avatar
} from "@mui/material";

import MainCard from "ui-component/cards/MainCard";
import usePermission from "hooks/usePermission";
import { successAlert, errorAlert } from "../../helpers";
import AddTestimonial from "./components/AddTestimonial";
import config from 'config';

const headCells = [
    { id: "id", numeric: true, label: "ID", align: "left" },
    { id: "clientName", numeric: false, label: "Client Name", align: "left" },
    { id: "role", numeric: false, label: "Role/Designation", align: "left" },
    { id: "type", numeric: false, label: "Type", align: "left" },
    { id: "rating", numeric: true, label: "Rating", align: "center" },
    { id: "status", numeric: false, label: "Status", align: "center" },
    { id: "createdAt", numeric: false, label: "Created At", align: "center" },
];

const TestimonialsList = () => {
    const { isUserModerator } = usePermission();

    const [search, setSearch] = useState("");
    const [testimonialsList, setTestimonialsList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalData, setTotalData] = useState(0);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [editRowData, setEditRowData] = useState(undefined);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `${config.IMAGE_URL}${imagePath}`;
    };

    const handleFetchList = async () => {
        try {
            const offset = page * rowsPerPage;
            const response = await API.get(`testimonials?limit=${rowsPerPage}&offset=${offset}`);
            if (response?.data?.statusCode === 200) {
                const list = response.data.data.rows || [];
                setTestimonialsList(list);
                setFilteredList(list);
                setTotalData(response.data.data.count || 0);
            }
        } catch (error) {
            console.error("Failed to fetch testimonials", error);
        }
    };

    const handleSearch = (event) => {
        const query = event?.target?.value?.toLowerCase() || "";
        setSearch(query);

        if (query) {
            const newRows = testimonialsList.filter((row) => {
                const searchStr = `${row.clientName || ''} ${row.role || ''} ${row.type || ''}`.toLowerCase();
                return searchStr.includes(query);
            });
            setFilteredList(newRows);
        } else {
            setFilteredList(testimonialsList);
        }
    };

    useEffect(() => {
        handleFetchList();
    }, [page, rowsPerPage]);

    const handleDelete = async () => {
        try {
            const resp = await API.delete(`testimonials/${deleteId}`);
            if (resp.data.statusCode === 200) {
                successAlert("Deleted Successfully");
                setDeleteModal(false);
                setDeleteId(null);
                handleFetchList();
            }
        } catch (error) {
            errorAlert("Failed to delete testimonial");
            setDeleteModal(false);
            setDeleteId(null);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
        setPage(0);
    };

    return (
        <MainCard
            title="Testimonials List"
            content={false}
            secondary={
                !isUserModerator && (
                    <Button
                        variant="text"
                        onClick={() => {
                            setEditRowData(undefined);
                            setOpenAddModal(true);
                        }}
                        startIcon={<AddIcon />}
                    >
                        Add Testimonial
                    </Button>
                )
            }
        >
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={handleSearch}
                            placeholder="Search by Name, Role..."
                            value={search}
                            size="small"
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headCells.map((headCell) => (
                                <TableCell key={headCell.id} align={headCell.align}>
                                    {headCell.label}
                                </TableCell>
                            ))}
                            {!isUserModerator && (
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    Action
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredList && filteredList.length > 0 ? (
                            filteredList.map((row) => (
                                <TableRow hover key={row.id}>
                                    <TableCell>{row.id}</TableCell>
                                    <TableCell>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid item>
                                                <Avatar 
                                                    src={getFullImageUrl(row.image)} 
                                                    alt={row.clientName} 
                                                />
                                            </Grid>
                                            <Grid item xs zeroMinWidth>
                                                <Typography variant="subtitle1" component="div">
                                                    {row.clientName}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell>{row.role}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.type === 'carOwners' ? 'Customer' : 'Franchise Partner'} 
                                            color={row.type === 'carOwners' ? 'primary' : 'secondary'} 
                                            size="small" 
                                            variant="outlined" 
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Typography variant="subtitle2">{row.rating} Star</Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip 
                                            label={row.status} 
                                            color={row.status === 'Active' ? 'success' : 'error'} 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        {format(new Date(row.createdAt), "E, MMM d yyyy")}
                                    </TableCell>
                                    {!isUserModerator && (
                                        <TableCell align="center" sx={{ pr: 3 }}>
                                            <IconButton
                                                onClick={() => {
                                                    setEditRowData(row);
                                                    setOpenAddModal(true);
                                                }}
                                                color="primary"
                                                size="small"
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    setDeleteId(row.id);
                                                    setDeleteModal(true);
                                                }}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow style={{ height: 53, textAlign: "center" }}>
                                <TableCell align="center" colSpan={8}>
                                    No Testimonials Found!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={totalData}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {openAddModal && (
                <Dialog
                    maxWidth="md"
                    fullWidth
                    onClose={() => setOpenAddModal(false)}
                    open={openAddModal}
                    sx={{ "& .MuiDialog-paper": { p: 0 } }}
                >
                    <AddTestimonial
                        open={openAddModal}
                        closeModal={() => setOpenAddModal(false)}
                        fetchData={handleFetchList}
                        initialValues={editRowData}
                        isEditing={!!editRowData}
                    />
                </Dialog>
            )}

            {deleteModal && (
                <DeleteModal
                    handleDelete={handleDelete}
                    title="Delete Testimonial"
                    open={deleteModal}
                    setOpen={setDeleteModal}
                    type="Testimonial"
                />
            )}
        </MainCard>
    );
};

export default TestimonialsList;
