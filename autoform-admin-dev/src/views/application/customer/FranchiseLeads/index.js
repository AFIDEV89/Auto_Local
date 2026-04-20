import React, { useEffect, useState } from "react";
import API from "api/axios";
import { format } from "date-fns";

import {
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableHead,
    TableRow,
    TextField,
    Typography,
    InputAdornment,
    FormControl,
    Select,
    MenuItem,
    InputLabel
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import MainCard from "ui-component/cards/MainCard";
import usePermission from "hooks/usePermission";
import { successAlert, errorAlert } from "../../../helpers";

const headCells = [
    { id: "id", numeric: true, label: "ID", align: "left" },
    { id: "contact_person_name", numeric: false, label: "Contact Person", align: "left" },
    { id: "email", numeric: false, label: "Email", align: "left" },
    { id: "mobile_number", numeric: false, label: "Mobile", align: "left" },
    { id: "location", numeric: false, label: "Location", align: "left" },
    { id: "details", numeric: false, label: "Store Info", align: "left" },
    { id: "status", numeric: false, label: "Status", align: "center" },
    { id: "createdAt", numeric: false, label: "Date", align: "center" }
];

const updateRow = async (row) => {
    return new Promise((resolve, reject) => {
        API.put("/franchise/franchise-inquiry/" + row.id, row).then(resp => {
            resolve(resp);
        }).catch((err) => {
            reject(err);
        });
    });
};

const FranchiseLeads = () => {
    const { isUserModerator } = usePermission();

    const [search, setSearch] = useState("");
    const [leadsList, setLeadsList] = useState([]);
    
    // For local search filtering
    const [filteredLeads, setFilteredLeads] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalData, setTotalData] = useState(0);

    const handleLeadsList = async () => {
        // Backend offset is calculated as page * rowsPerPage
        const offset = page * rowsPerPage;
        try {
            const response = await API.get(`/franchise/franchise-inquiry?offset=${offset}&limit=${rowsPerPage}`);
            if (response && response.data && response.data.statusCode === 200) {
                // Sequelize findAndCountAll returns { count, rows } inside data
                const fetchedList = response.data.data.rows || [];
                setLeadsList(fetchedList);
                setFilteredLeads(fetchedList);
                setTotalData(response.data.data.count || 0);
            }
        } catch (error) {
            console.error("Failed to fetch franchise leads:", error);
        }
    };

    const handleSearch = (event) => {
        const newString = event?.target?.value || "";
        setSearch(newString);

        if (newString) {
            const lowerQuery = newString.toLowerCase();
            const newRows = leadsList.filter((row) => {
                const searchStr = `${row.contact_person_name || ''} ${row.email || ''} ${row.mobile_number || ''} ${row.location || ''}`.toLowerCase();
                return searchStr.includes(lowerQuery);
            });
            setFilteredLeads(newRows);
        } else {
            setFilteredLeads(leadsList);
        }
    };

    useEffect(() => {
        handleLeadsList();
    }, [page, rowsPerPage]);

    const updateLocalRow = (row) => {
        const updatedList = leadsList.map(item => item.id === row.id ? row : item);
        setLeadsList(updatedList);
        
        const updatedFilteredList = filteredLeads.map(item => item.id === row.id ? row : item);
        setFilteredLeads(updatedFilteredList);
    };

    const handleLeadStatusChange = (event, row) => {
        const newValue = event.target.value;
        if (newValue !== row.status) {
            const updatedRow = { ...row, status: newValue };
            updateRow({ id: row.id, status: newValue }).then((resp) => {
                if (resp && resp.data && resp.data.statusCode === 200) {
                    updateLocalRow(updatedRow);
                    successAlert("Status updated successfully");
                } else {
                    errorAlert("Failed to update lead status");
                }
            }).catch(() => {
                errorAlert("Failed to update lead status");
            });
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
        <MainCard title="Franchise Inquiries" content={false}>
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
                            placeholder="Search by Name, Email, Mobile..."
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLeads && filteredLeads.length > 0 ? filteredLeads.map((row) => (
                            <TableRow hover key={row.id}>
                                <TableCell>{row.id}</TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">{row.contact_person_name}</Typography>
                                </TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.mobile_number}</TableCell>
                                <TableCell>{row.location || "N/A"}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="textSecondary">
                                        <strong>Name:</strong> {row.store_name || "N/A"} <br/>
                                        <strong>Area:</strong> {row.store_area ? `${row.store_area} Sqft` : "N/A"} <br/>
                                        <strong>Cat:</strong> {row.category || "N/A"}
                                    </Typography>
                                </TableCell>
                                
                                <TableCell width={150} padding="normal" align="center">
                                    <FormControl fullWidth size="small">
                                        <InputLabel id={`status-select-label-${row.id}`}>Status</InputLabel>
                                        <Select
                                            labelId={`status-select-label-${row.id}`}
                                            value={row.status || "New"}
                                            disabled={isUserModerator}
                                            onChange={(e) => handleLeadStatusChange(e, row)}
                                        >
                                            <MenuItem value="New">New</MenuItem>
                                            <MenuItem value="Contacted">Contacted</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell align="center">
                                    {row.createdAt ? format(new Date(row.createdAt), "E, MMM d yyyy") : "N/A"}
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow style={{ height: 53, textAlign: "center" }}>
                                <TableCell align="center" colSpan={8}>
                                    No Franchise Inquiries Found!
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={totalData}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </MainCard>
    );
};

export default FranchiseLeads;
