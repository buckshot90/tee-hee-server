var User = require('../models/user');
var Category = require('../models/category');

var user = new User({username: 'admin', password:'test'});

user.save(function (err, user) {
    if (err)throw err;
    var category = new Category({label: 'TestCategory', lang: 'en', creator: user._id});
    category.save(function (err, category) {
        if (err)throw err;
        console.log('category created: ', category);
        User.findOne({username: 'admin'}).populate('categories').exec(function (err, user) {
            if (err)throw err;
            console.log('user=', user);
            console.log('user.categories=', user.categories);
        });
    });
});
