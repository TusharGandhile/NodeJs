const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const image = require("../model/image.model");
const book = require("../model/book.model");
const { bookValidation } = require("../validations/book.validation");

// for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const FilePath = path.join(__dirname, "../Images");
    cb(null, FilePath);
  },
  filename: (req, file, cb) => {
    const FileName = file.originalname;
    cb(null, path.extname(FileName));
  },
});
const upload = multer({ storage: storage }).array("testImg", 4); //can upload multiple images

// to upload a file seperatly using seperate image model
router.post("/uploadImg", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
    } else {
      const newImg = new image({
        name: req.body.name,
        image: {
          data: req.file.filename,
          contentType: "image/png",
        },
      });
      newImg
        .save()
        .then(() => {
          return res.send("successfully uploaded");
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    }
  });
});

// post books
router.post("/addBook", upload, async (req, res) => {
  const validation = bookValidation(req.body);
  if (validation.error) {
    return res.status(404).send({
      message: validation.error.message,
    });
  }
  const book1 = new book({
    bookName: req.body.bookName,
    price: req.body.price,
    description: req.body.description,
    author: req.body.author,
    photo: req.files.map((image) => image.path),
  });
  await book1
    .save()
    .then((result) => {
      return res.status(200).json({ result: result });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.message,
      });
    });
});

// get all books
router.get("/", async (req, res) => {
  let { page, size } = req.query;
  if (!page) {
    page = 1;
  }
  if (!size) {
    size = 1;
  }
  const limit = parseInt(size);
  const skip = (page - 1) * size;

  await book
    .find()
    .sort({ price: -1 })
    .limit(limit)
    .skip(skip)
    .then((result) => {
      return res.status(200).send({ result: result });
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message,
      });
    });
});

// get single book
router.get("/:id", async (req, res) => {
  await book
    .findById(req.params.id)
    .then((result) => {
      return res.status(200).send({ result: result });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.message,
      });
    });
});

router.patch("/:id", async (req, res) => {
  await book
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      return res.status(200).send({ result: result });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.message,
      });
    });
});

router.delete("/delete/:id", async (req, res) => {
  await book
    .findByIdAndDelete(req.params.id)
    .then((result) => {
      return res.status(200).send({ result: result });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err.message,
      });
    });
});
module.exports = router;
