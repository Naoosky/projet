

export const register = (req, res) => {
    res.render('layout', {template: 'register'});
}

export const registerSubmit = (req, res) => {
    res.redirect('/');
}