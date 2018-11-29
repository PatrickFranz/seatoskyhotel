"use strict";
function init(){
  const btnMenu = document.querySelector('.menu-btn');
  const btnReservation = document.querySelector('.book-btn');
  const resBarElement = document.querySelector('.res-bar'); 
  const navNodes = document.querySelectorAll('.menu-item');
  let pageData = null;
  const routes = {
    "/": "home.html",
    "/home": "home.html",
    "/rooms":"rooms.html",
    "/facilities":"facilities.html",
    "/sitemap":"sitemap.html",
    "/gallery":"gallery.html",
    "/attractions":"attractions.html",
    "/bwstore":"bwstore.html",
    "/contact":"contact.html",
  }
  
  window.onload = setHeaderButtons;
  window.addEventListener("resize", setHeaderButtons);
  showContent(routes[window.location.pathname]);
  window.onpopstate = () => showContent();


  btnMenu.addEventListener('click', e => {
    if(!pageData){
      getPageData().then(toggleModal(pageData.nav));
    } else {
    toggleModal(pageData.nav);
    }
  });
  
  btnReservation.addEventListener('click', toggleResBar);
  
  addNavListeners(navNodes);

  function addNavListeners(nodes, closeModal) {
    nodes.forEach(el => {
      el.addEventListener('click', e => {
        nodes.forEach(n => n.classList.remove('selected'));
        e.preventDefault();
        console.log('click')
        e.currentTarget.classList.add('selected');
        history.pushState(null, null, e.target.dataset.linkto);
        if(closeModal) {
          closeModal()
        }
        showContent(routes[e.target.dataset.linkto]);
      });
    });
  }
  function getPageData(){
    return new Promise((resolve, reject) =>{
      fetch('js/siteData.json')
      .then(resp => resp.json())
      .then(json => {
        pageData = json;
      });
    });
  }
  
  function showContent(page=routes[window.location.pathname]){
    fetch(page)
    .then(result => result.text())
    .then(html_src => {
      if(!pageData){
        getPageData().then(showContent());
        } else {
            const htmlTemplate = Handlebars.compile(html_src)
            hbsContentContainer.innerHTML = htmlTemplate(pageData);
            //Run any page specific JS
            switch(page){
              case("gallery.html"):
                runGallery(); 
                break;
            }
        }
      });      
  }

  function runGallery(){
    const cards = document.querySelectorAll(".gallery-card");
    cards.forEach(card => card.addEventListener('click', (e) => {
      if(!pageData){
        getPageData().then(pageData.pages.gallery.images[e.currentTarget.dataset.id]);
      } else {
        toggleModal(pageData.pages.gallery.images[e.currentTarget.dataset.id])
      }
    }));
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

  function toggleModal(json){ //content name is an object {'context': 'nav'}
  if(!pageData){
    getPageData();
  } else {}
    fetch('js/siteData.json')
      .then(resp => resp.json())
      .then(data => {
        hbsModalContainer
        .insertAdjacentHTML('beforeend', modal_template(json));

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
      if(btn){
        const textSpan = btn.getElementsByTagName('span')[0];
        textSpan.style.display = displayAction;
      }
    });
  }
}