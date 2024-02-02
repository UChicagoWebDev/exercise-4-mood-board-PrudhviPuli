const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY;

function runSearch() {
  const results = document.getElementById("resultsImageContainer");
  const results_length = results.children.length;
  for (let i = results_length - 1 ; i >=0 ; i--){
    results.removeChild(results.children[i]);
  }

  openResultsPane();

  let search_input = document.querySelector(".search input");
  let query = search_input.value;

  if (!query){
    return false
  }

  let encoded_query = encodeURIComponent(query);

  let request = new XMLHttpRequest();
  request.open("GET", `${bing_api_endpoint}?q=${encoded_query}`);
  request.responseType = "json";

  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.addEventListener("load",() => handleResponse(request));
  
  request.send();

  return false; 
}

function handleResponse(request) {
  if (request.status >= 200 && request.status < 300){

    let images = request.response.value;
    let results = document.getElementById("resultsImageContainer");
    
    images.forEach(image => {
      let div = document.createElement("div");
      div.className = "resultImage";
  
      let img = document.createElement("img");

      img.setAttribute("src",image.thumbnailUrl);
      img.setAttribute("alt",image.name);
      
      div.appendChild(img);
      div.addEventListener("click",() => addSelectedImage(image.contentUrl));
    
      clearSearches();
      updateSuggestedSearches(request.response.relatedSearches);
    
      results.appendChild(div);

    });
  }
  else{
    console.error("Error:",request.statusText);
  }
}

function addSelectedImage(contentUrl){

  let board = document.getElementById("board");

  const div = document.createElement("div");

  div.className = "savedImage";
  div.innerHTML = `<img src="${contentUrl}">`;

  board.appendChild(div);
}

function clearSearches() {
  const suggestedSearches = document.getElementById('suggestedSearches');
  
  while (suggestedSearches.firstChild) {
    suggestedSearches.removeChild(suggestedSearches.firstChild);
  }
}

function updateSuggestedSearches(searches) {
  const suggestedSearches = document.getElementById("suggestedSearches");
  
  searches.forEach(item => {
    const searchItem = document.createElement('li');
    searchItem.innerHTML = `${item.text}`;
    suggestedSearches.appendChild(searchItem);

    const suggestionsitem = document.querySelectorAll('.suggestions li');
    suggestionsitem.forEach(item => {
    
      item.addEventListener('click', (e) => {
        const query = e.target.innerText;
        document.querySelector('.search input').value = query;
        runSearch();
      });
    });

  });
}


function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch()}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
