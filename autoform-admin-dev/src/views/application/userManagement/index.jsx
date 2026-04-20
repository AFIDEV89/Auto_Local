import { Button, CardContent, Chip, IconButton, InputAdornment, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import AddIcon from '@mui/icons-material/Add';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import AddUserDialog from "./AddUserDialog";
import API from "api/axios";
import { errorAlert, successAlert } from 'views/helpers';
import omitBy from "lodash/omitBy";
import { userTypeMap } from "constants/User";
import SearchIcon from "@mui/icons-material/Search";

const columns = [
    {
        field: 'name', headerName: 'Name',
        valueGetter: (params) => `${params.row.first_name} ${params.row.last_name}`,
        width: 220
    },
    {
        field: 'email', headerName: 'Email',
        width: 220
    },
    {
        field: 'mobile_no', headerName: 'Phone',
        width: 150
    },
    {
        field: 'type', headerName: 'Role',
        width: 150,
        valueGetter: (params) => params.row.type && params.row.type in userTypeMap ? userTypeMap[params.row.type] : "",
    },
    {
        field: 'status', headerName: 'Status',
        width: 120,
        renderCell: ({ row }) => {
            const isActive = row.status === "active";

            return <Chip label={row.status} color={isActive ? "success" : "error"} sx={{ textTransform: "capitalize" }} />
        }
    }
];

const DEFAULT_FORM_VALUE = {
    first_name: null,
    last_name: null,
    password: null,
    email: null,
    mobile_no: null,
    type: null,
    status: null
}

const UserManagement = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formValue, setFormValue] = useState(DEFAULT_FORM_VALUE);
    const [usersList, setUsersList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState("ADD");
    const [paginationData, setPaginationData] = useState({
        page: 0,
        limit: 10,
        totalResult: 0
    })
    const [search, setSearch] = useState("");

    const handleFormFieldChange = (fieldName, value) => {
        setFormValue(prev => ({
            ...prev,
            [fieldName]: value
        }))
    }

    const openDialog = useCallback((mode = "ADD", formData = DEFAULT_FORM_VALUE) => {
        setMode(mode);
        setFormValue(formData)
        setIsDialogOpen(prev => !prev);
    }, [])

    const handleCloseDialog = () => {
        setIsDialogOpen(false)
    }

    const fetchUsersList = useCallback(async () => {
        setLoading(true);

        try {
            const response = await API.get(`/user/get-list?page=${Number(paginationData.page) + 1}&limit=${paginationData.limit}`);
            if (response?.data?.data?.list) {
                setUsersList(response.data.data.list);
                setPaginationData(prev => ({
                    ...prev,
                    page: response.data.data.page - 1,
                    limit: response.data.data.limit,
                    totalResult: response.data.data.total_count
                }))
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            setUsersList([]);
            errorAlert("Something went wrong while getting the user list");
        }
    }, [paginationData.page, paginationData.limit])

    useEffect(() => {
        fetchUsersList()
    }, [fetchUsersList])

    const addNewUser = async () => {
        const response = await API.post("/user/admin/sign-up", omitBy(formValue, (v) => v === "" || v === undefined || v === null));

        if (response?.data && [200, 201].includes(response.data.statusCode)) {
            successAlert("User added successfully");
            handleCloseDialog();
            fetchUsersList();
        } else {
            errorAlert(response.data.message);
        }
    }

    const updateUser = async () => {
        const response = await API.patch("/user/admin/update", omitBy(formValue, (v) => v === "" || v === undefined || v === null));

        if (response?.data && [200, 201, 204].includes(response.data.statusCode)) {
            successAlert("User details updated successfully");
            handleCloseDialog();
            fetchUsersList();
        } else {
            (response?.data?.errors ?? []).forEach((error) => {
                errorAlert(error);
            })

        }
    }

    const tableColumns = useMemo(() => ([
        ...columns,
        {
            field: 'actions',
            headerName: "Actions",
            headerAlign: "center",
            align: "center",
            renderCell: (props) => {
                const payload = {
                    first_name: props.row.first_name,
                    last_name: props.row.last_name,
                    email: props.row.email,
                    mobile_no: props.row.mobile_no,
                    type: props.row.type,
                    id: props.row.id,
                    status: props.row.status
                }

                return (
                    <IconButton onClick={() => openDialog("EDIT", payload)} title="Edit">
                        <EditTwoToneIcon color="info" fontSize="small" />
                    </IconButton>
                )
            }
        }
    ]), [openDialog])

    const onPaginationModelChange = (data) => {
        setPaginationData(prev => ({
            ...prev,
            page: data.page,
            limit: data.pageSize
        }))
    }
    const handleSearch = (event) => {
        const newString = event?.target.value;
        setSearch(newString || "");
        console.log('usersList', usersList)
        if (newString) {
        const newRows =
            usersList &&
            usersList.length > 0 &&
            usersList?.filter((row) => {
            let matches = true;

            const properties = [
                "first_name",
                "last_name",
                "email",
                "mobile_no",
                "status",
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
        setUsersList(newRows);
        } else {
        fetchUsersList();
        }
    };

    return (
        <MainCard
            title="Users List"
            secondary={
                <Button
                    startIcon={<AddIcon />}
                    variant="text"
                    color="info"
                    children="Add User"
                    onClick={() => openDialog()}
                />
            }
        >
            <CardContent align="right">
                <TextField
                InputProps={{
                    startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                    </InputAdornment>
                    ),
                }}
                onChange={handleSearch}
                placeholder="Search User"
                value={search}
                size="small"
                />
            </CardContent>
            <DataGrid
                rows={usersList}
                loading={loading}
                columns={tableColumns}
                pageSizeOptions={[10, 15, 30, 50]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            page: Number(paginationData.page),
                            pageSize: 10
                        },
                    },
                }}
                paginationModel={{
                    page: Number(paginationData.page),
                    pageSize: paginationData.limit
                }}
                onPaginationModelChange={onPaginationModelChange}
                paginationMode="server"
                rowCount={paginationData.totalResult}
                sx={{
                    height: "105vh"
                }}
            />

            <AddUserDialog
                mode={mode}
                formValue={formValue}
                open={isDialogOpen}
                handleChange={handleFormFieldChange}
                handleClose={handleCloseDialog}
                handleSubmit={mode === "ADD" ? addNewUser : updateUser}
            />
        </MainCard>
    )
}

export default UserManagement