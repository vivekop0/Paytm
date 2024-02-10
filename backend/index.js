const express = require("express");
const indexRouter = require("./routes");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use("/api/v1", indexRouter);
app.listen(PORT, () => {
  console.log("server started at port " + PORT);
});
