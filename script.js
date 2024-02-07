const Select = document.querySelector('#selectShow');
let EpisodeDropDown = document.querySelector('#selectEpisode')
const input = document.querySelector('#input');
const readMore = document.querySelector('#readMore');
const home = document.querySelector('#home');

let selectedShow = 1;
let selectedEpisode = 1;
let SearchTerm = "";

// fetch Api function to fetch the shows
async function getAllShows() {
  return await fetch("https://api.tvmaze.com/shows").then((data) => {
    return data.json();
  })
}
// fetch Api function to fetch the Episodes of selected show
async function getAllEpisodes() {
  const rootElem = document.querySelector('#root');
  const massage = `<div>Cant load the Episodes</div>`;

  return await fetch(`https://api.tvmaze.com/shows/${selectedShow}/episodes`)
    .then((response) => {

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      return response.json();

    })
}

// function to display the all show in dropdown menu
function displayShowList() {

  getAllShows().then((showList) => {

    showList.forEach((show) => {
      const option = document.createElement('option');
      Select.appendChild(option);
      option.textContent = show.name;
      option.setAttribute('id', `${show.id}`);
    });
  })

  Select.addEventListener('change', () => {
    let selectedOption = Select.options[Select.selectedIndex];
    clearCard();

    selectedShow = selectedOption.getAttribute('id');
    makePageCards();
  })
}

// function to display the all Episodes in dropdown menu of selected show
function displayEpisodeList() {

  getAllEpisodes().then((Episodes) => {
    Episodes.forEach((ep) => {
      const seasonPluEp = "S" + ep.season.toString().padStart(2, "0") + "E" + ep.number.toString().padStart(2, "0");
      const option = document.createElement('option');
      EpisodeDropDown.appendChild(option);
      option.textContent = seasonPluEp + "-" + ep.name;
    });
  })


  EpisodeDropDown.addEventListener('change', () => {
    let selectedOption = EpisodeDropDown.options[EpisodeDropDown.selectedIndex];
    clearCard();
    const nameOfTheEpisodeOnly = selectedOption.textContent.split('-')
    SearchTerm = nameOfTheEpisodeOnly[1];
    makePageCards();
  })
}


// function search the Episode by name
function SearchEpisode() {
  SearchTerm = input.value;
  clearCard();
  clearShows();
  makePageCards();
}

function SearchShow() {
  SearchTerm = input.value;
  console.log(SearchTerm);
  clearCard();
  clearShows();
  renderShow();
}

// this function display the episodes card on the page according to the current state
function makePageCards() {

  EpisodeDropDown.innerHTML = '';

  displayEpisodeList();

  input.setAttribute('placeholder', "Search Episodes");
  input.removeEventListener('input', SearchShow);
  input.addEventListener('input', SearchEpisode);

  getAllEpisodes().then((data) => {
    const allEpisodes = data;

    let filteredEpisode = allEpisodes.filter((episode) =>
      episode.name.includes(SearchTerm));

    let episodeCards = filteredEpisode.map(episode =>
      createEpisodesCard(episode));

    displayShowCardsNumbers(data, filteredEpisode);

    document.querySelector('#container').append(...episodeCards);
    SearchTerm = "";
  });
}

function renderShow() {

  EpisodeDropDown.innerHTML = '';
  displayEpisodeList();

  getAllShows().then((data) => {
    const allShow = data;

    let filteredShow = allShow.filter((show) =>
      show.name.includes(SearchTerm));

    let showCards = filteredShow.map(show =>
      createShowCards(show));

    displayShowCardsNumbers(allShow, filteredShow);

    document.querySelector('#show-container').append(...showCards);

    input.setAttribute('placeholder', "Search Shows");
    input.removeEventListener('input', SearchEpisode);
    input.addEventListener('input', SearchShow);

    //When show card clicked it takes to episodes of that clicked show
    document.querySelectorAll('.showCard').forEach((showCard) => {
      showCard.addEventListener('click', () => {
        selectedShow = showCard.getAttribute('id');
        clearCard();
        clearShows();
        makePageCards();
      });
    });

  });
}

//create card component for each episode
function createEpisodesCard(episode) {

  const rootElem = document.querySelector("#root").content.cloneNode(true);

  const seasonPluEp = "S" + episode.season.toString().padStart(2, "0") + "E" + episode.number.toString().padStart(2, "0");
  rootElem.querySelector("h1").textContent = episode.name + "-" + seasonPluEp;
  rootElem.querySelector("img").src = episode.image.original;
  rootElem.querySelector('p').innerHTML = episode.summary;
  limitText(rootElem.querySelector('p'), 45);
  rootElem.querySelector('a').href = episode.url;

  return rootElem;
}

function clearCard() {
  document.querySelectorAll('.card').forEach((e) => {
    e.remove();
  });
}

function clearShows() {
  document.querySelectorAll('.showCard').forEach((e) => {
    e.remove();
  })
}

function createShowCards(show) {

  const rootElem = document.querySelector("#showCards").content.cloneNode(true);
  rootElem.querySelector('section').setAttribute('id', show.id);
  rootElem.querySelector('h1').textContent = show.name;
  rootElem.querySelector('img').src = show.image.original;
  rootElem.querySelector('p').innerHTML = show.summary;

  let genre = "";
  rootElem.querySelector('#rate').innerHTML = show.rating.average;
  show.genres.forEach((gen) => {
    genre = `${genre}` + " " + gen;
  });

  rootElem.querySelector('#genres').innerHTML = genre;
  rootElem.querySelector('#status').innerHTML = show.status;
  rootElem.querySelector('#runtime').innerHTML = show.runtime;

  return rootElem;
}
function displayShowCardsNumbers(data, filtered) {

  const displayNumber = document.querySelector('#episodeNumber');
  displayNumber.textContent = "Displaying " + filtered.length + "/" + data.length + " Episodes";
}

function limitText(element, limit) {
  var text = element.innerText;
  var words = text.split(' ');
  var truncated = words.slice(0, limit).join(' ');
  element.textContent = truncated + '...';
}

home.addEventListener('click', () => {
  clearCard();
  renderShow();
  input.value = "";
});

displayShowList();

window.onload = renderShow;
