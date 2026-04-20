import { useState, useEffect } from "react";
import API from "../../../api/axios";

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
import renderHTML from 'react-render-html';

import AddIcon from "@mui/icons-material/AddTwoTone";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";

import MainCard from "ui-component/cards/MainCard";
import Avatar from "ui-component/extended/Avatar";
import AddBlog from "./components/addBlog";
import DeleteModal from "../e-commerce/components/deleteModal";

import { successAlert, apiErrorHandler, errorAlert } from "../../helpers";
import { getComparator, stableSort } from "utils/helpers/blogs";
import usePermission from "hooks/usePermission";

const headCells = [
  {
    id: "image",
    numeric: false,
    label: "Blog Image",
    align: "center",
  },
  {
    id: "creator_name",
    numeric: false,
    label: "Creator Name",
    align: "left",
  },
  {
    id: "title",
    numeric: false,
    label: "Blog Title",
    align: "left",
  },
  {
    id: "category_name",
    numeric: false,
    label: "Blog Category",
    align: "left",
  },
  {
    id: "description",
    numeric: false,
    label: "Blog Description",
    align: "left",
  },
  {
    id: "content",
    numeric: false,
    label: "Blog Content",
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

const BlogsList = () => {
  const theme = useTheme();
  const { isUserModerator } = usePermission();

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);

  const [rows, setRows] = useState([]);

  const [blogsList, setBlogsList] = useState([]);
  const [blogsCategories, setBlogCategories] = useState([])
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [addBlog, setAddBlog] = useState(false);
  const [editBlog, setEditBlog] = useState({});
  const [search, setSearch] = useState("");

  const handleBlogList = async (p) => {
    const page = p || 1;
    try {
      const response = await API.get(`/admin/blogs?page=${page}&limit=${rowsPerPage}`);

      if (response?.data?.data?.list) {
        setTotalData(response.data.data.total_count || 0)
        setBlogsList(response.data.data.list);
      }
    } catch (error) {
      setBlogsList([]);
      alert("Something went wrong while getting the Blog List");
    }
  };

  useEffect(() => {
    handleBlogList(page + 1);
  }, [page, rowsPerPage]);

  const handleBlogCategory = () => {
    API.get('admin/blog-categories').then((res) => {
      if (res && res.data && res.data.data) {
        setBlogCategories(res.data.data)
      }

    }).catch(() => {
      errorAlert("Something went wrong while getting the Blog Category");

    })
  }

  useEffect(() => {
    handleBlogCategory();
  }, [])

  useEffect(() => {
    setRows(blogsList);
  }, [blogsList]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
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

  const reloadApi = () => {
    if (editBlog && Object.keys(editBlog).length > 0) {
      setEditBlog({})
    }

    if (page === 0)
      handleBlogList(page);

    else
      setPage(0);

  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`/admin/blogs/${deleteId}`);
      if (response && response.status === 200) {
        setDeleteModal(false);
        setDeleteId(null);
        setTimeout(() => {
          successAlert("Blog deleted successfully.");
          reloadApi();
        }, 300);
      }
    } catch (error) {
      setDeleteId(null);
      apiErrorHandler(
        error,
        "Something went wrong while deleting the Blog."
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
            "title",
            "description",
            "content",
            "creator_name",
            "blog_category"
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
      handleBlogList();
    }
  };

  return (
    <MainCard
      title="Blog List"
      content={false}
      secondary={!isUserModerator && <Button
        variant="text"
        onClick={() => {
          setEditBlog({});
          setAddBlog(true);
        }}
        startIcon={<AddIcon />}
      >
        Add Blog
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
          placeholder="Search Blog"
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
                      {row.creator_name}
                    </TableCell>

                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row.title}
                    </TableCell>

                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.blog_category?.name || ''}
                    </TableCell>

                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row.description}
                    </TableCell>

                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      {row?.content ? renderHTML(row.content) : ''}
                    </TableCell>

                    {!isUserModerator && <TableCell align="center" sx={{ pr: 3, display: "flex" }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            setEditBlog(row);
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={totalData}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {addBlog && <AddBlog open={addBlog} handleCloseModal={() => setAddBlog(false)} reloadApi={reloadApi} editBlog={editBlog} blogsCategories={blogsCategories} />}
      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          title="Delete Blog"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Blog"
        />
      )}
    </MainCard>
  );
};

export default BlogsList;
