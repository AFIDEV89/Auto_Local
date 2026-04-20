import { useState, useEffect } from "react";
import API from "api/axios";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Button,
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
} from "@mui/material";

import AddIcon from "@mui/icons-material/AddTwoTone";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
// third-party
import { format } from "date-fns";

// project imports
import MainCard from "ui-component/cards/MainCard";
import AddBlogCategory from "./components/addBlogCategory";
import DeleteModal from "../e-commerce/components/deleteModal";

// assets
import { successAlert, apiErrorHandler } from "../../helpers";

import { getComparator, stableSort } from "utils/helpers/blogs";
import usePermission from "hooks/usePermission";

// table header options
const headCells = [
  {
    id: "creator_name",
    numeric: false,
    label: "ID",
    align: "left",
  },
  {
    id: "title",
    numeric: false,
    label: "Blog Category",
    align: "left",
  },

  {
    id: "created",
    numeric: false,
    label: "Created",
    align: "left",
  },
];

// ==============================|| TABLE HEADER ||============================== //

function EnhancedTableHead({
  order,
  orderBy,
  numSelected,
  onRequestSort,
  theme
}) {
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

const BlogCategory = () => {
  const theme = useTheme();
  const { isUserModerator } = usePermission();

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("calories");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);

  const [rows, setRows] = useState([]);

  const [blogCategories, setBlogCategories] = useState([]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [addBlog, setAddBlog] = useState(false);
  const [editBlogCategory, setEditBlogCategory] = useState({});
  const [search, setSearch] = useState("");

  const handleBlogList = async (p) => {
    const page = p || 1;
    try {
      const response = await API.get(
        `/admin/blog-categories?page=${page}&limit=${rowsPerPage}`
      );
      if (
        response &&
        response?.data &&
        response?.data?.data &&
        response?.data?.data?.list
      ) {
        setTotalData(response?.data?.data?.total_count || 0);
        setBlogCategories(response.data.data.list);
      }
    } catch (error) {
      setBlogCategories([]);
      alert("Something went wrong while getting the Blog List");
    }
  };

  useEffect(() => {
    handleBlogList(page + 1);
  }, [page]);

  useEffect(() => {
    setRows(blogCategories);
  }, [blogCategories]);

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

  const reloadApi = () => {
    if (editBlogCategory && Object.keys(editBlogCategory).length > 0) {
      setEditBlogCategory({});
    }

    if (page === 0) handleBlogList(page);
    else setPage(0);
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/admin/blog-categories/${deleteId}`);
      if (response && response.status === 200) {
        setDeleteModal(false);
        setDeleteId(null);
        setTimeout(() => {
          successAlert("Blog Category deleted successfully.");
          reloadApi();
        }, 300);
      }
    } catch (error) {
      setDeleteId(null);
      apiErrorHandler(error, "Something went wrong while deleting the Blog Category.");
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
            "name"
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
      handleBlogList();
    }
  };

  return (
    <MainCard
      title="Blog Category"
      content={false}
      secondary={!isUserModerator && <Button
        variant="text"
        onClick={() => {
          setEditBlogCategory({});
          setAddBlog(true);
        }}
        startIcon={<AddIcon />}
      >
        Add
      </Button>}
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
          placeholder="Search Blog Category"
          value={search}
          size="small"
        />
      </CardContent>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            numSelected={0}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            theme={theme}
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

                    <TableCell>
                      {row?.createdAt
                        ? format(new Date(row.createdAt), "E, MMM d yyyy")
                        : ""}
                    </TableCell>

                    {!isUserModerator && <TableCell align="center" sx={{ pr: 3 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            setEditBlogCategory(row);
                            setTimeout(() => {
                              setAddBlog(true);
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
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={totalData}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {addBlog && (
        <AddBlogCategory
          open={addBlog}
          handleCloseModal={() => setAddBlog(false)}
          reloadApi={reloadApi}
          editBlogCategory={editBlogCategory}
        />
      )}
      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          title="Delete Blog Category"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Blog Category"
        />
      )}
    </MainCard>
  );
};

export default BlogCategory;
