const User = require("../models/user")
module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust!");
            res.redirect("/listings");
        })

    } catch (e) {
        if (e.code === 11000) {
            req.flash("error", "Username or Email already exists!");
            return res.redirect("/signup");
        }
        req.flash("error", e.message);
        res.redirect('/signup');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("user/login.ejs");
}

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to wanderlust...You are logged in!");
    if (res.locals.redirectUrl) {
        res.redirect(res.locals.redirectUrl);  //agar iske under kuch exist krta tb hi wo page pe jyenge
    }
    else {
        res.redirect("/listings");
    }
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {  //req.logout() is passport method which logout user i.e deserialized user
        if (err) {    //error aya toh ye chalega but logout me error nhi ata agar middleware fail ho gya tb  hi error ayega
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("./listings");
    });
};

