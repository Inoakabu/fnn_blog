////////////////////////////////////////////////////////////
// Modal Update on documents showed in a loop             //
// getting all updateModal-Btn created within the loop    //
// looping through the NodeList(element) and set a unique //
// id/class for the buttons and divs                      //
// by Stefan                                              //
////////////////////////////////////////////////////////////

// getting all updateModal-Btn in a array of NodeLists(element)
document.querySelector('[data-id="<%= post.uid %>"]').onclick = () => {
    let modal = document.querySelector('[data-modal="<%= post.uid %>"]')
    let modalCloseBTN = document.querySelector('[data-modal-close="<%= post.uid %>"]')
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