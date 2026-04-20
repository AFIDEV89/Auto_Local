import React, { useRef } from "react";
import { Button, Box } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import UploadIcon from "@mui/icons-material/Upload";
import API from "api/axios";
import { successAlert, errorAlert } from "../../helpers";

const CsvToolbar = ({ entityName, onImportComplete, disabled = false }) => {
    const fileInputRef = useRef(null);

    const handleExport = async () => {
        try {
            const response = await API.get(`csv/export/${entityName}`, {
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${entityName}_export.csv`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Export error:", error);
            errorAlert("Failed to export CSV.");
        }
    };

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await API.post(`csv/import/${entityName}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status >= 200 && response.status < 300) {
                const { created, updated, errors } = response.data.data;
                successAlert(`Imported! Created: ${created}, Updated: ${updated}, Errors: ${errors.length}`);
                if (errors.length > 0) {
                    console.error("Import Errors:", errors);
                }
                if (onImportComplete) {
                    onImportComplete();
                }
            } else {
                errorAlert(response.data.message || "Failed to import CSV");
            }
        } catch (error) {
            console.error("Import error:", error);
            errorAlert(error.response?.data?.message || "Failed to import CSV.");
        } finally {
            // Reset the file input so the same file can be selected again
            event.target.value = null;
        }
    };

    return (
        <Box sx={{ display: "flex", gap: 1 }}>
            <Button
                variant="outlined"
                color="secondary"
                startIcon={<DownloadIcon />}
                onClick={handleExport}
                disabled={disabled}
                size="small"
            >
                Export CSV
            </Button>
            <Button
                variant="outlined"
                color="secondary"
                startIcon={<UploadIcon />}
                onClick={handleImportClick}
                disabled={disabled}
                size="small"
            >
                Import CSV
            </Button>
            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
        </Box>
    );
};

export default CsvToolbar;
