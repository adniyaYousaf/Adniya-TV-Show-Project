//You can edit ALL of the code here
const input = document.querySelector('#input');
let SearchTerm = "";

input.addEventListener('input', SearchEpisode);

function SearchEpisode() {
    SearchTerm = input.value;
    document.querySelectorAll('.card').forEach((e) => {
      e.remove()
    })
    render();
  }

function render() {

  const allEpisodes = getAllEpisodes();
  let filteredEpisode = allEpisodes.filter((episode) =>
    episode.name.includes(SearchTerm));

  let episodeCards = filteredEpisode.map(episode =>
    createEpisodesCard(episode));

  document.querySelector('#container').append(...episodeCards);
}

function createEpisodesCard(episode) {
  const rootElem = document.getElementById("root").content.cloneNode(true);
  const seasonPluEp = "S" + episode.season.toString().padStart(2, "0") + "E" + episode.number.toString().padStart(2, "0");

  rootElem.querySelector("h1").textContent = episode.name + "-" + seasonPluEp;
  rootElem.querySelector("img").src = episode.image.medium;
  rootElem.querySelector('p').innerHTML = episode.summary;

  return rootElem;

}

window.onload = render;
