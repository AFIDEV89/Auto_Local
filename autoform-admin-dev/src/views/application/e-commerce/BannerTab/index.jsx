import React, { useEffect, useState } from "react";
import API from "api/axios";

import {
  Button,
  CardContent,
  Grid,
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
  Box,
} from "@mui/material";

import MainCard from "ui-component/cards/MainCard";
import Avatar from "ui-component/extended/Avatar";
import DeleteModal from "../components/deleteModal";
import CreateBanner from "./CreateBanner";
import CsvToolbar from "../../../components/CsvToolbar";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/AddTwoTone";
import { successAlert, apiErrorHandler, errorAlert } from "views/helpers";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getLimit, crateLimit, updateLimit } from "../CommonLimit";
import usePermission from "hooks/usePermission";
import { getComparator, stableSort } from "utils/helpers/blogs";

const headCells = [
  {
    id: "id",
    numeric: true,
    label: "",
    align: "center",
  },
  {
    id: "title",
    numeric: false,
    label: "Banner Name",
    align: "left"
  },
  {
    id: "btn_url",
    numeric: false,
    label: "Button URL",
    align: "left",
  }
];

const EnhancedTableHead = ({
  order,
  orderBy,
  onRequestSort
}) => {
  const { isUserModerator } = usePermission();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {
          headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              size="small"
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
          ))
        }
        {!isUserModerator && (
          <TableCell sortDirection={false} align="center" sx={{ pr: 3 }}>
            <Typography variant="subtitle1">
              Action
            </Typography>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
}

const BannerTab = () => {
  const { isUserModerator } = usePermission();

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [openAddBanner, setOpenAddBanner] = useState(false);
  const [editBannerData, setEditBannerData] = useState({});
  const [bannerLimit, setBannerLimit] = useState();
  const [bannerLimitData, setBannerLimitData] = useState({});

  const handleBannerList = async (p) => {
    const page = p || 1;
    try {
      const response = await API.get(`/Banner/get-list?page=${page}&limit=${rowsPerPage}`);
      if (response && response?.data && response?.data?.data && response?.data?.data?.list) {
        setTotalData(response?.data?.data?.total_count || 0)
        setBannerList(response?.data?.data?.list);
      }
    } catch (error) {
      alert("Something went wrong while getting the Banner List");
    }
  };

  useEffect(() => {
    handleBannerList(page + 1);
    getBannerLimit();
  }, [page, rowsPerPage]);

  useEffect(() => {
    setRows(bannerList);
  }, [bannerList]);

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
            "title"
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
      handleBannerList();
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const handleAddBannerClose = () => {
    setOpenAddBanner(false);
    setEditBannerData({});
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/banner/delete/${deleteId}`);

      if (response && response.status === 200) {
        if (response?.data?.statusCode === 400) {
          setDeleteModal(false);
          setTimeout(() => {
            errorAlert(response?.data?.message);
            handleBannerList();
          }, 300);
        }
        else {
          setDeleteModal(false);
          setTimeout(() => {
            successAlert("Banner deleted successfully.");
            handleBannerList();
          }, 300);
        }
      }
    }
    catch (error) {
      apiErrorHandler(error, "Something went wrong while deleting the Banner.");
    }
  };

  const handleKeyPress = (event) => {
    if (event?.key === "-" || event?.key === "+") {
      event.preventDefault();
    }
  };

  const updateField = (e) => {
    const val = e.target.value;
    var numbers = /^[0-9]+$/;

    if (val.match(numbers)) {
      setBannerLimit(e.target.value);
    }

    if (val == 0) {
      setBannerLimit(1);
    }
  };

  const getBannerLimit = async () => {
    const currentLimit = await getLimit();

    if (currentLimit) {
      setBannerLimit(currentLimit?.data?.banners_limit);
      setBannerLimitData(currentLimit?.data);
    }
  };

  const updateBannerLimit = async (e) => {
    if (Object.keys(bannerLimitData).length > 0) {
      let payload = {
        banners_limit: bannerLimit,
        id: bannerLimitData?.id
      };

      let createLimit = await updateLimit(payload);

    } else {
      const payload = {
        banners_limit: bannerLimit
      };

      let createLimit = await crateLimit(payload);

      setBannerLimit(createLimit?.data?.banners_limit);
      setBannerLimitData(createLimit?.data);
    }
  };

  return (
    <MainCard
      title="Banner List"
      content={false}
      secondary={!isUserModerator && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CsvToolbar entityName="banners" onImportComplete={handleBannerList} />
              <Button
                  variant="text"
                  onClick={() => {
                      setOpenAddBanner(true);
                  }}
                  startIcon={<AddIcon />}
              >
                  Add Banner
              </Button>
          </Box>
      )}
    >
      <CardContent>
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12} sm={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
              placeholder="Search Banner "
              value={search}
              size="small"
            />
          </Grid>

          {!isUserModerator && <Grid item xs={12} sm={6}>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    Banners Limit
                  </InputAdornment>
                ),
              }}
              data-shrink={true}
              type="number"
              onChange={updateField}
              placeholder="Update Limit"
              value={bannerLimit}
              size="small"
              onKeyPress={(event) => {
                handleKeyPress(event);
              }}
              min={1}
            />
            <Button
              className="updatebTN"
              type="button"
              variant="outlined"
              onClick={updateBannerLimit}
            >
              Update
            </Button>
          </Grid>}
        </Grid>
      </CardContent>

      {/* table */}
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice()
              .map((row, index) => {

                if (typeof row === "number") return null;

                return (
                  <TableRow
                    hover
                    id={`${index} + ${row.title}`}
                    tabIndex={-1}
                    key={`${index} + ${row.title}`}
                  >
                    <TableCell><Avatar src={row.image} size="md" variant="rounded" /></TableCell>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.url}</TableCell>

                    {!isUserModerator && <TableCell align="center" sx={{ display: "flex" }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();

                            setEditBannerData(row);
                            setTimeout(() => {
                              setOpenAddBanner(true);
                            }, 200);
                          }}
                        >
                          <ModeEditIcon color="primary" fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteModal(true);
                            setDeleteId(row.id);
                          }}
                        >
                          <DeleteOutlineIcon color="error" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>}
                  </TableRow>
                )
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
          title="Delete Banner"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Banner"
        />
      )}
      {openAddBanner && (
        <Dialog
          maxWidth="sm"
          fullWidth
          onClose={handleAddBannerClose}
          open={openAddBanner}
        >
          <CreateBanner
            editBannerData={editBannerData}
            reloadApi={handleBannerList}
            handleCloseModal={handleAddBannerClose}
          />
        </Dialog>
      )}
    </MainCard>
  );
};

export default BannerTab;
