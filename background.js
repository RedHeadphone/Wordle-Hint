
chrome.browserAction.onClicked.addListener(function(tab) {
    let queryOptions = {
        'active': true,
        'currentWindow':true
    };
    chrome.tabs.query(queryOptions,(tabs)=>{
        console.log(tabs);
        if (tabs[0].url!="https://www.nytimes.com/games/wordle/index.html"){
            chrome.tabs.create({ url: "https://www.nytimes.com/games/wordle/index.html" });
        }
    });
 });