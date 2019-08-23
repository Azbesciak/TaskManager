module.exports = {
    publicPath: process.env.NODE_ENV === 'production'
        ? '/TaskManager/'
        : '/',
    baseUrl: process.env.NODE_ENV === 'production'
        ? '/TaskManager/'
        : '/',
}
