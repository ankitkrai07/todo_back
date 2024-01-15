const express = require("express");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();
const { connection } = require("./db");
const { NotesRouter } = require("./routes/noteRoutes");
const { UserRouter } = require("./routes/userRoutes");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
app.use("/users", UserRouter);
app.use("/notes", NotesRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Learning Swagger",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSdoc(options);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
    console.log(`Server is Running at Port ${port}`);
  } catch (error) {
    console.log(error);
  }
});
