const mainContainer = document.querySelector('body');
const headerContainer = document.querySelector('.headerContainer');

const header_src = document.querySelector("#hbs_header").innerHTML;
const body_src = document.querySelector("#hbs_body").innerHTML;
const footer_src = document.querySelector("#hbs_footer").innerHTML;

const header_template = Handlebars.compile(header_src);
const body_template = Handlebars.compile(body_src);
const footer_template = Handlebars.compile(footer_src);

const json = fetch('src/js/siteData.json')
  .then( resp => resp.json())
  .then( json => {
    headerContainer.innerHTML += header_template(json);
    mainContainer.innerHTML += body_template(json);
    mainContainer.innerHTML += footer_template(json);

  })
  // .then( () => init() ) 

Handlebars.registerHelper('linkReplace', (originalText, url, textToReplace, replacementText = 'here') => {
  const link = `<a href="${url}">${replacementText}</a>`;
  return originalText.replace(textToReplace, url);
});