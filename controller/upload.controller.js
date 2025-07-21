const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
// DigitalOcean Spaces configuration
const bucket = "aapkikismat";
const region = "blr1";
const endpoint = "https://aapkikismat.blr1.digitaloceanspaces.com";
const accessKeyId = "DO009PULTXKXT98JUQ3X"; // Replace with your actual access key
const secretAccessKey = "D9OAnjnf4YN51rvJFwpB/2KSbqPMEj0CNaRXI046fhg";

// Create an S3 client
const s3Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

const uploadfile = async (req, res) => {
  try {
    const files = req.files; // Access multiple files
    const folderName = req.body?.folderName || "";

    if (!files || files.length === 0) {
      return res.status(400).json({
        status: false,
        message: "No files uploaded or incorrect field name.",
        data: false,
      });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const filePath = file.path;
      const fileName = file.originalname;
      const fileMimeType = file.mimetype;

      // Prepare S3 upload parameters
      const key = `${folderName}/${fileName}`;
      const fileBuffer = fs.readFileSync(filePath); // Read file as a buffer

      const uploadParams = {
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: fileMimeType,
        ACL: "public-read", // File will be publicly accessible
      };

      // Upload file to DigitalOcean Spaces
      const result = await s3Client.send(new PutObjectCommand(uploadParams));

      const fileUrl = `https://content.vinaybajrangi.com/aapkikismat/${key}`;
      const finalUrl = fileUrl.replace(/([^:]\/)\/+/g, "$1"); // Clean URL

      // Add the file URL to the response array
      uploadedFiles.push(finalUrl);

      // Delete the temporary file from "uploads"
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting temporary file:", err);
        }
      });
    }

    return res.status(200).json({
      status: true,
      message: "Files uploaded successfully.",
      data: { fileUrls: uploadedFiles },
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return res.status(500).json({
      status: false,
      message: "Error uploading files",
      data: error.message,
    });
  }
};

module.exports = {
  uploadfile,
};