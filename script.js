const Select = document.querySelector('#selectShow');
const input = document.querySelector('#input');
let selectedShow = 1;
let SearchTerm = "";

async function getAllShows() {
  return await fetch("https://api.tvmaze.com/shows").then((data) => {
    return data.json();
  })
}

function getAllEpisodes() {
  return fetch(`https://api.tvmaze.com/shows/${selectedShow}/episodes`)
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
    makePageCards()
  })
}
 function displayShowCards(){
  getAllShows().then((show) => {
    
  })
 }

input.addEventListener('input', SearchEpisode);

function SearchEpisode() {
  SearchTerm = input.value;
  clearCard();
  makePageCards();
}

function makePageCards() {

  getAllEpisodes().then((data) => {
    const allEpisodes = data;

    let filteredEpisode = allEpisodes.filter((episode) =>
      episode.name.includes(SearchTerm));

    let episodeCards = filteredEpisode.map(episode =>
      createEpisodesCard(episode));

    document.querySelector('#container').append(...episodeCards);
  });
}
displayShowList();

function createEpisodesCard(episode) {
  const rootElem = document.querySelector("#root").content.cloneNode(true);
  const seasonPluEp = "S" + episode.season.toString().padStart(2, "0") + "E" + episode.number.toString().padStart(2, "0");

  rootElem.querySelector("h1").textContent = episode.name + "-" + seasonPluEp;
  rootElem.querySelector("img").src = episode.image.medium;
  rootElem.querySelector('p').innerHTML = episode.summary;

  return rootElem;
}
function clearCard() {
  document.querySelectorAll('.card').forEach((e) => {
    e.remove()
  })
}


makePageCards();
window.onload = displayShowList;
