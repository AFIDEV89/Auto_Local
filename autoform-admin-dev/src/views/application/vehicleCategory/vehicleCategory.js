import { useState, useEffect } from "react";
import API from "../../../api/axios";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  TablePagination,
  Button,
  CardContent,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";

import AddIcon from "@mui/icons-material/AddTwoTone";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";

// project imports
import MainCard from "ui-component/cards/MainCard";

import AddVehicleCategory from "./components/addVehicleCategory";
import CsvToolbar from "../../components/CsvToolbar";
import DeleteModal from "../e-commerce/components/deleteModal";

// assets
import { successAlert, apiErrorHandler } from "../../helpers";
import usePermission from "hooks/usePermission";
import { getComparator, stableSort } from "utils/helpers/blogs";

// table header options
const headCells = [
  {
    id: "id",
    numeric: false,
    label: "Vehicle Id",
    align: "left",
  },
  {
    id: "name",
    numeric: false,
    label: "Vehicle Category",
    align: "left",
  },
];


const EnhancedTableHead = ({
  order,
  orderBy,
  numSelected,
  onRequestSort,
  theme,
}) => {
  const { isUserModerator } = usePermission();
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

// ==============================|| Category List ||============================== //

const VehicleCategory = () => {
  const theme = useTheme();
  const { isUserModerator } = usePermission();

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("calories");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);

  const [page, setPage] = useState(0);
  const [totalData , setTotalData]= useState(0);
  const [rows, setRows] = useState([]);

  const [vehicleCategoryList, setVehicleCategory] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [addVehicleCategory, setAddVehicleCategory] = useState(false);
  const [editVehicleCategory, setEditVehicleCategory] = useState({});
  const [search, setSearch] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const handleVehicleCategoryList = async (p) => {
    let page= p||1;
    try {
      const response = await API.get(`vehicle-category/get-list?page=${page}&limit=${rowsPerPage}`);

      if (response && response?.data && response?.data?.data && response?.data?.data?.list) {
        setVehicleCategory(response?.data?.data?.list);
        setTotalData(response?.data?.data?.total_count)
      }
    } catch (error) {
      setVehicleCategory([]);
      alert("Something went wrong while getting the Vehicle Category");
    }
  };

  useEffect(() => {
    handleVehicleCategoryList(page+1);
  }, [page , rowsPerPage]);

  useEffect(() => {
    setRows(vehicleCategoryList);
  }, [vehicleCategoryList]);

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

  const reloadApi = () => {
    if (editVehicleCategory && Object.keys(editVehicleCategory).length > 0) {
      setEditVehicleCategory({});
    }
    handleVehicleCategoryList();
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`vehicle-category/delete/${deleteId}`);
      if (response && response.status === 200) {
        setDeleteModal(false);
        setDeleteId(null);
        setTimeout(() => {
          successAlert("Vehicle Category deleted successfully.");
          reloadApi();
        }, 300);
      }
    } catch (error) {
      setDeleteId(null);
      apiErrorHandler(
        error,
        "Something went wrong while deleting the Brand Model."
      );
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
            "name",
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
      handleVehicleCategoryList(); // Fix: reload full list for current page
    }
  };

  return (
    <MainCard 
    title="Vehicle Category List" 
    content={false}
    secondary={!isUserModerator && (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <CsvToolbar entityName="vehicle_categories" onImportComplete={reloadApi} />
            <Button
                variant="text"
                onClick={() => {
                    setEditVehicleCategory({});
                    setAddVehicleCategory(true);
                }}
                startIcon={<AddIcon />}
            >
                Add Vehicle Category
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
          placeholder="Search Vehicle Category"
          value={search}
          size="small"
        />
      </CardContent>
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
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    id={`${index} + ${row.name}`}
                    role="checkbox"
                    tabIndex={-1}
                    key={`${index} + ${row.name}`}
                  >

                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row.id}
                    </TableCell>

                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row.name}
                    </TableCell>

                    {!isUserModerator && <TableCell align="center" sx={{ pr: 3 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            setEditVehicleCategory(row);
                            setTimeout(() => {
                              setAddVehicleCategory(true);
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

      {/* table pagination */}
      <TablePagination
         rowsPerPageOptions={[5, 10, 25, 50 ,100]}
        component="div"
        count={totalData}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {addVehicleCategory && (
        <AddVehicleCategory
          open={addVehicleCategory}
          handleCloseModal={() => setAddVehicleCategory(false)}
          reloadApi={reloadApi}
          editVehicleCategory={editVehicleCategory}
        />
      )}
      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          title="Delete Vehicle Category"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Vehicle Category"
        />
      )}
    </MainCard>
  );
};

export default VehicleCategory;
