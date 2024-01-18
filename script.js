//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  const episodeCards = makePageForEpisodes(allEpisodes);
  document.body.append(...episodeCards);
}

function makePageForEpisodes(episodeList) {
  const episodeCards = episodeList.map(e => createEpisodesCard(e));
  return episodeCards;
}

function createEpisodesCard(episode) {
  const rootElem = document.getElementById("root").content.cloneNode(true);
  const seasonPluEp = "S" + episode.season.toString().padStart(2, "0") + "E" + episode.number.toString().padStart(2, "0");

  rootElem.querySelector("h1").textContent = episode.name + "-" + seasonPluEp;
  rootElem.querySelector("img").src = episode.image.medium;
  rootElem.querySelector('p').innerHTML = episode.summary;

  return rootElem;
}

window.onload = setup;

