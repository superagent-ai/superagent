import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AMAZON_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AMAZON_S3_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
});

const s3 = new AWS.S3();

export const ACCEPTABLE_STATIC_FILE_TYPES = ["CSV", "PDF", "TXT", "MARKDOWN"];

export const ACCEPTABLE_WEBPAGE_TYPES = ["GITHUB_REPOSITORY", "WEBPAGE", "URL"];

export const MIME_TO_TYPE = {
  "text/csv": "CSV",
  "application/pdf": "PDF",
  "text/plain": "TXT",
  "text/markdown": "MARKDOWN",
  ".md": "MARKDOWN",
};

export const getFileType = (mimeType) => {
  return MIME_TO_TYPE[mimeType] || "Unknown";
};

export const uploadFile = async (file) => {
  const result = await s3
    .upload({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
      Key: file.name,
      Body: file,
      ContentType: file.type,
    })
    .promise();

  console.log(result);

  return result;
};

export const isGithubUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname === "github.com";
  } catch (error) {
    return false; // Invalid URL
  }
};
