import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.NEXT_PUBLIC_AMAZON_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.NEXT_PUBLIC_AMAZON_S3_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
});

const s3 = new AWS.S3();

export const APPLICATIONS = [
  {
    id: "GITHUB_REPOSITORY",
    name: "Github",
    logo: "./github.png",
    inputs: [
      {
        key: "url",
        name: "Repository URL",
        placeholder: "https://github.com/homanp/superagent",
        helpText: "The full URL to your Github repository",
        type: "input",
        required: true,
      },
      {
        key: "branch",
        name: "Branch",
        placeholder: "main",
        helpText: "Select the repo branch",
        type: "input",
        required: true,
      },
    ],
  },
  {
    id: "STRIPE",
    name: "Stripe",
    logo: "./stripe.jpeg",
    inputs: [
      {
        key: "client_secret",
        name: "Client secret",
        placeholder: "Stripe client secret",
        helpText: "Your stripe client secret",
        type: "input",
        required: true,
      },
      {
        key: "account_id",
        name: "Account ID",
        placeholder: "Stripe account id",
        helpText: "Your stripe account ID",
        type: "input",
        required: true,
      },
      {
        key: "start_date",
        name: "Start date",
        type: "date",
        helpText: "From what date do you want to fetch data",
        required: true,
      },
      {
        key: "stream",
        name: "Resource",
        type: "select",
        required: true,
        helpText: "Select a resource",
        options: [
          {
            title: "Invoides",
            value: "invoices",
          },
        ],
      },
    ],
  },
];

export const ACCEPTABLE_APPLICATION_TYPES = APPLICATIONS.map(({ id }) => {
  return id;
});

export const ACCEPTABLE_STATIC_FILE_TYPES = ["CSV", "PDF", "TXT", "MARKDOWN"];

export const ACCEPTABLE_WEBPAGE_TYPES = ["WEBPAGE", "URL"];

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
