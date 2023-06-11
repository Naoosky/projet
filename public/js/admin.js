document.addEventListener("DOMContentLoaded", () => {
    let buttonRemove = document.querySelectorAll(".js-article-remove");
    let tableArticle = document.querySelectorAll(".js-table-articles > tbody > tr");

    if (buttonRemove.length > 0) {
        buttonRemove.forEach((elem) => {
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

                const url = `/administration/articles/${id}`;

                fetch(url, options)
                    .then((res) => {
                        if(res.ok){
                            tableArticle.forEach((post) => {
                                if (post.getAttribute("data-id") === id) {
                                    post.remove();
                                }
                            });
                        }else{
                            res.json().then(console.log);
                        }

                    })
                    .catch((err) => console.log(err));
            });
        });
    }
});