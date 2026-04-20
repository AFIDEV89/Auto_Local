import React from "react";
import { apiErrorHandler } from "views/helpers";
import CloseIcon from "@mui/icons-material/Close";
import uploadIcon from "assets/images/e-commerce/uploadIcon.svg";

import { s3 } from 'views/aws/aws-s3'
import { Typography } from "@mui/material";

const MAX_FILE_SIZE = 20000000

const FileUploader = ({
    uploadFile,
    picUrl
}) => {
    const handleFileChange = (location) => {
        uploadFile(location)
    }

    const onFileChange = async (e) => {
        const file = e.target.files[0];

        if (file && file.size > MAX_FILE_SIZE) {
            alert("File exceeds 20mb.");
            return;
        }

        s3.uploadFile(file, file.name.trim())
            .then((data) => {
                if (data && data.location) {
                    handleFileChange(data.location)
                }
            })
            .catch((err) => {
                apiErrorHandler(err, "Error while uploading images.");
            });
    };

    return (
        <div className="form-group">
            <div style={{ paddingBottom: "6px" }}>
                <label className="form-label">
                    Image
                </label>
            </div>
            <div className="upload-wrap">
                {picUrl ? (
                    <div className="upload-image coverimg">
                        <div className="category-image">
                            <img
                                style={{ maxHeight: "200px", maxWidth: "100%" }}
                                src={picUrl}
                                alt="User Icon"
                            />
                        </div>
                        <div
                            className="close-icon"
                            onClick={() => handleFileChange("")}
                        >
                            <CloseIcon />
                        </div>
                    </div>
                ) : (
                    <div
                        className="category-upload-file"
                        style={{ width: "100%" }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={onFileChange}
                            name="sportImage"
                        />
                        <div className="upload-icon">
                            <img src={uploadIcon} alt="Upload Icon" />
                            <p>Upload Image</p>
                        </div>
                    </div>
                )}
                <Typography variant="caption">
                    Maximum size allowed: 20 MB, Only Image files supported.
                </Typography>
            </div>
        </div>
    )
}

export default FileUploader;