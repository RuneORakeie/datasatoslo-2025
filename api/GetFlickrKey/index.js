module.exports = async function (context, req) {
    try {
        // Retrieve the API key from Azure environment variables
        const flickrApiKey = process.env.HUGO_FLICKR_API_KEY;

        // Check if the API key is missing or invalid
        if (!flickrApiKey || flickrApiKey.trim() === "") {
            context.res = {
                status: 500,
                body: JSON.stringify({ error: "Error: Flickr API key is missing or invalid." }),
                headers: { "Content-Type": "application/json" }
            };
            return;
        }

        // Return the API key as JSON
        context.res = {
            status: 200,
            body: JSON.stringify({ apiKey: flickrApiKey }),
            headers: { "Content-Type": "application/json" }
        };
    } catch (error) {
        // Catch any unexpected errors and return a 500 response
        context.res = {
            status: 500,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
            headers: { "Content-Type": "application/json" }
        };
    }
};