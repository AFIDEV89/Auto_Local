import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, CardContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "@mui/x-data-grid";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import renderHTML from 'react-render-html';
import usePermission from "hooks/usePermission";
import MainCard from "ui-component/cards/MainCard";
import API from "api/axios";
import { errorAlert, successAlert } from "views/helpers";
import ParameterForm from "./ParametersForm";
import AddSEODialog from "./AddSEODialog";
import "./style.css";
import SearchIcon from "@mui/icons-material/Search";
import CsvToolbar from "../../../components/CsvToolbar";

const columns = [
    {
        field: 'product_category_id',
        headerName: 'Category',
        width: 100,
        valueGetter: (params) => params.row.category?.name
    },
    {
        field: 'product_subcategory_id',
        headerName: 'Sub Category',
        width: 100,
        valueGetter: (params) => params.row.subCategory?.name
    },
    {
        field: 'vehicle_brand_id',
        headerName: 'Brand',
        width: 100,
        valueGetter: (params) => params.row.brand?.name
    },
    {
        field: 'vehicle_category_id',
        headerName: 'Vehicle Type',
        width: 100,
        valueGetter: (params) => params.row.vehicle_type?.name
    },
    {
        field: 'vehicle_model_id',
        headerName: 'Vehicle Model',
        width: 100,
        valueGetter: (params) => params.row.brand_model?.name
    },
    {
        field: 'category_text',
        headerName: 'SEO Text',
        width: 200,
        cellClassName: "custom-class",
        renderCell: ({ value }) => <Box sx={{
            textOverflow: "ellipsis",
            maxHeight: "140px",
            overflow: "hidden"
        }}>{value ? renderHTML(value) : ""}</Box>
    },
    {
        field: 'banner_path',
        headerName: 'Image',
        width: 100,
        renderCell: ({ value }) => <img src={value} alt="" width="100" loading='lazy' />
    },
    {
        field: 'canonical_url',
        headerName: 'Canonical',
        width: 100,
        valueGetter: (params) => params.row.canonical_url,
        renderCell: ({ value }) => <Typography noWrap title={value}>{value}</Typography>
    },
    {
        field: 'seo_page_title',
        headerName: 'Page Title',
        width: 100,
        renderCell: ({ value }) => <Typography noWrap title={value}>{value}</Typography>
    },
    {
        field: 'seo_page_description',
        headerName: 'Page Description',
        width: 120,
        renderCell: ({ value }) => <Typography noWrap title={value}>{value}</Typography>
    },
    {
        field: 'seo_title', headerName: 'Footer Title', width: 160
    },
    {
        field: 'url_text', headerName: 'Footer URL Text', width: 160
    }
];

const INITIAL_FORM_VALUE = {
    vehicleType: null,
    vehicleBrand: null,
    vehicleModel: null,
    productCategory: null,
    productSubCategory: null,
    file: null,
    seoText: null,
    seoPageTitle: null,
    seoPageDescription: null,
    canonicalUrl: null,
    seoTitle: null,
    urlText: null,
    showInFooter: false
}

