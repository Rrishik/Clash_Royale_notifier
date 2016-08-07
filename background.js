var url_news = "https://clashroyale.com/blog/news";
var url_main = "https://clashroyale.com";
var storage = localStorage;

refresh();

function refresh(){
  console.log("refresh()");
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url_news, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      main(xhr.responseText);
    }
  }
  xhr.send();
}

function main(page){
  console.log("main(page)");
  var i = 0;
  //var allKeys;
  //var htmlDoc = document.createElement('html');
  //htmlDoc.innerHTML = page;
  // //var divs = [];
  // divs = document.createElement('html');
  // divs.innerHTML = htmlDoc.getElementsByClassName("home-news-primary-item-holder")[0].innerHTML;
  //console.log(divs);

  //console.log getDiv(page,0).getElementsByTagName("a")[0].getAttribute("href"));

  // storage.get(null, function(items) {
  //   function allKeys(){
  //     return items;
  //   };
  //   console.log(allKeys().hasOwnProperty('top_news'));
  // });
  //var keys = getAllFromStorage();
  //console.log(keys);
  if (storage.hasOwnProperty('top_news')) {
    console.log("has 'top_news' !!");
    var topNews = storage.top_news;
    //console.log('topNews',topNews);

    while (getDiv(page,i).getElementsByTagName("a")[0].getAttribute("href") != topNews) {
      i++;
    }
  }
  else {
    var news_str = getDiv(page,0).getElementsByTagName("a")[0].getAttribute("href");
    storage.top_news = news_str;
    console.log("No 'top_news' found..   Saved!!");
  }

  if (i == 0) {
    console.log("i=0");
    updateIcon(0);
    chrome.browserAction.setTitle({title:"No new updates!"});
    chrome.browserAction.onClicked.addListener(function(){
      gotoPage(url_news)
    });
    //set browserAction title to no new news
  }
  else {
    updateIcon(i);
    chrome.browserAction.setPopup({popup:'popup.html'});
    chrome.browserAction.setTitle({title:"Updates available!"});
    console.log("i!=0 popup onClick");
    for (var j = 0; j <= i; j++) {
      var div = document.createElement("div");
      console.log("div created");
      var string = getDiv(page,j).getElementsByTagName("a")[0].getAttribute("data-label");
      var news = document.createTextNode(string.substring(string.lastIndexOf("-")+2));
      console.log(news);
      div.appendChild(news);
      console.log(div);
      document.getElementById('news').appendChild(div);
      console.log("generating news link...");
      var news_link = [url_main , getDiv(page,j).getElementsByTagName("a")[0].getAttribute("href")].join('');
      div.addEventListener("click",function(){
        gotoPage(news_link);
      });

      //get new news divs[i] and display on the popup page
      //divs onclick link to the specified news page
    }
    console.log("outside for");
    var news_str = getDiv(page,0).getElementsByTagName("a")[0].getAttribute("href");
    storage.top_news = news_str;
  }
}

function updateIcon(a){
  chrome.browserAction.setIcon({path:'cr-logo_19.png'});
  chrome.browserAction.setBadgeBackgroundColor({color:'#99ccff'});
  chrome.browserAction.setBadgeText({text:a.toString()});
}

function gotoPage(link){
  chrome.tabs.getAllInWindow(undefined,function(tabs){
    for (var i=0, tab;tab=tabs[i];i++){
      console.log(tab.url);
      if(tab.url == link){
        chrome.tabs.update(tab.id,{highlighted:true});
      }
    }
    chrome.tabs.create({url: link});
  });
}

/*function getLocalData(){
  chrome.storage.sync.get("top_news",function(data){
    return data;
  });
}*/

/*function setLocalData(value){
  var obj ={};
  obj["top_news"]=value;
  console.log(obj.top_news);
  chrome.storage.sync.set(obj,function(){console.log("Saved!!   ",key,value);});
}*/

function getDiv(page,i){
  console.log("getDiv: i = ",i);
  var htmlDoc = document.createElement('html');
  htmlDoc.innerHTML = page;
  var div = document.createElement('html');
  div.innerHTML = htmlDoc.getElementsByClassName("home-news-primary-item-holder")[i].innerHTML;
  //console.log(div.innerHTML);
  return div;
}

// function getAllFromStorage(){
//     storage.get(null,function(obj){
//       console.log(obj);
//       return obj;
//     });
// }

/*
function gotoNews(link){
  chrome.tabs.getAllInWindow(undefined,function(tabs){
    for (var i=0, tab;tab=tabs[i];i++){
      //console.log(tab.url);
      if(tab.url == link){
        chrome.tabs.update(tab.id,{highlighted:true});
        return;
      }
    }
    chrome.tabs.create({url:link});
  });
}
*/

if (chrome.runtime && chrome.runtime.onStartup) {
  chrome.runtime.onStartup.addListener(function() {
    console.log('Starting browser... Refreshing..');
    refresh();
  });
}
