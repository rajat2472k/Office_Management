require("dotenv").config();
const express = require("express"); //imports the Express framework into your Node.js application
const app = express(); // Creates an Express app instance	& define routes and start server
const authRoute = require("./routes/authentication"); //Imports route handlers
const connectDB = require("./utils/db"); //Imports DB connection logic
const cors = require("cors");
const adminRoutes = require('./routes/adminRoutes');
const managerRoutes = require("./routes/managerRoutes");
const userRoutes = require("./routes/userRoutes");


app.use(express.json()); // Express! When a request comes with JSON data in the body, automatically parse it and put it in req.body

const corsOptions = {
  origin:"http://localhost:5173",
  methods:"GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials:true,
}

app.use(cors(corsOptions));

app.use("/api/auth", authRoute);
 //This line connects your external router file to your main Express app and prefixes all the routes with /api.

app.use('/api/admin', adminRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/user", userRoutes);

const PORT = 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is runing at port:${PORT}`);
  });
});
