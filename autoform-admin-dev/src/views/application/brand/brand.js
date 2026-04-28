import { useState, useEffect } from "react";
import API from "../../../api/axios";

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
import MainCard from "ui-component/cards/MainCard";

import AddBrand from "./components/addBrand";
import CsvToolbar from "../../components/CsvToolbar";
import DeleteModal from "../e-commerce/components/deleteModal";

import { successAlert, apiErrorHandler } from "../../helpers";
import usePermission from "hooks/usePermission";
import { getComparator, stableSort } from "utils/helpers/blogs";
import SearchIcon from "@mui/icons-material/Search";

const headCells = [

  {
    id: "id",
    numeric: false,
    label: "Brand Id",
    align: "left",
  },
  {
    id: "name",
    numeric: false,
    label: "Brand Name",
    align: "left",
  },
  {
    id: "vehicle_type",
    numeric: false,
    label: "Vehicle Type",
    align: "left",
  },

];

const EnhancedTableHead = ({
  order,
  orderBy,
  numSelected,
  onRequestSort,
  theme
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

const BrandList = () => {
  const theme = useTheme();
  const { isUserModerator } = usePermission();

  const [order, setOrder] = useState("desc");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [page, setPage] = useState(0);

  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [rows, setRows] = useState([]);

  const [brandList, setBrandList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [addBrand, setAddBrand] = useState(false);
  const [editBrand, setEditBrand] = useState({});
  const [search, setSearch] = useState("");
  const handleBrandList = async (p) => {
    const page = p || 1;
    try {
      const response = await API.get(`brand/get-list?page=${page}&limit=${rowsPerPage}`);

      if (response && response?.data && response?.data?.data && response?.data?.data?.list) {
        setBrandList(response?.data?.data?.list);
        setTotalData(response?.data?.data?.total_count || 0)
      }
    } catch (error) {
      setBrandList([]);
      alert("Something went wrong while getting the Brand List");
    }
  };

  useEffect(() => {
    handleBrandList(page + 1);
  }, [page, rowsPerPage])

  useEffect(() => {
    setRows(brandList);
  }, [brandList]);

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
    if (editBrand && Object.keys(editBrand).length > 0) {
      setEditBrand({})
    }
    if (page === 0) handleBrandList(page);
    else setPage(0);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/brand/delete/${deleteId}`);
      if (response && response.status === 200) {
        setDeleteModal(false);
        setDeleteId(null);
        setTimeout(() => {
          successAlert("Brand deleted successfully.");
          reloadApi();
        }, 300);
      }
    } catch (error) {
      setDeleteId(null);
      apiErrorHandler(
        error,
        "Something went wrong while deleting the Brand."
      );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    const newString = event?.target.value;
    setSearch(newString || "");
    console.log('rows', rows);
    if (newString) {
      const newRows =
        rows &&
        rows.length > 0 &&
        rows?.filter((row) => {
          let matches = true;

          const properties = [
            "name",
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
      setRows(newRows);
    } else {
      handleBrandList();
    }
  };

  return (
    <MainCard
      title="Brand List"
      content={false}
      secondary={!isUserModerator && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CsvToolbar entityName="brands" onImportComplete={reloadApi} />
              <Button
                  variant="text"
                  onClick={() => {
                      setEditBrand({});
                      setAddBrand(true);
                  }}
                  startIcon={<AddIcon />}
              >
                  Add Brand
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
          placeholder="Search Brand"
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
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.vehicle_type?.name}
                    </TableCell>


                    {!isUserModerator && <TableCell align="center" sx={{ pr: 3 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            setEditBrand(row);
                            setTimeout(() => {
                              setAddBrand(true);
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

      {addBrand && <AddBrand open={addBrand} handleCloseModal={() => setAddBrand(false)} reloadApi={reloadApi} editBrand={editBrand} />}

      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          title="Delete Brand"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Brand"
        />
      )}
    </MainCard>
  );
};

export default BrandList;
