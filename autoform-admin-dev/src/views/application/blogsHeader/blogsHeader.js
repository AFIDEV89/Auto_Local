import { useState, useEffect } from "react";
import API from "../../../api/axios";

import {
  CardContent,
  InputAdornment,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from "@mui/material";

import { format } from "date-fns";

import MainCard from "ui-component/cards/MainCard";
import Avatar from "ui-component/extended/Avatar";
import ConfirmationDialog from "./components/ConfirmationDialog";
import { errorAlert } from "views/helpers";
import { getComparator, stableSort } from "utils/helpers/blogs";
import usePermission from "hooks/usePermission";
import SearchIcon from "@mui/icons-material/Search";

const headCells = [
  {
    id: "header",
    numeric: false,
    label: "Header",
    align: "center"
  },
  {
    id: "image",
    numeric: false,
    label: "Blog Image",
    align: "center"
  },
  {
    id: "creator_name",
    numeric: false,
    label: "Creator Name",
    align: "left"
  },
  {
    id: "title",
    numeric: false,
    label: "Blog Title",
    align: "left"
  },
  {
    id: "blog_category",
    numeric: false,
    label: "Blog Category",
    align: "left"
  },
  {
    id: "created",
    numeric: false,
    label: "Created",
    align: "left"
  }
];

function EnhancedTableHead({
  order,
  orderBy,
  onRequestSort
}) {
  const { isUserModerator } = usePermission();
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {
          headCells.map((headCell) => {

            if(headCell.id === "header" && isUserModerator) {
              return <></>
            }

            return (
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
            )
          }
          )
        }
      </TableRow>
    </TableHead>
  );
}

const BlogsList = () => {
  const { isUserModerator } = usePermission();

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("calories");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalData, setTotalData] = useState(0);

  const [rows, setRows] = useState([]);

  const [blogsList, setBlogsList] = useState([]);
  const [headerBlogId, setHeaderBlogId] = useState(null);
  const [tempHeaderBlogId, setTempHeaderBlogId] = useState(null);
  const [search, setSearch] = useState("");
  const handleBlogList = async (p) => {
    const page = p || 1;
    try {
      const response = await API.get(`/admin/blogs?page=${page}&limit=${rowsPerPage}`);

      if (response?.data?.data?.list) {
        setTotalData(response.data.data.total_count || 0)
        setBlogsList(response.data.data.list);
      }
    }
    catch (error) {
      setBlogsList([]);
      alert("Something went wrong while getting the Blog List");
    }
  };

  useEffect(() => {
    handleBlogList(page + 1);
  }, [page, rowsPerPage]);

  useEffect(() => {
    const headerBlog = blogsList.find(e => e.is_header);
    if (headerBlog) {
      setHeaderBlogId(headerBlog.id)
    }

    setRows(blogsList);
  }, [blogsList]);

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

  const markBlogAsHeader = (event) => {
    const blogId = Number(event.target.value);

    setTempHeaderBlogId(blogId)
    handleDialogVisibility()
  }

  const handleDialogVisibility = () => {
    setIsDialogOpen(prev => !prev)
  }

  const handleConfirmation = async () => {
    try {
      const response = await API.put(`/admin/blogs/header/${tempHeaderBlogId}`);

      if (response && response.status === 200) {
        setHeaderBlogId(tempHeaderBlogId);
        setTempHeaderBlogId(null);

        handleDialogVisibility();
      }
    } catch (error) {
      errorAlert("Something went wrong. Please try again later.");
    }
  }

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
            "creator_name",
            "blog_category",
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
    <MainCard title="Header Blog" content={false}>
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
          placeholder="Search Blog Header"
          value={search}
          size="small"
        />
      </CardContent>
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
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    id={`${index} + ${row.name}`}
                    role="checkbox"
                    tabIndex={-1}
                    key={`${index} + ${row.name}`}
                  >
                    {!isUserModerator && <TableCell
                      align="center"
                      component="th"
                      id={labelId}
                      scope="row"
                      sx={{ cursor: "pointer" }}
                    >
                      <Radio
                        checked={headerBlogId === row.id}
                        onChange={markBlogAsHeader}
                        value={row.id}
                        name="header-radio-buttons"
                      />
                    </TableCell>}

                    <TableCell
                      align="center"
                      component="th"
                      id={labelId}
                      scope="row"
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

                    <TableCell>
                      {row?.createdAt ? format(new Date(row.createdAt), "E, MMM d yyyy") : ''}
                    </TableCell>
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

      <ConfirmationDialog
        open={isDialogOpen}
        handleClose={handleDialogVisibility}
        handleConfirmation={handleConfirmation}
      />
    </MainCard>
  );
};

export default BlogsList;
