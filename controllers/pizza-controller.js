const { Pizza } = require('../models');

const pizzaController = {
  // get all pizzas
  getAllPizza(req, res) {
    Pizza.find({})
      // To populate a field, just chain the .populate() method onto your query, passing in an object with the key path plus the value of the field you want populated.
      .populate({
        path: 'comments',
        // Note that we also used the select option inside of populate(), so that we can tell Mongoose that we don't care about the __v field on comments either. The minus sign - in front of the field indicates that we don't want it to be returned. If we didn't have it, it would mean that it would return only the __v field
        select: '-__v'
      })
      .select('-__v')
      // use .sort({ _id: -1 }) to sort in DESC order by the _id value
      // This gets the newest pizza because a timestamp value is hidden somewhere inside the MongoDB ObjectId.
      .sort({ _id: -1 })
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one pizza by id
  getPizzaById({ params }, res) {
    // Instead of accessing the entire req, we've destructured params out of it, because that's the only data we need for this request to be fulfilled. 
    Pizza.findOne({ _id: params.id })
      .populate({
        path: 'comments',
        select: '-__v'
      })
      .select('-__v')
      .then(dbPizzaData => {
        // If no pizza is found, send 404
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // createPizza
  createPizza({ body }, res) {
    // With this .createPizza() method, we destructure the body out of the Express.js req object because we don't need to interface with any of the other data it provides. Again, just like with Sequelize, in Mongoose we use the method .create() to create data. We send a 400 error back if something goes wrong, as we likely sent the wrong type of data for one of the fields.
    Pizza.create(body)
      .then(dbPizzaData => res.json(dbPizzaData))
      .catch(err => res.status(400).json(err));
  },

  // update pizza by id
  updatePizza({ params, body }, res) {
    // With this .findOneAndUpdate() method, Mongoose finds a single document we want to update, then updates it and returns the updated document. If we don't set that third parameter, { new: true }, it will return the original document. By setting the parameter to true, we're instructing Mongoose to return the new version of the document.
    // There are also Mongoose and MongoDB methods called .updateOne() and .updateMany(), which update documents without returning them.
    // Notice the new option in place, runValidators: true? We need to include this explicit setting when updating data so that it knows to validate any new information.
    Pizza.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      // With Mongoose, the "where" clause is used first, then the updated data, then options for how the data should be returned.
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  },

  // delete pizza
  deletePizza({ params }, res) {
    // In this example, we use the Mongoose .findOneAndDelete() method, which will find the document to be returned and also delete it from the database. Like with updating, we could alternatively use .deleteOne() or .deleteMany(), but we're using the .findOneAndDelete() method because it provides a little more data in case the client wants it.
    Pizza.findOneAndDelete({ _id: params.id })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.status(400).json(err));
  }
}
// In MongoDB, the methods for adding data to a collection are .insertOne() or .insertMany(). But in Mongoose, we use the .create() method, which will actually handle either one or multiple inserts!

module.exports = pizzaController;