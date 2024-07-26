import express from "express";
import createUserValidation from "./utils/createUserValidation.mjs"; // Notice the default import
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import homeRouter from "./routes/home.mjs";
import authRouter from './routes/auth.mjs';
import protectedRouter from "./routes/protected.mjs"
import cookieParser from "cookie-parser";
import session from "express-session";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import dotenv from "dotenv";

dotenv.config();


mongoose.connect("mongodb://localhost:27017")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(`Error:  ${err}`)); // Notice the arrow function



const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());

// Create a MongoDB session store
const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017",
    collectionName: 'sessions', // Optional: specify the collection name
    ttl: 14 * 24 * 60 * 60 // Optional: set the session expiration time in seconds
  });


// Configure session middleware
app.use(
    session({
      secret: process.env.SESSION_SECRET || 'default_secret_key',
      resave: false,
      saveUninitialized: false,
      store: mongoStore, // Use the MongoDB session store
      cookie: {
        maxAge: 60000 * 60, // 1 hour
      },
    })
  );


app.use("/api/auth", authRouter);
app.use(usersRouter);
app.use(productsRouter);
app.use(homeRouter);
app.use(protectedRouter)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




