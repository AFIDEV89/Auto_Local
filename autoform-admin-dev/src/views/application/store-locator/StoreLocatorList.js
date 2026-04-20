import * as React from "react";
import API from "api/axios";

import { useTheme } from "@mui/material/styles";
import {
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  InputAdornment,
  Button,
  Dialog,
} from "@mui/material";

import MainCard from "ui-component/cards/MainCard";
import DeleteModal from "views/application/e-commerce/components/deleteModal";
import AddStoreLocator from "./components/AddStoreLocator";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/AddTwoTone";
import { successAlert, apiErrorHandler } from "views/helpers";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StarIcon from "@mui/icons-material/StarBorder";
import usePermission from "hooks/usePermission";
import { getComparator, stableSort } from "utils/helpers/blogs";
import StoreRatingsDialog from "./components/StoreRatingsDialog";

const headCells = [
  { id: "StoreName", label: "Store Name", align: "left" },
  { id: "StoreAdd", label: "Address", align: "left" },
  { id: "CityName", label: "City", align: "left" },
  { id: "StateName", label: "State", align: "left" },
  { id: "StoreLoc", label: "Coordinates (Lat,Long)", align: "left" }
];

const EnhancedTableHead = ({ order, orderBy, onRequestSort }) => {
  const { isUserModerator } = usePermission();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: 'bold' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
        {!isUserModerator && (
          <TableCell align="center" sx={{ pr: 3, fontWeight: 'bold' }}>
            Actions
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

const StoreLocatorList = () => {
  const theme = useTheme();
  const { isUserModerator } = usePermission();

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("StoreID");
  const [rows, setRows] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalData, setTotalData] = React.useState(0);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [search, setSearch] = React.useState("");

  const [openAddStore, setOpenAddStore] = React.useState(false);
  const [editStoreData, setEditStoreData] = React.useState({});
  const [openRatings, setOpenRatings] = React.useState(false);
  const [selectedStore, setSelectedStore] = React.useState(null);

  const fetchStores = async (p) => {
    const pageNum = p || 1;
    try {
      const response = await API.get(`/store-locator-isolated/get-list?page=${pageNum}&limit=${rowsPerPage}`);
      if (response?.data?.data?.list) {
        setTotalData(response.data.data.total_count || 0);
        setRows(response.data.data.list);
      }
    } catch (error) {
      apiErrorHandler(error, "Failed to fetch stores.");
    }
  };

  React.useEffect(() => {
    fetchStores(page + 1);
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/store-locator-isolated/delete/${deleteId}`);
      if (response.status === 200) {
        setDeleteModal(false);
        successAlert("Store deleted successfully.");
        fetchStores(page + 1);
      }
    } catch (error) {
      apiErrorHandler(error, "Failed to delete.");
    }
  };

  return (
    <MainCard
      title="Isolated Hostinger Store Locator"
      secondary={!isUserModerator && (
        <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => { setEditStoreData({}); setOpenAddStore(true); }}>
          Add Store
        </Button>
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
          placeholder="Search stores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
      </CardContent>

      <TableContainer>
        <Table sx={{ minWidth: 700 }}>
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row) => (
              <TableRow hover key={row.StoreID}>
                <TableCell>{row.StoreName}</TableCell>
                <TableCell>{row.StoreAdd}</TableCell>
                <TableCell>{row.city?.CityName}</TableCell>
                <TableCell>{row.state?.name}</TableCell>
                <TableCell>{row.StoreLoc}</TableCell>
                {!isUserModerator && (
                  <TableCell align="center">
                    <IconButton size="small" onClick={() => { setSelectedStore(row); setOpenRatings(true); }} sx={{ mr: 1 }}>
                      <StarIcon sx={{ color: '#efb810' }} fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => { setEditStoreData(row); setOpenAddStore(true); }}>
                      <ModeEditIcon color="primary" fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => { setDeleteId(row.StoreID); setDeleteModal(true); }}>
                      <DeleteOutlineIcon color="error" fontSize="small" />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
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

      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          title="Delete Isolated Store"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Store"
        />
      )}

      {openAddStore && (
        <Dialog maxWidth="md" fullWidth open={openAddStore} onClose={() => setOpenAddStore(false)}>
          <AddStoreLocator
            editStoreData={editStoreData}
            reloadApi={() => fetchStores(page + 1)}
            onClose={() => setOpenAddStore(false)}
          />
        </Dialog>
      )}

      {openRatings && (
        <Dialog maxWidth="sm" fullWidth open={openRatings} onClose={() => setOpenRatings(false)}>
          <StoreRatingsDialog
            store={selectedStore}
            onClose={() => setOpenRatings(false)}
          />
        </Dialog>
      )}
    </MainCard>
  );
};

export default StoreLocatorList;
