
"use strict";
function init(){
  const btnsMenu = document.querySelectorAll('.menu-btn');
  const btnsReservation = document.querySelectorAll('.book-btn');
  const resBarElement = document.querySelector('.res-bar'); 
  

  const menuBtns = Array.from(document.querySelectorAll('.header-right > button'));

  btnsMenu.forEach( e => {
    e.addEventListener('click', e => {
      toggleModal(e, {"context": "nav"});
    });
  });

  btnsReservation.forEach( e => {
    e.addEventListener('click', toggleResBar);
  });
  
  function toggleResBar(e){
    resBarElement.classList.toggle('show');
  }


  function toggleModal(e, contextName){
    fetch('js/siteData.json')
      .then(resp => resp.json())
      .then(data => {
        hbsModalContainer
        .insertAdjacentHTML('beforeend', modal_template(data[contextName.context]));

        let modalElement = document.querySelector('.modal'); 
        let modalCloseButton = modalElement.querySelector('.modal--close');
        let modalContentLinks = modalElement.querySelectorAll('.modal--list-item');
        modalContentLinks[0].classList.add('selected');
        modalContentLinks.forEach( (link) => {
          link.addEventListener('click', (e) => {
            modalContentLinks.forEach(el => el.classList.remove('selected'));
            e.currentTarget.classList.add('selected');            
          })
        });

        setTimeout( () => {
          modalElement.style.opacity = 1;
        }, 0);
        modalElement.style.display = 'grid';

        modalCloseButton.addEventListener('click', e => {
          setTimeout( () => {
            modalElement.style.display = 'none';
            hbsModalContainer.innerHTML = "";
          }, 500);
          modalElement.style.opacity = 0;
        });
      });
  }


}