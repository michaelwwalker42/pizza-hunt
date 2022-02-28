const router = require('express').Router();
const { addComment, removeComment } = require('../../controllers/comment-controller');

// /api/comments/<pizzaId>
router.route('/:pizzaId').post(addComment);

// /api/comments/<pizzaId>/<commentId>
// You might wonder why you need two parameters to delete a comment. Remember that after deleting a particular comment, you need to know exactly which pizza that comment originated from.
router.route('/:pizzaId/:commentId').delete(removeComment);

module.exports = router;