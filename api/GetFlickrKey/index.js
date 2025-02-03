module.exports = async function (context, req) {
    try {
        // Retrieve the API key from Azure environment variables
        const flickrApiKey = process.env.HUGO_FLICKR_API_KEY;

        if (!flickrApiKey || flickrApiKey.trim() === "") {
            context.res = {
                status: 500,
                body: { error: "Flickr API key is missing or invalid" },
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            };
            return;
        }

        // Return just the API key in the expected format
        context.res = {
            status: 200,
            body: { apiKey: flickrApiKey },
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        };

    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message },
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        };
    }
};