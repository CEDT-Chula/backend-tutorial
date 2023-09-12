// Importing the necessary modules
const express = require("express");
const mongoose = require("mongoose");

// Initialize our application with express - a popular Node.js web application framework
const app = express();

// Including a middleware to parse JSON bodies. This helps us to handle the JSON content sent in requests
app.use(express.json());

// Connect to MongoDB Database (named 'testDB' here) on the local machine with Mongoose.
// Mongoose provides a straight-forward, schematic solution to model your application data with MongoDB
const mongodb = "mongodb://52.90.227.162:27017/";
mongoose
    .connect(mongodb, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to Database")) // Log successful connection
    .catch((err) => console.log(`Database connection error: ${err}`)); // Log error if connection fails

// Define the schema (design or structure of the dataset) for 'User' in MongoDB using Mongoose
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

// Create a model 'User' with 'UserSchema'. This is what we will work with in our routes
const User = mongoose.model("User", UserSchema);

app.route("/users")
    // GET endpoint to fetch all users
    .get((req, res) => {
        // Use the User model to fetch all users from the MongoDB
        User.find({})
            .then((users) => {
                res.status(200).send(users); // Send fetched users
            })
            .catch((err) => {
                res.status(500).send(err); // Handle errors
            });
    })
    // POST endpoint to create a new user
    .post((req, res) => {
        // Construct a new user with received body parameters
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        // Save the user
        user.save()
            .then((user) => {
                res.status(200).send(user); // Send saved user
            })
            .catch((err) => {
                res.status(500).send(err); // Handle errors
            });
    });

app.route("/users/:id")
    // GET endpoint to fetch a user by ID
    .get((req, res) => {
        User.findById(req.params.id)
            .then((user) => {
                res.status(200).send(user); // Send fetched user
            })
            .catch((err) => {
                res.status(500).send({
                    message: "User not found",
                }); // Handle errors
            });
    })
    // PUT endpoint to update a user
    .put((req, res) => {
        // Find the user by ID and update with the received body parameters
        User.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
            },
            { new: true }
        )
            .then((user) => {
                res.status(200).send(user); // Send updated user
            })
            .catch((err) => {
                res.status(500).send(err); // Handle errors
            });
    })
    // DELETE endpoint to delete a user
    .delete((req, res) => {
        // Find the user by ID and delete it
        User.findByIdAndRemove(req.params.id)
            .then(() => {
                res.status(200).send("User deleted."); // Confirm deletion
            })
            .catch((err) => {
                res.status(500).send(err); //
            });
    });

// Define the port the app will listen on. Process.env.PORT is useful if we're deploying to a service that assigns us a port
const port = process.env.PORT || 3000;

// Have the app listen on the defined port and log it in console
app.listen(port, () => console.log(`Server running on port ${port}`));
