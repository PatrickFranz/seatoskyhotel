"use strict";
function init(){
  const btnMenu = document.querySelector('.menu-btn');
  const btnReservation = document.querySelector('.book-btn');
  const resBarElement = document.querySelector('.res-bar'); 
  const navNodes = document.querySelectorAll('.menu-item');
  const re_url = /\b(https?|ftp|file):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/
  let pageData = null;
  const routes = {
    "/": "home.html",
    "/home": "home.html",
    "/rooms":"rooms.html",
    "/facilities":"facilities.html",
    "/privacy":"privacy.html",
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
        const linkto = e.target.dataset.linkto || e.currentTarget.dataset.linkto
        console.log(linkto)
        e.preventDefault();
        if(closeModal) {
          closeModal()
        }
        if(routes[linkto]){
          showContent(linkto);
        } else if(linkto.match(re_url)){
          window.open(linkto);
        }
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
  
  function showContent(page=window.location.pathname || "/"){
    fetch(routes[page])
    .then(result => result.text())
    .then(html_src => {
      if(!pageData){
        getPageData().then(showContent());
        } else {
            const htmlTemplate = Handlebars.compile(html_src)
            hbsContentContainer.innerHTML = htmlTemplate(pageData);
            history.pushState(null, null, page);
            window.scrollTo({top: 400});
            //Run any page specific JS
            switch(routes[page]){
              case("gallery.html"):
                loadGallery(); 
                break;
              case("home.html"):
                loadHome();
                break;

            }
        }
      });      
  }

  function loadHome(){
    addNavListeners(document.querySelectorAll('.view-more'));
    addNavListeners(document.querySelectorAll('.agg-review'));
  }

  function loadGallery(){
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