import ReactS3Client from 'react-aws-s3';

const config = {
  bucketName: process.env.REACT_APP_S3_BUCKET_NAME,
  dirName: process.env.REACT_APP_S3_DIRECTORY_NAME,
  region: process.env.REACT_APP_S3_REGION,
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_KEY,
  s3Url: process.env.REACT_APP_S3_URL,
};


 
export const s3 = new ReactS3Client(config);
