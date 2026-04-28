import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Typography,
  FormControl,
  Stack,
  Switch,
  TextField,
  Tooltip,
  RadioGroup,
} from "@mui/material";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import ColorPalette from "views/application/e-commerce/components/ColorPalette";

// third-party
import merge from "lodash/merge";
import * as Yup from "yup";
import { useFormik, Form, FormikProvider } from "formik";

// project imports
import { gridSpacing } from "store/constant";

// assets
import DeleteIcon from "@mui/icons-material/Delete";

// constant
const getInitialValues = (event, range) => {
  const newEvent = {
    title: "",
    brand: "",
    price: "",
    color: "#2196f3",
    productCode: "",
    availabilty: false,
    viewed: ""
  };

  if (event || range) {
    return merge({}, newEvent, event);
  }

  return newEvent;
};

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const AddEventFrom = ({
  event,
  range,
  handleDelete,
  handleCreate,
  handleUpdate,
  onCancel,
}) => {
  const theme = useTheme();
  const isCreating = !event;

  const backgroundColor = [
    {
      value: theme.palette.primary.main,
      color: "primary.main",
      label: "Default",
    },
    {
      value: theme.palette.error.main,
      color: "error.main",
    },
    {
      value: theme.palette.success.dark,
      color: "success.dark",
    },
    {
      value: theme.palette.secondary.main,
      color: "secondary.main",
    },
    {
      value: theme.palette.warning.dark,
      color: "warning.dark",
    },
    {
      value: theme.palette.orange.dark,
      color: "orange.dark",
    },
    {
      value: theme.palette.grey[500],
      color: "grey.500",
    },
    {
      value: theme.palette.primary.light,
      color: "primary.light",
    },
    {
      value: theme.palette.error.light,
      color: "error.light",
    },
    {
      value: theme.palette.success.light,
      color: "success.light",
    },
    {
      value: theme.palette.secondary.light,
      color: "secondary.light",
    },
    {
      value: theme.palette.warning.light,
      color: "warning.light",
    },
    {
      value: theme.palette.orange.light,
      color: "orange.light",
    },
  ];

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required("Name is required"),
    brand: Yup.string().required('Brand is required'),
    price: Yup.number().typeError('you must specify a number'),
    viewed: Yup.number().typeError('you must specify a number'),
    color: Yup.string().max(255),
    productCode: Yup.string().required("Product Code is required")

  });

  const formik = useFormik({
    initialValues: getInitialValues(event, range),
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        if (event) {
          // handleUpdate(event.id, data);
        } else {
          //handleCreate(data);
        }

        resetForm();
        onCancel();
        setSubmitting(false);
      } catch (error) {
        console.error(error);
      }
    },
  });

  const {
    values,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    getFieldProps,
    setFieldValue,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{event ? "Edit Event" : "Add Product"}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={gridSpacing}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  {...getFieldProps("title")}
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Brand"
                  {...getFieldProps("brand")}
                  error={Boolean(touched.brand && errors.brand)}
                  helperText={touched.brand && errors.brand}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Price"
                  {...getFieldProps("price")}
                  error={Boolean(touched.price && errors.price)}
                  helperText={touched.price && errors.price}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={values.availabilty}
                      {...getFieldProps("availabilty")}
                    />
                  }
                  label="Availability"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Code"
                  {...getFieldProps("productCode")}
                  error={Boolean(touched.productCode && errors.productCode)}
                  helperText={touched.productCode && errors.productCode}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Viewed"
                  {...getFieldProps("Viewed")}
                  error={Boolean(touched.viewed && errors.viewed)}
                  helperText={touched.viewed && errors.viewed}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Colors</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-label="color"
                    {...getFieldProps("color")}
                    onChange={(e) => setFieldValue("color", e.target.value)}
                    name="color-radio-buttons-group"
                    sx={{ "& .MuiFormControlLabel-root": { mr: 0 } }}
                  >
                    {backgroundColor.map((item, index) => (
                      <ColorPalette
                        key={index}
                        value={item.value}
                        color={item.color}
                        label={item.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                {!isCreating && (
                  <Tooltip title="Delete Event">
                    <IconButton
                      onClick={() => handleDelete(event?.id)}
                      size="large"
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button type="button" variant="outlined" onClick={onCancel}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {event ? "Edit" : "Add"}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
};

AddEventFrom.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  handleDelete: PropTypes.func,
  handleCreate: PropTypes.func,
  handleUpdate: PropTypes.func,
  onCancel: PropTypes.func,
};

export default AddEventFrom;
