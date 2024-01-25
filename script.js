const Select = document.querySelector('#selectShow');
const input = document.querySelector('#input');
let selectedShow = 3;
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
  getAllShows().then((data) => {
    const list = data;

    list.forEach((show) => {
      const option = document.createElement('option');
      Select.appendChild(option);
      option.textContent = show.name;

      selectedShow = show.id
      option.addEventListener('click', makePageCards)
    });

  })
}
displayShowList();


input.addEventListener('input', SearchEpisode);

function SearchEpisode() {
  SearchTerm = input.value;
  clearCards()
  makePageCards();
}

function makePageCards() {

  getAllEpisodes().then((data) => {
    const allEpisodes = data;

    let filteredEpisode = allEpisodes.filter((episode) =>
      episode.name.includes(SearchTerm));

    let episodeCards = filteredEpisode.map(episode =>
      createEpisodesCard(episode) );

    document.querySelector('#container').append(...episodeCards);
  });
}

function createEpisodesCard(episode) {
  const rootElem = document.querySelector("#root").content.cloneNode(true);
  const seasonPluEp = "S" + episode.season.toString().padStart(2, "0") + "E" + episode.number.toString().padStart(2, "0");

  rootElem.querySelector("h1").textContent = episode.name + "-" + seasonPluEp;
  rootElem.querySelector("img").src = episode.image.medium;
  rootElem.querySelector('p').innerHTML = episode.summary;

  return rootElem;
}

function clearCards() {
  document.querySelectorAll('.card').forEach((e) => {
    e.remove()
  })
}

window.onload = makePageCards;
