require('dotenv').config();

// installations
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// My Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order")
// const stripeRoutes = require("./routes/stripepayment")
const paymentBRoutes = require("./routes/paymentB")

// DB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
        console.log("DB CONNECTED");
    })
    .catch((err) => {
        console.log(err);
        console.log("DB Error");
    });

// MiddleWares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
// app.use("/api", stripeRoutes);
app.use("/api", paymentBRoutes);

// PORT
const port = process.env.PORT || 8000;

// start the server
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
