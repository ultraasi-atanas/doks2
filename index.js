var suggestions = document.getElementById('suggestions');
var userinput = document.getElementById('userinput');

document.addEventListener('keydown', inputFocus);

function inputFocus(e) {

  if (e.keyCode === 191 ) {
    e.preventDefault();
    userinput.focus();
  }

  if (e.keyCode === 27 ) {
    userinput.blur();
    suggestions.classList.add('d-none');
  }

}

document.addEventListener('click', function(event) {

  var isClickInsideElement = suggestions.contains(event.target);

  if (!isClickInsideElement) {
    suggestions.classList.add('d-none');
  }

});

/*
Source:
  - https://dev.to/shubhamprakash/trap-focus-using-javascript-6a3
*/

document.addEventListener('keydown',suggestionFocus);

function suggestionFocus(e){

  const focusableSuggestions= suggestions.querySelectorAll('a');
  const focusable= [...focusableSuggestions];
  const index = focusable.indexOf(document.activeElement);

  let nextIndex = 0;

  if (e.keyCode === 38) {
    e.preventDefault();
    nextIndex= index > 0 ? index-1 : 0;
    focusableSuggestions[nextIndex].focus();
  }
  else if (e.keyCode === 40) {
    e.preventDefault();
    nextIndex= index+1 < focusable.length ? index+1 : index;
    focusableSuggestions[nextIndex].focus();
  }

}


/*
Source:
  - https://github.com/nextapps-de/flexsearch#index-documents-field-search
  - https://raw.githack.com/nextapps-de/flexsearch/master/demo/autocomplete.html
*/

(function(){

  var index = new FlexSearch({
    preset: 'score',
    cache: true,
    doc: {
        id: 'id',
        field: [
          'title',
          'description',
          'content',
        ],
        store: [
          'href',
          'title',
          'description',
        ],
    },
  });

  var docs = [
    {
        id: 0,
        href: "/docs/help/troubleshooting/",
        title: "Troubleshooting",
        description: "Solutions to common problems.",
        content: "\u003ch2 id=\"problems-updating-npm-packages\"\u003eProblems updating npm packages\u003c/h2\u003e\n\u003cp\u003eDelete the \u003ccode\u003e./node_modules\u003c/code\u003e folder, and run again:\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003enpm install\n\u003c/code\u003e\u003c/pre\u003e\n\u003ch2 id=\"problems-with-cache\"\u003eProblems with cache\u003c/h2\u003e\n\u003cp\u003eDelete the temporary directories:\u003c/p\u003e\n\u003cpre\u003e\u003ccode class=\"language-bash\"\u003enpm run clean\n\u003c/code\u003e\u003c/pre\u003e\n"
      },
    {
        id: 1,
        href: "/docs/help/faq/",
        title: "FAQ",
        description: "Answers to frequently asked questions.",
        content: "\u003ch2 id=\"hyas\"\u003eHyas?\u003c/h2\u003e\n\u003cp\u003eDoks is a \u003ca href=\"https://gethyas.com/themes/\"\u003eHyas theme\u003c/a\u003e build by the creator of Hyas.\u003c/p\u003e\n\u003ch2 id=\"footer-notice\"\u003eFooter notice?\u003c/h2\u003e\n\u003cp\u003ePlease keep it in place.\u003c/p\u003e\n\u003ch2 id=\"keyboard-shortcuts-for-search\"\u003eKeyboard shortcuts for search?\u003c/h2\u003e\n\u003cul\u003e\n\u003cli\u003efocus: \u003ccode\u003e/\u003c/code\u003e\u003c/li\u003e\n\u003cli\u003eselect: \u003ccode\u003e↓\u003c/code\u003e and \u003ccode\u003e↑\u003c/code\u003e\u003c/li\u003e\n\u003cli\u003eopen: \u003ccode\u003eEnter\u003c/code\u003e\u003c/li\u003e\n\u003cli\u003eclose: \u003ccode\u003eEsc\u003c/code\u003e\u003c/li\u003e\n\u003c/ul\u003e\n\u003ch2 id=\"other-documentation\"\u003eOther documentation?\u003c/h2\u003e\n\u003cul\u003e\n\u003cli\u003e\u003ca href=\"https://docs.netlify.com/\"\u003eNetlify\u003c/a\u003e\u003c/li\u003e\n\u003cli\u003e\u003ca href=\"https://gohugo.io/documentation/\"\u003eHugo\u003c/a\u003e\u003c/li\u003e\n\u003c/ul\u003e\n\u003ch2 id=\"can-i-get-support\"\u003eCan I get support?\u003c/h2\u003e\n\u003cp\u003eCreate a topic:\u003c/p\u003e\n\u003cul\u003e\n\u003cli\u003e\u003ca href=\"https://community.netlify.com/\"\u003eNetlify Community\u003c/a\u003e\u003c/li\u003e\n\u003cli\u003e\u003ca href=\"https://discourse.gohugo.io/\"\u003eHugo Forums\u003c/a\u003e\u003c/li\u003e\n\u003cli\u003e\u003ca href=\"https://github.com/h-enk/doks/discussions\"\u003eDoks Discussions\u003c/a\u003e\u003c/li\u003e\n\u003c/ul\u003e\n\u003ch2 id=\"contact-the-creator\"\u003eContact the creator?\u003c/h2\u003e\n\u003cp\u003eSend \u003ccode\u003eh-enk\u003c/code\u003e a message:\u003c/p\u003e\n\u003cul\u003e\n\u003cli\u003e\u003ca href=\"https://community.netlify.com/\"\u003eNetlify Community\u003c/a\u003e\u003c/li\u003e\n\u003cli\u003e\u003ca href=\"https://discourse.gohugo.io/\"\u003eHugo Forums\u003c/a\u003e\u003c/li\u003e\n\u003cli\u003e\u003ca href=\"https://github.com/h-enk/doks/discussions\"\u003eDoks Discussions\u003c/a\u003e\u003c/li\u003e\n\u003c/ul\u003e\n"
      },
    {
        id: 2,
        href: "/docs/help/",
        title: "Help",
        description: "Help Doks.",
        content: ""
      },
    {
        id: 3,
        href: "/docs/prologue/",
        title: "Prologue",
        description: "Prologue Doks.",
        content: ""
      },
    {
        id: 4,
        href: "/docs/",
        title: "Docs",
        description: "Docs Doks.",
        content: ""
      },
    ];

  index.add(docs);

  userinput.addEventListener('input', show_results, true);
  suggestions.addEventListener('click', accept_suggestion, true);

  function show_results(){

    var value = this.value;
    var results = index.search(value, 5);
    var entry, childs = suggestions.childNodes;
    var i = 0, len = results.length;

    suggestions.classList.remove('d-none');

    results.forEach(function(page) {

      entry = document.createElement('div');

      entry.innerHTML = '<a href><span></span><span></span></a>';

      a = entry.querySelector('a'),
      t = entry.querySelector('span:first-child'),
      d = entry.querySelector('span:nth-child(2)');

      a.href = page.href;
      t.textContent = page.title;
      d.textContent = page.description;

      suggestions.appendChild(entry);

    });

    while(childs.length > len){

        suggestions.removeChild(childs[i])
    }

  }

  function accept_suggestion(){

      while(suggestions.lastChild){

          suggestions.removeChild(suggestions.lastChild);
      }

      return false;
  }

}());
