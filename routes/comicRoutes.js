const express = require('express');
const comicController = require('../controllers/comicController');
const router = express.Router();

// Create a Comic Book
router.post('/', comicController.createComic);

// Edit a Comic Book
router.put('/:book_id', comicController.updateComic);

// Delete a Comic Book
router.delete('/:book_id', comicController.deleteComic);

// Get Comic Book by ID
router.get('/:book_id', comicController.getComicById);

// Fetch Comics with Pagination, Filtering, and Sorting
router.get('/', comicController.getComics);

module.exports = router;
