function logger(req, res, next)
{
    let now = new Date();
    if(req.url == '/' || req.method == 'POST')
    console.log(
        `<Request>
        URL Accessed: ${req.url}
        Type: ${req.method}
        Time: ${now.toDateString()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}\n</Request>`);
    next();
}

module.exports.logger = logger;