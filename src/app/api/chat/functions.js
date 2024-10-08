import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToCoreMessages, generateText, streamText } from "ai";
import { createConnection } from "mysql2/promise";
import { z } from "zod";

const google = createGoogleGenerativeAI({ apiKey: "AIzaSyA6wQcWglcK3oZ-X4v_GUbVVZpmQnhZIKg" });

// Define the schema for weather data
const weather_schema = z.object({
    City_Name: z.string(),
    Temperature: z.number(),
    Weather_Condition: z.string(),
});

// Function to extract JSON from response text
const extractJson = (responseText) => {
    const jsonString = responseText.replace(/```json\n|\n```/g, "").trim();
    return JSON.parse(jsonString);
};

// Function to generate SQL query based on user input
const generate_query = async(inp) => {
    const system_prompt = JSON.stringify({
        database_structure: "CREATE TABLE Weather (City_Name VARCHAR(100), Temperature FLOAT, Weather_Condition VARCHAR(100));",
        persona: "You are a SQL query-generating assistant for the Weather Chatbot.",
        instructions: "Your task is to generate appropriate SQL queries for the weather database based on user requirements. If a user asks about a specific city, construct a query that retrieves data from that city.",
        output: "{ message: 'response.text', query: 'sql-query' }"
    });

    const response = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: inp,
        maxSteps: 5,
        system: system_prompt,
    });

    const query_ = extractJson(response.text).query;
    console.log("Generated SQL Query:", query_); // Log the generated query
    return query_;
};

// Access the weather database and execute the query
const access_db = async(message) => {
    const connection = await createConnection({
        host: "localhost",
        user: "root",
        database: "weather_info",
        password: "Mysql@12", // Use environment variable for security
    });

    // Generate a SQL query to retrieve weather data based on user input
    const sqlQuery = await generate_query(message);


    if (!sqlQuery || sqlQuery.trim() === "") {
        console.error("Error: Generated SQL query is empty.");
        return { success: false, error: "Generated SQL query is empty." };
    }

    let result;
    try {

        result = await connection.execute(sqlQuery);
    } catch (error) {
        console.error("Error executing SQL query:", error);
        return { success: false, error: error.message };
    } finally {
        await connection.end();
    }

    return { success: true, result: result[0] }; // Return only the rows from the result
};

// Handle POST requests
export async function POST(req) {
    const { messages} = await req.json();

    

    const model_ = google("gemini-1.5-pro-latest");

    const text = await streamText({
        model: model_,
        messages: convertToCoreMessages(messages),
        maxSteps: 4,
        system: JSON.stringify({
            persona: "You are a chatbot designed to provide accurate weather information and forecasts.",
            objective: "You should only respond to queries related to weather and assist the users.",
            instructions: [
                "1. Analyze whether the message is related to weather.",
                "2. If it is related, check whether you need to access the database.",
                "3. If database access is required, check the tools available.",
                "4. Call the tool with a detailed explanation of the requirement.",
                "5. Respond 'Sorry, I couldn't do that' in case you can't fetch a response.",
                "6. If other cities are mentioned in the database, provide weather information for those cities."
            ],
            examples: [{
                    user: "Hi, what's the weather in New York?",
                    assistant: "The weather in New York is currently sunny with a temperature of 22°C.",
                },
                {
                    user: "Can you tell me about the weather in Los Angeles?",
                    assistant: "Sure! In Los Angeles, it's partly cloudy with a temperature of 28.2°C.",
                },
                {
                    user: "What will the weather be like in Chicago tomorrow?",
                    assistant: "I'm sorry, I don't have access to forecasts. Please check a reliable weather service for more details.",
                },
                {
                    user: "What's the forecast for the next week in New York?",
                    assistant: "I'm sorry, I don't have access to forecasts. Please check a reliable weather service for more details.",
                },
                {
                    user: "Hi or hello or how are you?",
                    assistant: "Hello, I'm designed to provide accurate weather information and forecasts.",
                },
                {
                    user: "weather in los angeles",
                    assistant: "The weather in Los Angeles is currently sunny with a temperature of 28.5°C.",
                },
                {
                    user: "what is some other topics is asked in the chatbot?",
                    assistant: "i cannot "
                }
            ],
        }),
        tools: {
            access_db: {
                description: "Search for the required weather data in the SQL database.",
                parameters: z.object({
                    message: z.string(),
                }),
                execute: async({ message }) => {
                    console.log("User message for database access:", message);
                    try {
                        const result = await access_db(message);
                        console.log("Database result:", result);
                        return { success: true, result };
                    } catch (error) {
                        console.error("Error in accessing Database:", error);
                        return { success: false, error: error.message };
                    }
                },
            },
        },
    });

    return text.toDataStreamResponse()