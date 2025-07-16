# Convertto

Convertto is a web application that allows users to perform various unit conversions and interact with an AI chatbot. It provides a user-friendly interface for converting values between different units within categories such as length, weight, temperature, and more. Additionally, users can engage with an AI chatbot for assistance and information.

## Features

*   **Unit Conversion:** Convert values between different units across various categories.
*   **Category Selection:** Choose from a range of conversion categories.
*   **Real-time Conversion:** See the conversion result update as you input values and select units.
*   **AI Chatbot:** Interact with an AI chatbot for assistance, information, and general conversation.
*   **Admin Interface:** Manage conversion data (add, update, delete) through a secure admin interface.

## Technologies Used

*   **Frontend:** HTML, CSS (Tailwind CSS), JavaScript
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB
*   **AI Service:** Azure AI (or any other AI service, configurable via API key)
*   **Authentication:** JSON Web Tokens (JWT)

## Getting Started

### Prerequisites

*   Node.js and npm installed
*   MongoDB database (local or cloud-based)
*   Azure AI service API key (if using the chatbot feature)

### Installation

1.  Clone the repository:

    ```bash
    git clone <repository_url>
    cd Convertto
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure environment variables:

    *   Copy `.env.example` to `.env`:

        ```bash
        cp .env.example .env
        ```

    *   Edit the `.env` file and fill in your actual values for:

        *   `MONGODB_URI`: Your MongoDB connection string.
        *   `PORT`: The port number for the server (default: 3000).
        *   `JWT_KEY`: A secret key for signing JWTs.  Make this long and random.
        *   `AI_KEY`: Your Azure AI service API key (if using the chatbot).

4.  Start the development server:

    ```bash
    npm run dev
    ```

    This will likely start the server on `http://localhost:3000`.

### Usage

*   **Unit Conversion:** Open the application in your browser. Select a category, choose the units to convert from and to, and enter the value you want to convert. The result will be displayed in real-time.
*   **AI Chatbot:** Navigate to the chatbot interface (if available in the application) and type your message in the input field. The chatbot's response will be displayed in the chat window.
*   **Admin Interface:** Access the admin interface (the specific URL will depend on the application's routes). Log in with the appropriate credentials to manage conversion categories, units, and formulas.

## Development

*   The frontend code (HTML, CSS, and JavaScript) is located in the `/Views/public` directory (or a similar directory, depending on the project structure).
*   The backend code (Node.js and Express.js) is in the main project directory, typically with files like `server.js` and `app.js`, and API routes in the `routes` directory.
*   Database models and schemas are usually in the `models` directory.
*   Script for the unit conversion can be found in `/routes/publicRoutes.js`.
*   To add your own units with bidirectional conversion logic( e.g cm to km and km to cm), add the conversion under the `/Processes/Convert1.js` file then on your terminal run the `/Processes/CodeTransform.js` file make sure you have the 2 files mentioned in the same directory. 
 You will get a new convertedForMongoDB file.
*   To get data for your database copy the contents of your `/Processes/convertedForMongoDB.json` file and paste it in your mongodb collection. It uses json format.

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Implement your changes and write tests if applicable.
4.  Submit a pull request with a clear description of your changes.

**Note:** The units provided in the HTML file and the `/Processes/convertedForMongoDB.json` may not be exhaustive or perfectly synchronized. Users should treat these as templates and refer to the actual units stored in their database for accurate conversions.