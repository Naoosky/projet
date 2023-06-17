'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const imgCheck = document.querySelectorAll('.imgCheck');
    console.log(imgCheck);

    imgCheck.forEach(image => {
        image.addEventListener('click', () => {
            // Supprimez la classe "active" de toutes les images
            imgCheck.forEach(img => img.classList.remove('active'));

            // Ajoutez la classe "active" à l'image cliquée
            image.classList.add('active');
        });
    });
});