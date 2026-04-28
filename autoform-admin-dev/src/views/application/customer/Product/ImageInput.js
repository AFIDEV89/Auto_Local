import React, { useState, memo, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { s3 } from "views/aws/aws-s3";
import { apiErrorHandler } from "views/helpers";
import uploadIcon from "assets/images/e-commerce/uploadIcon.svg";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const ImageUploader = ({
  img = [],
  handleImages
}) => {
  const [file, setFile] = useState([]);
  const [imageLoader, setImageLoader] = useState(false);


  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setImageLoader(true);

    s3?.uploadFile(selectedFile, selectedFile?.name)
      .then((data) => {
        if (data && data.location) {
          setFile([...file, data.location]);
          handleImages([...file, data.location]);
        }
        setImageLoader(false);
      })
      .catch((err) => {
        setImageLoader(false);

        apiErrorHandler(err, "Error while uploading images.");
      });
  };

  const deleteFile = (e) => {
    const images = file.filter((item, index) => index !== e);
    setFile(images);

    handleImages(images);
  }

  useEffect(() => {
    if (img && img.length) {
      setFile([...img])
    }
  }, [img])

  return (
    <form>
      <Box className="form-group preview" marginBottom={2} display="flex" gap={2} overflow="auto">
        {file.length > 0 &&
          file.map((item, index) => {
            return (
              <Box key={item} className="upload-image coverimg">
                <Box
                  className="close-icon"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    deleteFile(index);
                  }}
                >
                  <CloseIcon />
                </Box>
                <img
                  style={{ width: "120px", height: "120px", objectFit: "contain" }}
                  src={item}
                  alt="User Icon"
                />
              </Box>
            );
          })}
      </Box>

      <Box className="category-upload-file-add" style={{ width: "100%" }}>
        <input
          type="file"
          accept="image/x-png, image/jpg, image/jpeg"
          onChange={onFileChange}
          name="sportImage"
        />
        <Box className="upload-icon">
          {imageLoader ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <img src={uploadIcon} alt="Upload Icon" />
              <p>Upload Image</p>
            </>
          )}
        </Box>
      </Box>

    </form>
  );
};

export default memo(ImageUploader);
