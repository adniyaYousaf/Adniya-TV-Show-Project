const Select = document.querySelector('#selectShow');
let EpisodeDropDown = document.querySelector('#selectEpisode')
const input = document.querySelector('#input');
const readMore = document.querySelector('#readMore');
let selectedShow = 1;
let selectedEpisode = 1;
let SearchTerm = "";


async function getAllShows() {
  return await fetch("https://api.tvmaze.com/shows").then((data) => {
    return data.json();
  })
}

async function getAllEpisodes() {
  return await fetch(`https://api.tvmaze.com/shows/${selectedShow}/episodes`)
    .then((data) => {
      return data.json();
    })
}

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
    SearchTerm = selectedOption;
    makePageCards();
  })
}

input.addEventListener('input', SearchEpisode);

function SearchEpisode() {
  SearchTerm = input.value;
  clearCard();
  makePageCards();
}

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
  });
}
function createEpisodesCard(episode) {

  const rootElem = document.querySelector("#root").content.cloneNode(true);
  const seasonPluEp = "S" + episode.season.toString().padStart(2, "0") + "E" + episode.number.toString().padStart(2, "0");

  rootElem.querySelector("h1").textContent = episode.name + "-" + seasonPluEp;
  rootElem.querySelector("img").src = episode.image.medium;
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
makePageCards();
window.onload = displayShowList;
