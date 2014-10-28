var User = require('../models/user');
var Category = require('../models/category');

var user = new User({username: 'admin', password: 'test'});

user.save(function (err, user) {
    if (err)throw err;
    var category = new Category({label: 'TestCategory', lang: 'en', creator: user._id});
    category.save(function (err, category) {
        if (err)throw err;
        console.log('category saved: ', category);

        user.categories.push(category);
        user.save(function (err, user) {
            if (err)throw err;

            User.findOne({username: 'admin'}).populate('categories').exec(function (err, user) {
                if (err)throw err;
                console.log('\nUSER: ', user);
            });

            Category.findOne({label: 'TestCategory'}).populate('creator').exec(function (err, user) {
                if (err)throw err;
                console.log('\nCATEGORY: ', user);
            });
        });

    });
});