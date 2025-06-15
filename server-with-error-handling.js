// importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// require('dotenv').config();

// setups
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://tempuser:123@cluster0.f9d6o.gcp.mongodb.net/books', { useNewUrlParser: true, useUnifiedTopology: true })
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
        try {
            Book.find()
                .then((books) => {
                    if (books.length == 0) { res.json("no book found") } else { res.json(books) }
                })
        }
        catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/:id")

    .get((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => { if (book == null) { res.json("no record found") } else { res.json(book) } })
        }
        catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/add")
    .post((req, res) => {

        try {
            if (req.body.title == null || req.body.author == null || req.body.pages == null || req.body.fiction == null) {
                res.json("Please submit all the fields for title, author, pages, and fiction.")
            } else {
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

                // save the new object (newBook)
                newBook
                    .save()
                    .then(() => res.json("Book added!"))
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        } catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/update/:id")
    .put((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => {
                    if (book == null) { res.json("no record found") }
                    else {
                        book.title = req.body.title;
                        book.author = req.body.author;

                        book
                            .save()
                            .then(() => res.json("Book updated!"))
                            .catch((err) => res.status(400).json("Error: " + err));
                    }
                })
                .catch((err) => res.status(400).json("Error: " + err));
        } catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

router.route("/delete/:id")
    .delete((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => {
                    if (book == null) { res.json("no record found") }
                    else {
                        Book.findByIdAndDelete(req.params.id)
                            .then(() => {
                                console.log("Book test");
                                res.json("Book deleted.")
                            })
                    }
                })
        }
        catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }

    });
