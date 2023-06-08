

export const login = (req, res) => {
    res.render('layout', {template: 'login'});
}

export const loginSubmit = (req, res) => {
    res.redirect('/');
}