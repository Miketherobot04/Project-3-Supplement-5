// Full implementation of the project with Node.js server tested and documented in Java

// Step 1: Java Test Class
// Create tests for the Node.js server
import org.junit.jupiter.api.*;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.json.JSONObject;
import static org.junit.jupiter.api.Assertions.*;

public class ExpressServerTest {

    @Test
    public void testPostEndpoint() throws Exception {
        // Setup JSON body
        JSONObject jsonBody = new JSONObject();
        jsonBody.put("content", "Hello, World!");
        
        // Send POST request
        URL url = new URL("http://localhost:3000/");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setDoOutput(true);
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");

        try (OutputStream os = conn.getOutputStream()) {
            os.write(jsonBody.toString().getBytes());
        }

        // Read response
        int responseCode = conn.getResponseCode();
        assertEquals(200, responseCode);

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
            String response = reader.readLine();
            assertEquals("Hello, World!", response);
        }

        // Verify file content
        String fileContent = new String(Files.readAllBytes(Paths.get("output.txt")));
        assertEquals("Hello, World!", fileContent);
    }
}


Step 2: Node.js Server
// Create the Express server with the required functionality
const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/expressdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Schema = mongoose.Schema;
const DataSchema = new Schema({
    content: String,
    otherFields: Object,
});
const DataModel = mongoose.model('Data', DataSchema);

// POST endpoint
app.post('/', async (req, res) => {
    try {
        const { content, ...otherFields } = req.body;
        res.send(content);

        // Write to file
        fs.writeFileSync('output.txt', content);

        // Save to MongoDB
        const data = new DataModel({ content, otherFields });
        await data.save();
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
    ;

    Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

// Step 3: Documentation
/**
 * ### Project Documentation
 * #### Overview:
 * - An Express server was created with a POST endpoint at `/`.
 * - The endpoint accepts a JSON body, extracts the `content` field, and:
 *   - Sends it as the response.
 *   - Writes it to `output.txt`.
 *   - Saves the full JSON body to a MongoDB database.
 *
 * #### Setup:
 * 1. Install Node.js and MongoDB.
 * 2. Run `npm install express body-parser mongoose` to install dependencies.
 * 3. Start the server using `node server.js`.
 *
 * #### Testing:
 * - Run the Java test class `ExpressServerTest` to validate functionality.
 * - Ensure MongoDB is running locally before testing.
 */
