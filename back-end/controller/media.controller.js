const uploader = require("../config/uploader");
module.exports = {
  async single(req, res) {
    if (!req.file) {
      return res.status(500).json({
        meta: {
          status: 500,
          message: "File is not exists",
        },
        data: null,
      });
    }
    try {
      const result = await uploader.uploadSingle(req.file);

      res.status(200).json({
        meta: {
          status: 200,
          message: "Success upload s file",
        },
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        meta: {
          status: 500,
          message: error,
        },
        data: null,
      });
    }
  },
  async multiple(req, res) {
    if (!req.files || req.files.length === 0) {
      return res.status(500).json({
        meta: {
          status: 500,
          message: "Files are not exists",
        },
        data: null,
      });
    }
    try {
      const result = await uploader.uploadMultiple(req.files);
      res.status(200).json({
        meta: {
          status: 200,
          message: "Success upload files",
        },
        data: result,
      });
    } catch {
      res.status(500).json({
        meta: {
          status: 500,
          message: "Failed upload files",
        },
        data: null,
      });
    }
  },
  async remove(req, res) {
    try {
      const { fileUrl } = req.body;
      const result = await uploader.remove(fileUrl);

      res.status(200).json({
        meta: {
          status: 200,
          message: "Success remove file",
        },
        data: result,
      });
    } catch {
      res.status(500).json({
        meta: {
          status: 500,
          message: "Filed remove file",
        },
        data: null,
      });
    }
  },
};
