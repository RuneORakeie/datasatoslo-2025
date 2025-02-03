module.exports = async function (context, req) {
    const flickrApiKey = process.env.HUGO_FLICKR_API_KEY;

    if (!flickrApiKey) {
        context.res = {
            status: 500,
            body: "Error: Flickr API key is not set in environment variables."
        };
        return;
    }

    context.res = {
        status: 200,
        body: { apiKey: flickrApiKey }
    };
};