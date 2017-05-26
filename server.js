const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// Port for server startup set by Heroku
const port = process.env.PORT || 3000;

var app = express();

// Create a middleware callback to put up the mainenance page without
// continuing with the rest of the app
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
//  });

// Setup static directory
app.use(express.static(__dirname + '/public'));

// Request logger as Express middleware
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log("Could not append to log file");
        }
    });
    next();
});

// Setup handlebars as our view engine
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

// Register handlebar helpers
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
})

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// Setup webapp routes
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home',
        welcomeMessage: 'Welcome to my website!'
    })
}).get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
}).get('/bad', (req, res) => {
    res.send({
        errorMessage: 'bad things'
    });
}).get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    })
});

// Start the fucker up!
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
