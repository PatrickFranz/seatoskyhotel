// var picker = new Pikaday({ field: document.getElementById('datepicker') });

const hbsHeaderContainer = document.querySelector('.hbs-header');
const hbsContentContainer = document.querySelector('.hbs-main-content');
const hbsFooterContainer = document.querySelector('.hbs-footer');
const hbsModalContainer = document.querySelector('.hbs-modal');

const header_src = document.querySelector("#hbs_header").innerHTML;
const body_src = document.querySelector("#hbs_body").innerHTML;
const footer_src = document.querySelector("#hbs_footer").innerHTML;
const modal_src = document.querySelector("#hbs_modal").innerHTML;



const header_template = Handlebars.compile(header_src);
const body_template = Handlebars.compile(body_src);
const footer_template = Handlebars.compile(footer_src);
const modal_template = Handlebars.compile(modal_src);


const json = fetch('js/siteData.json')
  .then( resp => resp.json())
  .then( json => {
    hbsHeaderContainer
      .insertAdjacentHTML('beforeend', header_template(json));
    hbsContentContainer.
      insertAdjacentHTML('beforeend',body_template(json));
    hbsFooterContainer.
      insertAdjacentHTML('beforeend',footer_template(json));
  }).then( () => init() ) 


Handlebars.registerHelper('linkReplace', (originalText, url, textToReplace, replacementText = 'here') => {
  const link = `<a href="${url}">${replacementText}</a>`;
  return originalText.replace(textToReplace, url);
});

Handlebars.registerHelper('getDate', (offset=0) => {
  const d = new Date();
  return new Handlebars.SafeString(`${d.getDate()}`);
});

Handlebars.registerHelper('showModal', (options) => {
  console.log(options.fn());
  return options.fn(this)
});

