import React, { useState } from "react";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Input,
    Typography,
    Avatar
} from "@mui/material";
import API from "api/axios";
import { errorAlert, successAlert } from "../../../helpers";
import config from 'config';

const AddTestimonial = ({ open, closeModal, fetchData, isEditing, initialValues }) => {
    // Form State
    const [formData, setFormData] = useState({
        clientName: initialValues?.clientName || "",
        role: initialValues?.role || "",
        description: initialValues?.description || "",
        rating: initialValues?.rating || 5,
        type: initialValues?.type || "carOwners",
        status: initialValues?.status || "Active",
        image: initialValues?.image || ""
    });

    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return null;
        if (imagePath.startsWith('http')) return imagePath;
        return `${config.IMAGE_URL}${imagePath}`;
    };

    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(getFullImageUrl(initialValues?.image));
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUploadImage = async () => {
        if (!selectedImage) return formData.image;

        const uploadData = new FormData();
        uploadData.append("file", selectedImage);

        try {
            const response = await API.post("upload/single", uploadData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response?.data?.statusCode === 200) {
                return response.data.data; // The backend returns the relative path /uploads/...
            }
        } catch (error) {
            console.error("Image upload failed:", error);
            errorAlert("Failed to upload image.");
        }
        return formData.image;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.clientName || !formData.description) {
            errorAlert("Client Name and Description are required.");
            return;
        }

        setLoading(true);
        let imagePath = formData.image;
        
        // If there's a new image, upload it first
        if (selectedImage) {
            imagePath = await handleUploadImage();
        }

        const submitData = {
            ...formData,
            image: imagePath || formData.image, // Fallback to old image if upload fails but we proceed
            rating: parseInt(formData.rating, 10)
        };

        try {
            if (isEditing && initialValues?.id) {
                const response = await API.put(`testimonials/${initialValues.id}`, submitData);
                if (response?.data?.statusCode === 200) {
                    successAlert("Testimonial Updated Successfully!");
                    fetchData();
                    closeModal();
                } else {
                    errorAlert("Failed to update testimonial.");
                }
            } else {
                const response = await API.post("testimonials", submitData);
                if (response?.data?.statusCode === 200) {
                    successAlert("Testimonial Added Successfully!");
                    fetchData();
                    closeModal();
                } else {
                    errorAlert("Failed to add testimonial.");
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
            errorAlert(error?.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <DialogTitle>{isEditing ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3}>
                    {/* Image Upload Area */}
                    <Grid item xs={12} display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Avatar
                            src={imagePreview}
                            sx={{ width: 100, height: 100, boxShadow: 1 }}
                        />
                        <Button variant="outlined" component="label" size="small">
                            Upload Avatar Image
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                        </Button>
                        <Typography variant="caption" color="textSecondary">Optimal Format: Square (1:1), less than 2MB.</Typography>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Client Name *"
                            name="clientName"
                            value={formData.clientName}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Role / Designation"
                            placeholder="e.g. Creta Owner / Franchise Partner"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Type</InputLabel>
                            <Select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="carOwners">Customer / Car Owner</MenuItem>
                                <MenuItem value="franchisePartners">Franchise Partner</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Rating (Stars)</InputLabel>
                            <Select
                                name="rating"
                                value={formData.rating}
                                onChange={handleInputChange}
                            >
                                {[1,2,3,4,5].map(num => (
                                    <MenuItem key={num} value={num}>{num} Star{num > 1 && 's'}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Inactive">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Testimonial / Review Text *"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            multiline
                            rows={4}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} color="secondary" disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? "Saving..." : "Save Testimonial"}
                </Button>
            </DialogActions>
        </form>
    );
};

export default AddTestimonial;
