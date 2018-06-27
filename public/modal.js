const updateModal = document.querySelectorAll('#updateModal-Btn');

// When the user clicks on the button, open the modal 
updateModal.forEach((element) => {
    element.onclick = () => {
        let modal = document.querySelector('[data-modal="' + element.dataset.id + '"]')
        let modalCloseBTN = document.querySelector('[data-modal-close="' + element.dataset.id + '"]')

        modal.style.display = "block"

        modalCloseBTN.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }
});