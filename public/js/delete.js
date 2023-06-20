document.addEventListener("DOMContentLoaded", () => {
    let buttonRemoveArticle = document.querySelectorAll(".js-article-remove");
    let buttonRemoveListArticle = document.querySelectorAll(".js-list-article-remove");
    let buttonRemoveUser = document.querySelectorAll(".js-user-remove");
    let buttonRemoveItem = document.querySelectorAll(".js-item-remove");


    if (buttonRemoveArticle.length > 0) {
        buttonRemoveArticle.forEach((elem) => {
            elem.addEventListener("click", (event) => {

                const buttonElement = event.target.parentElement;
                console.log(buttonElement)

                const id = buttonElement.getAttribute("data-id");
                console.log(id)

                const options = {
                    method: "delete",
                    headers: {
                        "content-type": "application/json",
                    },
                };

                const url = `/delete/articles/${id}`;
                console.log(url)

                fetch(url, options)
                    .then(function (response) {
                        if(response.ok) {
                            // Récupérer la ligne à supprimer
                            const articleElement = document.querySelector(`.js-table-articles tr[data-id="${id}"]`)
                            articleElement.remove();
                        } else {
                            response.json().then(console.log);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        });
    }
    if (buttonRemoveListArticle.length > 0) {
        buttonRemoveListArticle.forEach((elem) => {
            elem.addEventListener("click", (event) => {

                const buttonElement = event.target.parentElement;
                console.log(buttonElement)

                const id = buttonElement.getAttribute("data-id");
                console.log(id)

                const options = {
                    method: "delete",
                    headers: {
                        "content-type": "application/json",
                    },
                };

                const url = `/delete/articles/${id}`;
                console.log(url)

                fetch(url, options)
                    .then(function (response) {
                        if(response.ok) {
                            // Récupérer la ligne à supprimer
                            const articleElement = document.querySelector(`.js-list-articles li[data-id="${id}"]`)
                            articleElement.remove();
                        } else {
                            response.json().then(console.log);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        });
    }

    if (buttonRemoveItem.length > 0) {
        buttonRemoveItem.forEach((elem) => {
            elem.addEventListener("click", (event) => {

                const buttonElement = event.target.parentElement;
                console.log(buttonElement)

                const id = buttonElement.getAttribute("data-id");

                const options = {
                    method: "delete",
                    headers: {
                        "content-type": "application/json",
                    },
                };

                const url = `/delete/items/${id}`;
                console.log(url)

                fetch(url, options)
                    .then(function (response) {
                        if(response.ok) {
                            // Récupérer la ligne à supprimer
                            const itemElement = document.querySelector(`.js-table-items tr[data-id="${id}"]`)
                            console.log(itemElement)
                            itemElement.remove();
                        } else {
                            response.json().then(console.log);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        });
    }
    if (buttonRemoveUser.length > 0) {
        buttonRemoveUser.forEach((elem) => {
            elem.addEventListener("click", (event) => {

                const buttonElement = event.target.parentElement;
                console.log(buttonElement)

                const id = buttonElement.getAttribute("data-id");

                const options = {
                    method: "delete",
                    headers: {
                        "content-type": "application/json",
                    },
                };

                const url = `/delete/users/${id}`;
                console.log(url)

                fetch(url, options)
                    .then(function (response) {
                        if(response.ok) {
                            // Récupérer la ligne à supprimer
                            const itemElement = document.querySelector(`.js-table-users tr[data-id="${id}"]`)
                            console.log(itemElement)
                            itemElement.remove();
                        } else {
                            response.json().then(console.log);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            });
        });
    }
});