import * as React from "react";
import API from "../../../../api/axios";

import { useTheme } from "@mui/material/styles";
import {
  CardContent,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  Dialog,
  Button,
} from "@mui/material";

import MainCard from "ui-component/cards/MainCard";
import DeleteModal from "../components/deleteModal";
import AddStore from "./AddStore";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/AddTwoTone";
import { successAlert, apiErrorHandler } from "../../../helpers";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Loadable from "ui-component/Loadable";
import usePermission from "hooks/usePermission";
import { getComparator, stableSort } from "utils/helpers/blogs";

const headCells = [
  {
    id: "name",
    numeric: false,
    label: "Name",
    align: "left",
  },
  {
    id: "email",
    numeric: false,
    label: "Email"
  },
  {
    id: "contact_no",
    numeric: false,
    label: "Phone",
    align: "left",
  },
  {
    id: "street_address",
    numeric: false,
    label: "Address",
    align: "left",
    size: 'medium'
  },
  {
    id: "city",
    numeric: false,
    label: "City",
    align: "left",
  },
  {
    id: "country",
    numeric: false,
    label: "Country",
    align: "left",
  },
  {
    id: "postal_code",
    numeric: false,
    label: "Postal Code",
    align: "left",
  },
  {
    id: "state",
    numeric: false,
    label: "State",
    align: "left",
  },
  {
    id: "latitude",
    numeric: false,
    label: "Latitude",
    align: "left",
  },
  {
    id: "longitude",
    numeric: false,
    label: "Longitude",
    align: "left",
  }
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

const Store = () => {
  const theme = useTheme();
  const { isUserModerator } = usePermission();

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [totalData, setTotalData] = React.useState(0);
  const [storeInfo, setStoreInfo] = React.useState([]);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);

  const [openAddStore, setOpenAddStore] = React.useState(false);
  const [editStoreData, setEditStoreData] = React.useState({});

  const handlestoreInfo = async (p) => {
    const page = p || 1;
    try {
      const response = await API.get(`/store/get-list?page=${page}&limit=${rowsPerPage}`);
      if (response && response?.data && response?.data?.data && response?.data?.data?.list) {
        setTotalData(response?.data?.data?.total_count || 0)
        setStoreInfo(response?.data?.data?.list);
      }
    } catch (error) {
      alert("Something went wrong while getting the Store List");
    }
  };

  React.useEffect(() => {
    handlestoreInfo(page + 1);
  }, [page, rowsPerPage]);

  React.useEffect(() => {
    setRows(storeInfo);
  }, [storeInfo]);

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

    if (newString) {
      let stringVal = newString.toString().toLowerCase();

      const newRows =
        rows &&
        rows.length > 0 &&
        rows?.filter((row) => {
          let matches = true;
          let containsQuery = false;
          if (
            row && (row?.name.toString()
              .toLowerCase()
              .includes(stringVal) || row?.email.toString()
                .toLowerCase()
                .includes(stringVal) || row?.contact_no.toString()
                  .toLowerCase()
                  .includes(stringVal) || row?.address?.street_address.toString()
                    .toLowerCase()
                    .includes(stringVal) || row?.address?.city.toString()
                      .toLowerCase()
                      .includes(stringVal) || row?.address?.country.toString()
                        .toLowerCase()
                        .includes(stringVal) || row?.address?.postal_code.toString()
                          .toLowerCase()
                          .includes(stringVal) || row?.address?.state.toString()
                            .toLowerCase()
                            .includes(stringVal) || row?.address?.latitude.toString()
                              .toLowerCase()
                              .includes(stringVal) || row?.address?.longitude.toString()
                                .toLowerCase()
                                .includes(stringVal))
          ) {

            containsQuery = true;
          }

          if (!containsQuery) {
            matches = false;
          }
          return matches;
        });

      setRows(newRows);
    }
    else {
      handlestoreInfo(page + 1);
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

  const handleAddStoreClose = () => {
    setOpenAddStore(false);
    setEditStoreData({});
  };

  const reloadApi = () => {
    if (page === 0) handlestoreInfo(page);
    else setPage(0);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/store/delete/${deleteId}`);
      if (response && response.status === 200) {
        setDeleteModal(false);
        setTimeout(() => {
          successAlert("Store deleted successfully.");
          reloadApi();
        }, 300);
      }
    } catch (error) {
      apiErrorHandler(
        error,
        "Something went wrong while deleting the Store."
      );
    }
  };

  return (
    <MainCard
      title="Store List"
      content={false}
      secondary={!isUserModerator && <Button
        variant="text"
        onClick={() => {
          setOpenAddStore(true)
        }}
        startIcon={<AddIcon />}
      >
        Add Store
      </Button>}
    >
      <Loadable />
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
          placeholder="Search Store "
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
              .map((row, index) => {

                if (typeof row === "number") return null;
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    id={`${index} + ${row?.name}`}
                    role="checkbox"
                    key={`${index} + ${row?.name}`}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.name}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.email}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.contact_no}
                    </TableCell>
                    <TableCell
                      size={'medium'}
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.address?.street_address}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.address?.city}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.address?.country}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.address?.postal_code}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.address?.state}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.address?.latitude}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.address?.longitude}
                    </TableCell>

                    {!isUserModerator && <TableCell align="center" sx={{ pr: 3 }}>
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();

                            setEditStoreData(row);
                            setTimeout(() => {
                              setOpenAddStore(true);
                            }, 200);
                          }}
                          aria-label="Edit"
                        >
                          <ModeEditIcon color="primary" fontSize="small" />
                        </IconButton>

                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteModal(true);
                            setDeleteId(row?.id);
                          }}
                          aria-label="Remove"
                        >
                          <DeleteOutlineIcon color="error" fontSize="small" />
                        </IconButton>
                    </TableCell>}
                  </TableRow>
                );
              })}

          </TableBody>
        </Table>
      </TableContainer>

      {/* table pagination */}
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
          title="Delete Store"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Store"
        />
      )}

      {openAddStore && (
        <Dialog
          maxWidth="sm"
          fullWidth
          onClose={handleAddStoreClose}
          open={openAddStore}
          sx={{ "& .MuiDialog-paper": { p: 0 } }}
        >
          {openAddStore && (
            <AddStore
              editStoreData={editStoreData?.address}
              personalData={editStoreData}
              reloadApi={reloadApi}
              open={openAddStore}
              handleCloseModal={handleAddStoreClose}
            />
          )}
        </Dialog>
      )}
    </MainCard>
  );
};

export default Store;
