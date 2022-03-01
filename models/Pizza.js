const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String,
      // Just like Sequelize, when the required field option in Mongoose is set to true, it will require data to exist for that field. Also notice the trim option that's been added, which works just like the JavaScript .trim() method and removes white space before and after the input string. You'll find that useful when working with username and password data.
      required: 'You need to provide a pizza name!',
      trim: true
    },
    createdBy: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // To use a getter in Mongoose, we just need to add the key get to the field we are looking to use it with in the schema. Just like a virtual, the getter will transform the data before it gets to the controller(s).
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
      required: true,
      // In this example, the enum option stands for enumerable, a popular term in web development that refers to a set of data that can be iterated over—much like using the for...in loop to iterate through an object.
      enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
      default: 'Large'
    },
    toppings: [],
    comments: [
      {
        type: Schema.Types.ObjectId,
        // The ref property is especially important because it tells the Pizza model which documents to search to find the right comments.
        ref: 'Comment'
      }
    ]
  },
  {
    toJSON: {
      //virtuals help extend models by creating a "virtual" field that can be evaluated when the documents are retrieved from the database.
      virtuals: true,
      // In programming, a getter is typically a special type of function that takes the stored data you are looking to retrieve and modifies or formats it upon return. Think of it like middleware for your data!
      getters: true
    },
    // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    id: false
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
  // Here we're using the .reduce() method to tally up the total of every comment with its replies. In its basic form, .reduce() takes two parameters, an accumulator and a currentValue. Here, the accumulator is total, and the currentValue is comment. As .reduce() walks through the array, it passes the accumulating total and the current value of comment into the function, with the return of the function revising the total for the next iteration through the array.
  return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;