////////////////////////////////////////////////////////////
// Modal Update on documents showed in a loop             //
// getting all updateModal-Btn created within the loop    //
// looping through the NodeList(element) and set a unique //
// id/class for the buttons and divs                      //
// by Stefan                                              //
////////////////////////////////////////////////////////////

// getting all updateModal-Btn in a array of NodeLists(element)
const updateModal = document.querySelectorAll('#updateModal-Btn');

// When the user clicks on the button, open the modal
// search through the array of updateModal-NodeLists(element)
updateModal.forEach((element) => {
    element.onclick = () => {
        // setting the <div> modal classes element ID from updateModal-NodeLists 
        let modal = document.querySelector('[data-modal="' + element.dataset.id + '"]')
        // setting the same for modalClosteBtn 
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