const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
  {
    pizzaName: {
      type: String
    },
    createdBy: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // To use a getter in Mongoose, we just need to add the key get to the field we are looking to use it with in the schema. Just like a virtual, the getter will transform the data before it gets to the controller(s).
      get: (createdAtVal) => dateFormat(createdAtVal)
    },
    size: {
      type: String,
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
      virtuals: true,
      getters: true
    },
    // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    id: false
  }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;