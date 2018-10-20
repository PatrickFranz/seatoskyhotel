
function init(){
  const btnReservation = document.querySelector('.book-btn');
  const resBarElement = document.querySelector('.res-bar'); 
  const headerBtns = Array.from(document.querySelectorAll('.header-right > button'));
  btnReservation.addEventListener('click', toggleResBar);

  function toggleResBar(e){
    console.log('toggle');
    resBarElement.classList.toggle('show');
  }
}