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
const errorHandler = require("./middleware/error-handler");
const NotFoundError = require("./errors/not-found-error");
const { requestLogger, errorLogger } = require("./middleware/logger");

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
              "You are a subject matter export who provides thorough summaries or explanations of topics, including two study strategies to help learn the material effectively. Your responses should focus on critical concepts, events, theories or historical figures and avoid flowery language. Please format your response as a JSON object with the following keys: 'topic', 'topicInformation', 'studyTips'. 'topicInformation' should provide a level of detail appropriate for an encyclopedia entry of 300 to 400 words. Every key's value must be a single string. The study tips should include instructions. For example, if the study tips include making flashcards, please include as key phrases, events or people to include.",
          },
          {
            role: "user",
            content: `Please provide information on ${req.body.topic} and suggest 2 study strategies to learn about this effectively.`,
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
    let structuredResponse;
    try {
      structuredResponse = JSON.parse(topicResponse);
    } catch (error) {
      console.error("Error parsing response:", error.message);
      return res.status(500).json({
        error:
          "Failed to parse the response from OpenAI. Please check the response format.",
        details: error.message,
      });
    }

    res.json(structuredResponse);
  } catch (error) {
    console.error("Error with OpenAI API:", error.message);
    res.status(500).json({
      error: "Failed to fetch response from OpenAI",
      details: error.message,
    });
  }
});

app.use((req, res, next) => {
  next(new NotFoundError("Page not found."));
});

app.use(errorLogger);

/*
app.use(errors());
*/

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
