// importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// require('dotenv').config();

// setups
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// junk ='mongodb://localhost:27017/books';
URI ='mongodb+srv://rezzz:12345@cluster0.f9d6o.gcp.mongodb.net/books'

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start your Express server once connected to MongoDB
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// define Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    pages: { type: Number, required: true },
    fiction: { type: Boolean, required: true },
});

const Book = mongoose.model("Book", bookSchema);

const router = express.Router();

// Mount the router middleware at a specific path
app.use('/api', router);

// app.get('/', (req, res) => {
router.route("/")
    .get((req, res) => {
        Book.find()
            .then((books) => res.json(books))
            .catch((err) => res.status(400).json("Error: " + err));
    });

router.route("/:id")
    .get((req, res) => {
        Book.findById(req.params.id)
            .then((book) => res.json(book))
            .catch((err) => res.status(400).json("Error: " + err));
    });

router.route("/add")
    .post((req, res) => {
        const title = req.body.title;
        const author = req.body.author;
        const pages = req.body.pages;
        const fiction = req.body.fiction;
        // create a new Book object 
        const newBook = new Book({
            title,
            author,
            pages,
            fiction
        });

        // console.log("checkpoint");

        // save the new object (newBook)
        newBook
            .save()
            .then(() => res.json("Book added!"))
            .catch((err) => res.status(400).json("Error: " + err));
    });

router.route("/update/:id")
    .put((req, res) => {
        Book.findById(req.params.id)
            .then((book) => {
                book.title = req.body.title;
                book.author = req.body.author;

                book
                    .save()
                    .then(() => res.json("Book updated!"))
                    .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
    });

router.route("/delete/:id")
    .delete((req, res) => {
        Book.findByIdAndDelete(req.params.id)
            .then(() => res.json("Book deleted."))
            .catch((err) => res.status(400).json("Error: " + err));
    });
