import * as React from "react";
import API from "../../../api/axios";

// material-ui
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
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
  Dialog,
  Button,
  Box,
} from "@mui/material";


// project imports
import MainCard from "ui-component/cards/MainCard";
import Avatar from "ui-component/extended/Avatar";
import DeleteModal from "./components/deleteModal";
import AddVehicleData from "./components/addVehicle";
import CsvToolbar from "../../components/CsvToolbar";

// assets
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/AddTwoTone";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { successAlert, apiErrorHandler } from "../../helpers";
import usePermission from "hooks/usePermission";
import { getComparator, stableSort } from "utils/helpers/blogs";

const headCells = [
  {
    id: "brand_name",
    numeric: false,
    label: "Brand Name",
    align: "left",
  },
  {
    id: "brand_model",
    numeric: false,
    label: "Brand Model",
    align: "left",
  },
  {
    id: "model_variant",
    numeric: false,
    label: "Model Variant",
    align: "left",
  },
  {
    id: "vehicle_type",
    numeric: true,
    label: "Vehicle Type",
    align: "left",
  },
  {
    id: "month",
    numeric: false,
    label: "Month",
    align: "left",
  },
  {
    id: "year",
    numeric: false,
    label: "Year",
    align: "left",
  }
];

const EnhancedTableHead = ({
  order,
  orderBy,
  numSelected,
  onRequestSort,
  theme,
}) => {
  const { isUserModerator } = usePermission()
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>

        {numSelected <= 0 &&
          headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.align}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Typography component="span" sx={{ display: "none" }}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Typography>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        {numSelected <= 0 && !isUserModerator && (
          <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[600]
                    : "grey.900",
              }}
            >
              Action
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}


const VehiclesData = () => {
  const theme = useTheme();
  const { isUserModerator } = usePermission();

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalData, setTotalData] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [vehicleList, setVehicleList] = React.useState([]);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [vehicleType, setVehicleType] = React.useState([]);
  const [brandList, setBrandList] = React.useState([]);

  const [openAddCategory, setOpenAddCategory] = React.useState(false);
  const [editVehicleData, setEditVehicleData] = React.useState({});

  const handleVehicleType = async () => {
    try {
      const response = await API.get("vehicle-detail/vehicle-types");
      if (response && response.data && response.status === 200) {
        if (
          response &&
          response?.data &&
          response?.data?.data.length &&
          response?.data?.data?.list
        ) {
          setTotalData(response?.data?.data?.total_count || 0)
          setVehicleType(response?.data?.data?.list);

        } else {
          setVehicleType([]);
        }
      }
    } catch (error) {
      apiErrorHandler(
        error,
        "Something went wrong while getting the vehicle type"
      );
    }
  };

  React.useEffect(() => {
    handleVehicleType();
  }, []);

  React.useEffect(() => {
    handleVehicleList(page + 1);
  }, [page, rowsPerPage])

  const handleVehicleList = async (p) => {
    const page = p || 1;
    try {
      const response = await API.get(`vehicle-detail/get-list?page=${page}&limit=${rowsPerPage}`);
      if (response && response?.data && response?.data?.data && response?.data?.data?.list) {
        setTotalData(response?.data?.data?.total_count || 0)
        setVehicleList(response?.data?.data?.list);
      }
    } catch (error) {
      alert("Something went wrong while getting the Sub Category List");
    }
  };

  const handleBrandList = async () => {
    try {
      const response = await API.get("brand/get-list");

      if (response && response.data && response.data.data) {
        const brandList = response.data.data;
        setBrandList(brandList);

      }
    } catch (error) {
      alert("Something went wrong while getting the Brand List");
    }
  };

  React.useEffect(() => {
    handleBrandList();
  }, [])

  React.useEffect(() => {
    setRows(vehicleList);
  }, [vehicleList]);

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
            "brand",
            "brand_model",  
            "vehicle_type",
            "model_variant"
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
      setRows(newRows);
    } else {
      handleVehicleList(page + 1);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedId = rows?.map((n) => n.name);
      setSelected(newSelectedId);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleAddCategoryClose = () => {
    setOpenAddCategory(false);
    setEditVehicleData({});
  };

  const reloadApi = () => {
    if (page === 0) handleVehicleList(page);
    else setPage(0);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`vehicle-detail/delete/${deleteId}`);
      if (response && response.status === 200) {
        setDeleteModal(false);
        setTimeout(() => {
          successAlert("Vehicle Data deleted successfully.");
          reloadApi();
        }, 300);
      }
    } catch (error) {
      apiErrorHandler(
        error,
        "Something went wrong while deleting the Vehicle."
      );
    }
  };

  return (
    <MainCard
      title="Vehicle List"
      content={false}
      secondary={!isUserModerator && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CsvToolbar entityName="vehicleDetails" onImportComplete={reloadApi} />
              <Button
                  variant="text"
                  onClick={() => {
                      setOpenAddCategory(true);
                  }}
                  startIcon={<AddIcon />}
              >
                  Add Vehicle Details
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
          placeholder="Search Vehicle "
          value={search}
          size="small"
        />
      </CardContent>

      {/* table */}
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
            theme={theme}
            selected={selected}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice()
              .map((row, index) => {
                if (typeof row === "number") return null;
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    key={row.id}
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                  >
                    <TableCell>{row?.brand && row?.brand?.name ? row?.brand?.name : ''}</TableCell>
                    <TableCell>{row?.brand_model && row?.brand_model?.name ? row?.brand_model?.name : ''}</TableCell>
                    <TableCell>{row?.model_variant ? row?.model_variant : ''}</TableCell>
                    <TableCell>{row?.vehicle_type && row?.vehicle_type?.name ? row?.vehicle_type?.name : ''}</TableCell>

                    <TableCell>{row?.month || ''}</TableCell>
                    <TableCell>{row?.year || ''}</TableCell>

                    {!isUserModerator && <TableCell align="center" sx={{ pr: 3 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();

                            setEditVehicleData(row);
                            setTimeout(() => {
                              setOpenAddCategory(true);
                            }, 200);
                          }}
                          aria-label="Edit"
                        >
                          <ModeEditIcon color="primary" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteModal(true);
                            setDeleteId(row.id);
                          }}
                          aria-label="Remove"
                        >
                          <DeleteOutlineIcon color="error" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>}
                  </TableRow>
                );
              })}

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

      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          title="Delete Vehicle"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Vehicle"
        />
      )}
      {openAddCategory && (
        <Dialog
          maxWidth="sm"
          fullWidth
          onClose={handleAddCategoryClose}
          open={openAddCategory}
          sx={{ "& .MuiDialog-paper": { p: 0 } }}
        >
          {openAddCategory && (
            <AddVehicleData
              vehicleType={vehicleType}
              editVehicleData={editVehicleData}
              reloadApi={reloadApi}
              open={openAddCategory}
              handleCloseModal={handleAddCategoryClose}
              brandList={brandList}
            />
          )}
        </Dialog>
      )}
    </MainCard>
  );
};

export default VehiclesData;
