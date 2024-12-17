const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config({ path: "./.env" });
const mongoose = require("mongoose");
const axios = require("axios");
const app = express();

const studyTopicRouter = require("./routes/studyTopics");
const userRouter = require("./routes/users");
const mainRouter = require("./routes/index");
app.use(cors());
app.use(express.json());

app.use("/", mainRouter);
app.use("/", studyTopicRouter);
app.use("/", userRouter);

mongoose
  .connect("mongodb://localhost:27017/studyhelper")
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(console.error);

app.post("/api/query", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful professor who provides thorough overviews of topics with as much detail as possible in 4000 characters or less, including at least one study strategy to learn the material.",
          },
          {
            role: "user",
            content: `Please provide an overview of ${req.body.topic}?. Then, suggest 2 study strategies to learn this effectively.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const topicResponse = response.data.choices[0].message.content;
    res.json({ topicResponse });
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({
      error: "Failed to fetch response from OpenAI",
      details: error.message,
    });
  }
});

/*
app.use((req, res, next) => {
  res.status(404).send({ message: "Requested resource not found" });
  next();
});
*/

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
