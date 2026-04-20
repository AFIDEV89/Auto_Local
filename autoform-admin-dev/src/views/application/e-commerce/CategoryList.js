import * as React from "react";
import API from "../../../api/axios";

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

import { format } from "date-fns";

import MainCard from "ui-component/cards/MainCard";
import Avatar from "ui-component/extended/Avatar";
import DeleteModal from "./components/deleteModal";
import AddCategory from "./components/addCategory";
import CsvToolbar from "../../components/CsvToolbar";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/AddTwoTone";
import { successAlert, apiErrorHandler } from "../../helpers";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import usePermission from "hooks/usePermission";
import { getComparator, stableSort } from "utils/helpers/blogs";

const headCells = [
  {
    id: "id",
    numeric: true,
    label: "Avatar"
  },
  {
    id: "name",
    numeric: false,
    label: "Product Category Name",
    align: "left"
  },
  {
    id: "created",
    numeric: false,
    label: "Created",
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

const CategoryList = () => {
  const theme = useTheme();
  const { isUserModerator } = usePermission()

  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [categoryList, setCategoryList] = React.useState([]);
  const [deleteModal, setDeleteModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);

  const [totalCount, setTotalCount] = React.useState(1);

  const [openAddCategory, setOpenAddCategory] = React.useState(false);
  const [editCategoryData, setEditCategoryData] = React.useState({});

  const handleCategoryList = async (page) => {
    try {
      const response = await API.get(
        `/category/get-list?page=${page}&limit=${rowsPerPage}`
      );

      if (response && response?.data && response?.data?.data) {
        setTotalCount(response?.data?.data?.total_count);
        setCategoryList(response?.data?.data?.list);
      }
    } catch (error) {
      apiErrorHandler(
        error,
        "Something went wrong while getting the Category List"
      );
    }
  };

  React.useEffect(() => {
    setRows(categoryList);
  }, [categoryList]);

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
      handleCategoryList(page + 1);
    }
  };

  React.useEffect(() => {
    handleCategoryList(page + 1);
  }, [page, rowsPerPage]);

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


  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleAddCategoryClose = () => {
    setOpenAddCategory(false);
    setEditCategoryData({});
  };

  const reloadApi = () => {
    if (page === 0)
      handleCategoryList(page + 1);

    else
      setPage(0);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/category/delete/${deleteId}`);
      if (response && response.status === 200) {
        setDeleteModal(false);
        setTimeout(() => {
          successAlert("Category deleted successfully.");
          reloadApi();
        }, 300);
      }
    } catch (error) {
      apiErrorHandler(
        error,
        "Something went wrong while deleting the Category."
      );
    }
  };

  return (
    <MainCard
      title="Product Category List"
      content={false}
      secondary={!isUserModerator && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CsvToolbar entityName="categories" onImportComplete={reloadApi} />
              <Button
                  variant="text"
                  onClick={() => {
                      setOpenAddCategory(true);
                  }}
                  startIcon={<AddIcon />}
              >
                  Add Product Category
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
          placeholder="Search Product Category "
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
                      align="center"
                      component="th"
                      id={labelId}
                      scope="row"
                      onClick={(event) => handleClick(event, row.name)}
                      sx={{ cursor: "pointer" }}
                    >
                      <Avatar src={row.image} size="md" variant="rounded" />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(row.createdAt), "E, MMM d yyyy")}
                    </TableCell>

                    {!isUserModerator && <TableCell align="center" sx={{ pr: 3 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();

                            setEditCategoryData(row);
                            setTimeout(() => {
                              setOpenAddCategory(true);
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
                );
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={totalCount || 1}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          title="Delete Category"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Category"
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
            <AddCategory
              editCategoryData={editCategoryData}
              reloadApi={reloadApi}
              open={openAddCategory}
              handleCloseModal={handleAddCategoryClose}
            />
          )}
        </Dialog>
      )}
    </MainCard>
  );
};

export default CategoryList;
