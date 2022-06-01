"use strict";

const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";

const $showsList = $("#shows-list"); // they div where the info is attached
const $episodesArea = $("#episodes-area"); // section at the bottom
const $searchForm = $("#search-form"); // the form ID


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function searchShows( showTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const res = await axios.get(`https://api.tvmaze.com/search/shows?q=${showTerm}`);
  console.log(res);
  let shows = res.data.map(result => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
      // image: show.image.medium
    };
  });
  return shows;
}

//line 19 and 20 what is it doing? there is a key called show ?
/** Given list of shows, create markup for each and to DOM */

// function populateShows(shows) {
//   const $showsList = $("#shows-list");
//   $showsList.empty();

  

//   for (let show of shows) {
//     try {
//       const $show = $(
//           `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
//            <div class="media">
//              <img 
//                 src="${show.image}" 
//              <div class="media-body">
//                <h5 class="text-primary">${show.name}</h5>
//                <div><small>${show.summary}</small></div>
//                <button class="btn btn-outline-light btn-sm Show-getEpisodes">
//                  Episodes
//                </button>
//              </div>
//            </div>  
//          </div>
//         `);
//         $showsList.append($show); 
//     } catch (error) {
      
//     const $showNoImg = $(
//         `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
//          <div class="media">
//            <img 
//               src="https://tinyurl.com/tv-missing" 
//            <div class="media-body">
//              <h5 class="text-primary">${show.name}</h5>
//              <div><small>${show.summary}</small></div>
//              <button class="btn btn-outline-light btn-sm Show-getEpisodes">
//                Episodes
//              </button>
//            </div>
//          </div>  
//        </div>
//       `);
//       $showsList.append($showNoImg);  
//   }
//     }    
// }



function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($item);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await searchShows(term);
  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
 async function getEpisodesOfShow(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = res.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}


function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
    
  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }

  $("#episodes-area").show();
}


/** Handle click on show name. */

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});






/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