const SeoUrlsPage = () => {
    const { isUserModerator } = usePermission();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [filtersData, setFiltersData] = useState([]);
    const [seoUrlsData, setSeoUrlsData] = useState([]);
    const [editRowId, setEditRowId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formValue, setFormValue] = useState(INITIAL_FORM_VALUE);
    const [paginationData, setPaginationData] = useState({
        page: 0,
        limit: 10,
        totalResult: 0
    })
    const [search, setSearch] = useState("");

    const fetchFiltersData = async () => {
        try {
            const response = await API.get("/user/product/filters");

            if (
                response &&
                response?.data &&
                response?.data?.data &&
                response?.data?.data?.list
            ) {
                setFiltersData(response.data.data.list);
            }
        } catch (error) {
            setFiltersData([]);
            errorAlert("Something went wrong while getting the Blog List");
        }
    }

    const fetchSEOUrlsData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await API.get(`/seo/seo-links/all?page=${Number(paginationData.page) + 1}&limit=${paginationData.limit}`);

            if (
                response &&
                response?.data &&
                response?.data?.data &&
                response?.data?.data?.list
            ) {
                setSeoUrlsData(response.data.data.list);
                setPaginationData(prev => ({
                    ...prev,
                    page: response.data.data.page - 1,
                    limit: response.data.data.limit,
                    totalResult: response.data.data.total_count
                }));
                setLoading(false);
            }
        } catch (error) {
            setSeoUrlsData([]);
            setLoading(false);
            errorAlert("Something went wrong while getting the SEO Urls data");
        }
    }, [paginationData.page, paginationData.limit])

    const handleDialogVisibility = () => {
        setIsDialogOpen(prev => !prev);
        if (isDialogOpen) {
            setFormValue(INITIAL_FORM_VALUE);
            setEditRowId(null);
        }
    }

    useEffect(() => {
        fetchSEOUrlsData();
    }, [fetchSEOUrlsData])

    useEffect(() => {
        if (filtersData.length === 0) {
            fetchFiltersData();
        }
    }, [])

    const handleSubmit = async (values) => {
        const payload = {
            canonical_url: values.canonicalUrl,

            product_category_id: values.productCategory,
            product_subcategory_id: values.productSubCategory || null,
            vehicle_category_id: values?.vehicleType || null,
            vehicle_brand_id: values?.vehicleBrand || null,
            vehicle_model_id: values?.vehicleModel || null,

            seo_page_title: values?.seoPageTitle || null,
            seo_page_description: values?.seoPageDescription || null,
            category_text: values?.seoText || null,
            banner_path: values?.file || null,
            
            seo_title: values.seoTitle || null,
            url_text: values.urlText || null
        }

        if (!editRowId) {
            try {
                const response = await API.post(`/seo`, payload);

                if (response && response.data && response.data.data) {
                    successAlert("Data added successfully");
                    handleDialogVisibility();

                    fetchSEOUrlsData();
                } else {
                    errorAlert(response.data.message);
                }
            }
            catch (error) {
                errorAlert("Something went wrong while adding the data");
                handleDialogVisibility();
            }
        } else {
            try {
                const response = await API.put(`/seo/${editRowId}`, payload);

                if (response && response.data && response.data.data) {
                    successAlert("Data updated successfully");
                    handleDialogVisibility();

                    fetchSEOUrlsData();
                } else {
                    errorAlert(response.data.message);
                }
            } catch (error) {
                errorAlert("Something went wrong while adding the data");
                handleDialogVisibility();
            }
        }
    }

    const openEditForm = useCallback((data) => {
        setEditRowId(data.row.id);

        // Ensure the subcategory value is included in the subCategoryList
        if (data.row.product_subcategory_id && !filtersData.some(item => item.dbId === data.row.product_subcategory_id)) {
            setFiltersData(prev => [
                ...prev,
                {
                    dbId: data.row.product_subcategory_id,
                    title: data.row.subCategory?.name || "Unknown Subcategory"
                }
            ]);
        }

        setFormValue(prev => ({
            ...prev,
            vehicleType: data.row.vehicle_category_id,
            vehicleBrand: data.row.vehicle_brand_id,
            vehicleModel: data.row.vehicle_model_id,
            productCategory: data.row.product_category_id,
            productSubCategory: data.row.product_subcategory_id,
            file: data.row.banner_path,
            seoText: data.row.category_text,
            seoPageTitle: data.row.seo_page_title,
            seoPageDescription: data.row.seo_page_description,
            canonicalUrl: data.row.canonical_url,
            seoTitle: data.row.seo_title,
            urlText: data.row.url_text,
            showInFooter: data.row.seo_title && data.row.url_text
        }));

        handleDialogVisibility();
    }, []);

    const deleteRow = useCallback(async (data) => {
        try {
            const response = await API.delete(`/seo/${data.row.id}`);

            console.log(response);

            if (response && response.data && response.data.data) {
                successAlert("Item deleted successfully");

                fetchSEOUrlsData();
            } else {
                errorAlert(response.data.message);
            }
        } catch (error) {
            errorAlert("Something went wrong while adding the data");
        }
    }, [])

    const tableColumns = useMemo(() => ([
        ...columns,
        ...(!isUserModerator ? [{
            field: 'actions',
            headerName: "Actions",
            width: 100,
            renderCell: (props) => {
                return (<>
                    <IconButton onClick={() => openEditForm(props)}>
                        <ModeEditIcon color="primary" fontSize='small' />
                    </IconButton>
                    <IconButton onClick={() => deleteRow(props)}>
                        <DeleteOutlineIcon color="error" fontSize='small' />
                    </IconButton>
                </>)
            }
        }] : [])
    ]), [openEditForm,deleteRow, isUserModerator])

    const handleChange = (value, keyName) => {
        setFormValue(prev => ({
            ...prev,
            [keyName]: value
        }))
    }

    const getButtonActive = !(
        formValue.productCategory &&
        formValue.canonicalUrl &&
        ((
            formValue.file ||
            formValue.seoText ||
            formValue.seoPageTitle ||
            formValue.seoPageDescription
        ) &&
            (
                formValue.showInFooter ? formValue.urlText && formValue.seoTitle : true
            ))
    )

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
        if (newString) {
        const newRows =
            seoUrlsData &&
            seoUrlsData.length > 0 &&
            seoUrlsData?.filter((row) => {
            let matches = true;

            const properties = [
                "canonical_url",
                "seo_page_title",
                "seo_page_description",
                "category_text",
                "category",
                "subCategory",
                "vehicle_type",
            ];
            let containsQuery = false;

            properties.forEach((property) => {
                let value = row[property];
                if (value && typeof value === "object" && value.name) {
                value = value.name;
                }
                if (
                value &&
                value
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
        setSeoUrlsData(newRows);
        } else {
        fetchSEOUrlsData();
        }
    };

    return (
        <MainCard
            title="SEO URLs Management"
            secondary={!isUserModerator && (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <CsvToolbar entityName="seoMappings" onImportComplete={fetchSEOUrlsData} />
                    <Button
                        startIcon={<AddIcon />}
                        variant="text"
                        disabled={filtersData.length === 0}
                        onClick={handleDialogVisibility}
                    >
                        Add
                    </Button>
                </Box>
            )}
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
                placeholder="Search Seo"
                value={search}
                size="small"
                />
            </CardContent>
            <Box style={{ height: 480, width: '100%' }}>
                <DataGrid
                    rows={seoUrlsData}
                    loading={loading}
                    density='compact'
                    columns={tableColumns}
                    pageSizeOptions={[10, 15, 30, 50]}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                page: 0,
                                pageSize: 10
                            },
                        },
                    }}
                    disableColumnMenu
                    paginationModel={{
                        page: Number(paginationData.page),
                        pageSize: paginationData.limit
                    }}
                    paginationMode="server"
                    onPaginationModelChange={onPaginationModelChange}
                    rowCount={paginationData.totalResult}
                    rowHeight={180}
                />
            </Box>

            <AddSEODialog
                title={editRowId ? "Edit SEO Url Data" : "Add SEO Url Data"}
                open={isDialogOpen}
                handleClose={handleDialogVisibility}
                handleSubmit={handleSubmit}
                formValue={formValue}
                isAddButtonDisabled={getButtonActive}
            >
                {isDialogOpen && <ParameterForm
                    filtersData={filtersData}
                    handleChange={handleChange}
                    formValue={formValue}
                    setFormValue={setFormValue}
                />}
            </AddSEODialog>
        </MainCard>
    )
}

export default SeoUrlsPage;