if(process.env.NODE_ENV === 'production') {
    module.exports = {mongoURI: 'mongodb://duc:duc@ds139919.mlab.com:39919/gallery-prod'}
} else {    
    module.exports = {mongoURI: 'mongodb://localhost:27017/gallery'}
}