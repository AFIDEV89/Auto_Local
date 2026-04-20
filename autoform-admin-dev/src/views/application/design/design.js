import { useState, useEffect } from "react";
import API from "api/axios";

import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  TablePagination,
  Button,
  CardContent,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";

import AddIcon from "@mui/icons-material/AddTwoTone";
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Avatar from "ui-component/extended/Avatar";
import SearchIcon from "@mui/icons-material/Search";

import MainCard from "ui-component/cards/MainCard";
import AddDesign from "./components/addDesign";
import CsvToolbar from "../../components/CsvToolbar";
import DeleteModal from "../e-commerce/components/deleteModal";

import { successAlert, apiErrorHandler } from "../../helpers";
import usePermission from "hooks/usePermission";
import { getComparator, stableSort } from "utils/helpers/blogs";

const headCells = [
  {
    id: "id",
    numeric: false,
    label: "Images"
  },
  {
    id: "id",
    numeric: false,
    label: "Design Id"
  },
  {
    id: "name",
    numeric: false,
    label: "Design Name"
  },
];

const EnhancedTableHead = ({
  order,
  orderBy,
  onRequestSort
}) => {
  const { isUserModerator } = usePermission()

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

const DesignList = () => {
  const { isUserModerator } = usePermission()

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("calories");
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);

  const [designList, setDesignList] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [addDesign, setAddDesign] = useState(false);
  const [editDesign, setEditDesign] = useState({});
  const [search, setSearch] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event?.target.value, 10));
    setPage(0);
  };

  const handleDesignList = async (p) => {
    const page = p || 1;

    try {
      const response = await API.get(`design/get-list?page=${page}&limit=${rowsPerPage}`);

      if (
        response &&
        response?.data &&
        response?.data?.data &&
        response?.data?.data?.list
      ) {
        setDesignList(response?.data?.data?.list);
        setTotalData(response?.data?.data?.total_count || 0);
      }
    } catch (error) {
      setDesignList([]);
      alert("Something went wrong while getting the Design List");
    }
  };

  useEffect(() => {
    handleDesignList(page + 1);
  }, [page, rowsPerPage]);

  useEffect(() => {
    setRows(designList);
  }, [designList]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";

    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const reloadApi = () => {
    if (editDesign && Object.keys(editDesign).length > 0) {
      setEditDesign({});
    }

    if (page === 0) 
      handleDesignList(page);
    else 
      setPage(0);
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
      handleDesignList();
    }
  };

  const handleDelete = async () => {
    try {
      const response = await API.delete(`design/delete/${deleteId}`);

      if (response && response.status === 200) {
        setDeleteModal(false);
        setDeleteId(null);
        setTimeout(() => {
          successAlert("Brand Model deleted successfully.");
          reloadApi();
        }, 300);
      }
    } catch (error) {
      setDeleteId(null);
      apiErrorHandler(error, "Something went wrong while deleting the Brand Model.");
    }
  }

  return (
    <MainCard
      title="Design List"
      content={false}
      secondary={!isUserModerator && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <CsvToolbar entityName="designs" onImportComplete={reloadApi} />
              <Button
                  variant="text"
                  onClick={() => {
                      setEditDesign({});
                      setAddDesign(true);
                  }}
                  startIcon={<AddIcon />}
              >
                  Add Design
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
          placeholder="Search Design "
          value={search}
          size="small"
        />
      </CardContent>

      <TableContainer>
        <Table sx={{ minWidth: 750 }} size="small">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {
              stableSort(rows, getComparator(order, orderBy))
                .slice()
                .map((row, index) => {
                  if (typeof row === "number") return null;
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      id={`${index} + ${row.name}`}
                      tabIndex={-1}
                      key={`${index} + ${row.name}`}
                    >
                      <TableCell component="th" id={labelId} scope="row">
                        <Avatar src={row?.pictures?.[0]} size="md" variant="rounded" />
                      </TableCell>

                      <TableCell component="th" id={labelId} scope="row">
                        {row.id}
                      </TableCell>

                      <TableCell component="th" id={labelId} scope="row">
                        {row.name}
                      </TableCell>

                      {!isUserModerator && <TableCell align="center">
                        <IconButton
                          size="small"
                          title="Edit"
                          onClick={(e) => {
                            e.preventDefault();
                            setEditDesign(row);
                            setTimeout(() => {
                              setAddDesign(true);
                            }, 200);
                          }}
                        >
                          <EditTwoToneIcon color="primary" fontSize="small" />
                        </IconButton>

                        <IconButton
                          size="small"
                          title="Delete"
                          onClick={(e) => {
                            e.preventDefault();
                            setDeleteModal(true);
                            setDeleteId(row.id);
                          }}
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

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        component="div"
        count={totalData}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {addDesign && (
        <AddDesign
          open={addDesign}
          handleCloseModal={() => setAddDesign(false)}
          reloadApi={reloadApi}
          editDesign={editDesign}
        />
      )}

      {deleteModal && (
        <DeleteModal
          handleDelete={handleDelete}
          title="Delete Design Data"
          open={deleteModal}
          setOpen={setDeleteModal}
          type="Design"
        />
      )}
    </MainCard>
  );
};

export default DesignList;
