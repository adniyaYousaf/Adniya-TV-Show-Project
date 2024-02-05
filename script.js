const Select = document.querySelector('#selectShow');
let EpisodeDropDown = document.querySelector('#selectEpisode')
const input = document.querySelector('#input');
const readMore = document.querySelector('#readMore');
const goBackBtn = document.querySelector('#goBackBtn');

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
    selectedShow = selectedOption.getAttribute('id');
    clearCard();
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

input.addEventListener('input', SearchEpisode);
// function search the Episode by name
function SearchEpisode() {
  SearchTerm = input.value;
  clearCard();
  makePageCards();
}


function SearchShow() {
  SearchTerm = input.value;
  clearCard();
  renderShow();
}

// this function display the episodes card on the page according to the current state
function makePageCards() {

  EpisodeDropDown.innerHTML = '';
  displayEpisodeList();

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

    document.querySelector('#container').append(...showCards);
    SearchTerm = "";

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
  rootElem.querySelector('#url').href = episode.url;


  return rootElem;
}
function clearCard() {
  document.querySelectorAll('.card').forEach((e) => {
    e.remove();
  })
}

function createShowCards(show) {

  const rootElem = document.querySelector("#root").content.cloneNode(true);

  rootElem.querySelector("h1").textContent = show.name;
  rootElem.querySelector("img").src = show.image.original;
  rootElem.querySelector('a').href = show.url;
  rootElem.querySelector('p').innerHTML = show.summary;
  limitText(rootElem.querySelector('p'), 45);
  rootElem.querySelector('#url').remove();

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



displayShowList();

window.onload = renderShow;
