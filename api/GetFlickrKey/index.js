module.exports = async function (context, req) {
    context.res = {
        status: 200,
        body: JSON.stringify({ message: "Function is running!" }),
        headers: { "Content-Type": "application/json" }
    };
};