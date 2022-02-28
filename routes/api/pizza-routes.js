const router = require('express').Router();
const {
  getAllPizza,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
} = require('../../controllers/pizza-controller');

// /api/pizzas
router
// See how we simply provide the name of the controller method as the callback? That's why we set up those methods to accept req and res as parameters!
  .route('/')
  .get(getAllPizza)
  .post(createPizza);


// /api/pizzas/:id
router
  .route('/:id')
  .get(getPizzaById)
  .put(updatePizza)
  .delete(deletePizza);

//   // this code
// router.route('/').get(getCallbackFunction).post(postCallbackFunction);

// // is this same as this
// router.get('/', getCallbackFunction);
// router.post('/' postCallbackFunction);

module.exports = router;