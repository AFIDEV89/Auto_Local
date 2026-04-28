import React, { useState, memo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { s3 } from "../../../aws/aws-s3";
import { apiErrorHandler } from "../../../helpers";
import uploadIcon from "../../../../assets/images/e-commerce/uploadIcon.svg";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { videoSize } from "store/constant";

const VideoUploader = (props) => {
  const [file, setFile] = useState(props?.video?.length > 0 ? props.video : []
  );
  const [fileName, setFileName] = useState(props?.video?.length > 0 ? props.video : []);
  const [videoLoader, setVideoLoader] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');



  const onFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.size <= videoSize && selectedFile?.type == "video/mp4") {
      setSizeError(false);
      setVideoLoader(true);
      s3?.uploadFile(selectedFile, selectedFile?.name)
        .then((data) => {
          if (data && data.location) {
            setFile([data.location]);
            setFileName([selectedFile.name]);
            props.handleVideos([data.location]);
          }
          setVideoLoader(false);
        })
        .catch((err) => {
          setVideoLoader(false);
          apiErrorHandler(err, "Error while uploading videos.");
        });
    } else {
      if (selectedFile?.size > videoSize) {
        setErrorMessage('Max size 5MB');
        setSizeError(true);
        props.setVideos([]);
      } else if (selectedFile?.type != "video/mp4") {
        setErrorMessage('Video must be mp4');
      }

    }
  };

  function deleteFile(e) {

    const videos = file.filter((item, index) => index !== e);
    const names = fileName.filter((item, index) => index !== e);
    props.setVideos([]);
    setFile(videos);
    setFileName(names);
    props.handleVideos(videos);
  }

  return (
    <form>
      <div className="form-group preview">
        {fileName.length > 0 &&
          fileName.map((item, index) => {
            return (
              <div key={item} className="upload-image coverimg">
                <div
                  className="close-icon"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    deleteFile(index);
                  }}
                >
                  {item} <CloseIcon style={{ paddingTop: "10px" }} />
                </div>
              </div>
            );
          })}
      </div>

      <div className="category-upload-file-add" style={{ width: "100%" }}>
        <input
          type="file"
          // value={coverInputFile}
          onChange={onFileChange}
          name="sportImage"
        />
        <div className="upload-icon">
          {videoLoader ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <img src={uploadIcon} alt="Upload Icon" />
              <p>Upload Video</p>
            </>
          )}
        </div>
      </div>
      {sizeError && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
};

export default memo(VideoUploader);
