document.addEventListener("DOMContentLoaded", () => {
    let buttonRemoveArticle = document.querySelectorAll(".js-article-remove");
    let buttonRemoveItem = document.querySelectorAll(".js-item-remove");


    if (buttonRemoveArticle.length > 0) {
        buttonRemoveArticle.forEach((elem) => {
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

                const url = `/delete/articles/${id}`;

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

                fetch(url, options)
                    .then(function (response) {
                        if(response.ok) {
                            // Récupérer la ligne à supprimer
                            const itemElement = document.querySelector(`.js-table-items tr[data-id="${id}"]`)
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