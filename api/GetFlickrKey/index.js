module.exports = async function (context, req) {
    let debugInfo = {}; // Object to store debug information

    try {
        // Retrieve the API key from Azure environment variables
        const flickrApiKey = process.env.HUGO_FLICKR_API_KEY;

        // Add debug info
        debugInfo.envVariableExists = flickrApiKey ? true : false;
        debugInfo.nodeVersion = process.version;
        debugInfo.azureEnvironment = process.env.WEBSITE_SITE_NAME || "Unknown";

        if (!flickrApiKey || flickrApiKey.trim() === "") {
            debugInfo.error = "Error: Flickr API key is missing or invalid.";

            context.res = {
                status: 500,
                body: JSON.stringify(debugInfo, null, 2), // Return debug info in the response
                headers: { "Content-Type": "application/json" }
            };
            return;
        }

        // If the API key exists, return it along with debug info
        debugInfo.apiKey = "Key is set (not exposed for security reasons)";

        context.res = {
            status: 200,
            body: JSON.stringify(debugInfo, null, 2),
            headers: { "Content-Type": "application/json" }
        };

    } catch (error) {
        debugInfo.exception = error.message;

        context.res = {
            status: 500,
            body: JSON.stringify(debugInfo, null, 2), // Return debug info even on failure
            headers: { "Content-Type": "application/json" }
        };
    }
};