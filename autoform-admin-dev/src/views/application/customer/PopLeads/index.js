import React, { useEffect, useState } from "react";
import API from "api/axios";
import { format } from "date-fns";
import AddIcon from "@mui/icons-material/AddTwoTone";

import {
    Box,
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
    MenuItem,
    FormControl,
    Dialog,
    InputLabel
} from "@mui/material";
import Select from "@mui/material/Select";

import MainCard from "ui-component/cards/MainCard";
import { useDispatch } from "store";
import ViewLeads from "./ViewLeads";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityTwoToneIcon from "@mui/icons-material/VisibilityTwoTone";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteTwoTone';
import { successAlert, errorAlert } from "../../../helpers";
import usePermission from "hooks/usePermission";
import EditLeadModal from "./EditLeadModal";


const headCells = [
    {
        id: "id",
        numeric: true,
        label: "ID",
        align: "left",
    },
    {
        id: "name",
        numeric: false,
        label: "Customer Name",
        align: "left",
    },
    {
        id: "contact",
        numeric: true,
        label: "Contact Number",
        align: "left",
    },
    {
        id: "email",
        numeric: false,
        label: "Email",
        align: "left",
    },
    {
        id: "feedback",
        numeric: false,
        label: "Feedback",
        align: "left",
    },
    {
        id: "status",
        numeric: false,
        label: "Status",
        align: "center",
    },
    {
        id:"created_at",
        numeric: false,
        label: "Created At",
        align: "center",
    }
];
const updateRow = async (row) => {
    return new Promise((resolve, reject) => {
        API.put("/pop-lead/admin/" + row.id, row).then(resp => {
            resolve(resp);
        }).catch((err) => {
            reject(err);
        });
        setTimeout(() => {
            resolve({ status: 200 });
        }, 10);
    });
}
const PopLeads = () => {
    const { isUserModerator } = usePermission();

    const [search, setSearch] = useState("");
    const [leadsList, setLeadsList] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalData, setTotalData] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const [feedbackEditingID, setFeedbackEditingID] = useState(-1);
    const [feedbackText, setFeedbackText] = useState("Click To Edit");
    const [openAddModal, setOpenAddModal] = useState(false);
    const [editRowModal, setEditRowModal] = useState(undefined);
    const [viewLeadId, setViewLeadId] = useState(0);
    const [rows, setRows] = useState([]);

    const handleLeadsList = async () => {
        const response = await API.get(`/pop-lead/admin?page=${page + 1}&limit=${rowsPerPage}`); // page+1 for API
        if (response && response.data && response.data.statusCode === 200) {
            setLeadsList(response.data.data.list);
            setTotalData(response.data.data.total_count);
        }
    };

    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || "");

        if (newString) {
        const newRows =
            rows &&
            rows.length > 0 &&
            rows?.filter((row) => {
            let matches = true;

            const properties = [
                "customer_name",
                "contact_no",
                "email",
            ];
            let containsQuery = false;

            properties.forEach((property) => {
                if (
                row &&
                row[property] &&
                row[property]
                    .toString()
                    .toLowerCase()
                    .includes(newString.toString().toLowerCase())
                ) {
                containsQuery = true;
                }
            });

            if (!containsQuery) {
                matches = false;
            }
            return matches;
            });
        setRows(newRows);
        } else {
        handleLeadsList(); // Fix: reload full list for current page
        }
    };

    const handleTextChange = (e) => {
        setFeedbackText(e.target.value);
    };

    const handleFeedbackUpdated = (row) => {
        const newFeedbackText = feedbackText.trim();
        setFeedbackEditingID(-1);
        setFeedbackText('');
        if (row.feedback === newFeedbackText) {
            return;
        }

        const newRow = { ...row, feedback: newFeedbackText };
        updateRow(newRow).then((resp) => {
            if (resp.status === 200) {
                updateLocalRow(newRow);
            } else {
                errorAlert("Something went wrong");
            }
        }).catch((err) => {
            errorAlert("Something went wrong");
        });
    };

    useEffect(() => {
        handleLeadsList(page);
    }, [page, rowsPerPage]);

    const handleShowModal = (id) => {
        setViewLeadId(id);
        setShowModal(!showModal);
    };

    const handleClose = () => {
        setOpenAddModal(false);
        setEditRowModal(undefined);
    }

    const updateLocalRow = (row) => {
        const updatedList = [...leadsList];
        const index = updatedList.findIndex((item) => item.id === row.id);
        updatedList[index] = row;
        setLeadsList(updatedList);
    };

    const handleLeadStatusChange = (event, row) => {
        const newValue = event.target.value;
        if (newValue !== row.status) {
            row.status = newValue;
            updateRow(row).then((resp) => {
                if (resp.status === 200) {
                    updateLocalRow(row);
                } else {
                    errorAlert("Failed to update lead status");
                }
            }).catch((err) => {
                errorAlert("Failed to update lead status");
            });

        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event?.target.value, 10));
    };

    const handleDeleteLead = async (id) => {
        if (!window.confirm("Are you sure you want to delete this pop lead?")) return;
        try {
            const response = await API.delete(`/pop-lead/admin/${id}`);
            if (response.status >= 200 && response.status < 300) {
                successAlert("Pop Lead deleted successfully");
                handleLeadsList();
            }
        } catch (err) {
            errorAlert("Failed to delete pop lead");
        }
    };

    return (
        <MainCard title="Pop Leads List" content={false} secondary={!isUserModerator && <Button
            variant="text"
            onClick={() => {
                setOpenAddModal(true);
            }}
            startIcon={<AddIcon />}
        >
            Add Pop Lead
        </Button>}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            onChange={handleSearch}
                            placeholder="Search Pop Leads"
                            value={search}
                            size="small"
                        />
                    </Grid>
                </Grid>
            </CardContent>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {
                                headCells.map((headCell) => (
                                    <TableCell key={headCell.id} align={headCell.align} >
                                        {headCell.label}
                                    </TableCell>
                                ))
                            }
                            {!isUserModerator && (
                                <TableCell align="center" sx={{ pr: 3 }}>
                                    <Typography variant="subtitle1">
                                        Action
                                    </Typography>
                                </TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            leadsList && leadsList.length > 0 ? leadsList.map((row, index) => {
                                return (
                                    <TableRow hover key={row.id}>
                                        <TableCell style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                                         onClick={() => handleShowModal(row.id)} >{row.id}</TableCell>
                                        <TableCell>{row.customer_name}</TableCell>
                                        <TableCell>{row.contact_no}</TableCell>
                                        <TableCell>{row.email || "N/A"}</TableCell>
                                        <TableCell>
                                            {feedbackEditingID === row.id ? (
                                                <input
                                                    type="text"
                                                    value={feedbackText}
                                                    onChange={handleTextChange}
                                                    onBlur={() => handleFeedbackUpdated(row)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleFeedbackUpdated(row)}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span onClick={() => { setFeedbackEditingID(row.id); setFeedbackText(row.feedback); }}>{row.feedback || "Click to edit"}</span>
                                            )}
                                        </TableCell>
                                        <TableCell width={150} padding="none" align="center" >
                                            <FormControl fullWidth size="small">
                                                <InputLabel id={`demo-simple-select-label${row.id}`}>Select Status</InputLabel>
                                                <Select
                                                    labelId={`demo-simple-select-label${row.id}`}
                                                    label="Select Status"
                                                    id={`demo-simple-selectStatus${row.id}`}
                                                    value={row.status || ""}
                                                    disabled={isUserModerator}
                                                    onChange={(e) => handleLeadStatusChange(e, row)}
                                                >

                                                    <MenuItem value="new_lead">New Lead</MenuItem>
                                                    <MenuItem value="callback">Call Back</MenuItem>
                                                    <MenuItem value="calldone">Call Done</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align="center">{format(new Date(row?.createdAt), "E, MMM d yyyy")}</TableCell>
                                        
                                        {!isUserModerator && <TableCell align="center" sx={{ pr: 3 }}>

                                            <IconButton
                                                onClick={(e) => {
                                                    setOpenAddModal(true);
                                                    setEditRowModal(row);
                                                }}
                                                color="primary"
                                                size="medium"
                                            >
                                                <EditIcon sx={{ fontSize: "1.3rem" }} />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleDeleteLead(row.id)}
                                                color="error"
                                                size="medium"
                                            >
                                                <DeleteIcon sx={{ fontSize: "1.3rem" }} />
                                            </IconButton>
                                        </TableCell>}
                                    </TableRow>)
                            }) : (
                                <TableRow
                                    style={{
                                        height: 53,
                                        textAlign: "center",
                                    }}
                                >
                                    <TableCell align="center" colSpan={10}>
                                        Record not found!
                                    </TableCell>
                                </TableRow>
                            )}

                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={totalData}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            {(openAddModal) && (
                <Dialog
                    maxWidth="sm"
                    fullWidth
                    onClose={handleClose}
                    open={openAddModal}
                    sx={{ "& .MuiDialog-paper": { p: 0 } }}
                >
                    {openAddModal && (
                        <EditLeadModal
                            open={openAddModal}
                            onClose={handleClose}
                            closeModal={() => {
                                setOpenAddModal(false);
                                setEditRowModal(undefined);
                            }}
                            isEditing={!!editRowModal}
                            id={editRowModal?.id}
                            initialValues={{ ...editRowModal }}
                        />
                    )}

                </Dialog>
            )}
            {showModal && <ViewLeads viewLeadId={viewLeadId} showModal={showModal} toggleModal={handleShowModal} />}

        </MainCard>
    );
};

export default PopLeads;
