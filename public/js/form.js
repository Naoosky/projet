let email = document.getElementById('email');
let pseudo = document.getElementById('pseudo');
let password = document.getElementById('password');
let passwordConfirm = document.getElementById('confirmPassword');

let emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;


if (email) {
    email.addEventListener('keyup', () => {
        if (emailRegex.test(email.value) === false) {
            email.style.borderColor = 'red';
        } else {
            email.style.borderColor = 'green';
        }
    });
}
if (pseudo) {
    pseudo.addEventListener('keyup', () => {
        if (pseudo.value.length < 3) {
            pseudo.style.borderColor = 'red';
        } else {
            pseudo.style.borderColor = 'green';
        }
    });
}
if (password && passwordConfirm) {
    password.addEventListener('keyup', () => {
        if (password.value.length < 8) {
            password.style.borderColor = 'red';
        } else {
            password.style.borderColor = 'green';
        }
    });

    passwordConfirm.addEventListener('keyup', () => {
        if (password.value !== passwordConfirm.value) {
            passwordConfirm.style.borderColor = 'red';
        } else {
            passwordConfirm.style.borderColor = 'green';
        }
    });
}