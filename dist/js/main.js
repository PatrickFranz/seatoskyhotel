"use strict";
function init(){
  const btnMenu = document.querySelector('.menu-btn');
  const btnReservation = document.querySelector('.book-btn');
  const resBarElement = document.querySelector('.res-bar'); 
  const navNodes = document.querySelectorAll('.menu-item');
  const routes = {
    "/": "home.html",
    "/home": "home.html",
    "/rooms":"rooms.html"
  }
  
  
  window.onload = setHeaderButtons;

  window.addEventListener("resize", setHeaderButtons);

  btnMenu.addEventListener('click', e => {
    toggleModal(e, {"context": "nav"});
  });
  showContent(routes[window.location.pathname]);
  
  btnReservation.addEventListener('click', toggleResBar);
  
  addNavListeners(navNodes);

  function addNavListeners(nodes, closeModal) {
    nodes.forEach(el => {
      el.addEventListener('click', e => {
        nodes.forEach(n => n.classList.remove('selected'));
        e.preventDefault();
        e.currentTarget.classList.add('selected');
        showContent(routes[e.target.dataset.linkto]);
        history.pushState(null, null, e.target.dataset.linkto);
        if(closeModal) {
          closeModal()
        }
      });
    });
  }
  
  
  function showContent(page=routes[window.location.pathname]){
    
    fetch(page)
      .then(result => result.text())
      .then(html_src => {
        fetch('js/siteData.json')
          .then(resp => resp.json())
          .then(json => {
            const htmlTemplate = Handlebars.compile(html_src)
            hbsContentContainer.innerHTML = htmlTemplate(json);
          });      
      });
  }

  function setHeaderButtons(e){
    const buttonArray = [btnMenu, 
                         btnReservation, 
                         document.querySelector('.goog-te-menu-value')];
    if(window.innerWidth <= 960){
      iconifyButtons(buttonArray, "none");
    } else {
      iconifyButtons(buttonArray, "inline");
    }
  }

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
        addNavListeners(modalContentLinks, closeModal);
        
        openModal(modalElement);

        modalCloseButton.addEventListener('click', closeModal);

        function closeModal(){
          setTimeout( () => {
            modalElement.style.display = 'none';
            hbsModalContainer.innerHTML = "";
          }, 500);
          modalElement.style.opacity = 0;
        }
    
        function openModal(modalElement) {
          setTimeout(() => {
            modalElement.style.opacity = 1;
          }, 0);
          modalElement.style.display = 'grid';
        }
      });
      
  }

  function iconifyButtons(btnArr, displayAction){
    btnArr.map(btn => {
      const textSpan = btn.getElementsByTagName('span')[0];
      textSpan.style.display = displayAction;
    });
  }
}