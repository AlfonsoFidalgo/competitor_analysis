var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());


function getCompetitorAds(query){
  var url = "https://www.google.co.uk/search?q=" + query;
  var competitorAds = [];

  request(url, function(error, response, body){
    if (error) {
      res.send(error);
    };

    //jsdom
    const dom = new JSDOM(body);
    var ads = dom.window.document.getElementsByClassName('ads-ad');
    var position = 1;

    for (var i = 0; i < ads.length; i++){
      var competitorAd = {};
      var ad = ads[i];

      competitorAd.finalUrl = ad.getElementsByTagName('a')[0].href;
      competitorAd.headline = ad.getElementsByTagName('h3')[0].textContent;
      competitorAd.adText = ad.getElementsByClassName('ellip ads-creative')[0].textContent;
      competitorAd.visual_url = ad.getElementsByClassName('ads-visurl')[0].getElementsByClassName('_WGk')[0].textContent;
      competitorAd.position = position;
      competitorAd.time = new Date();
      competitorAd.query = query;

      position++;
      competitorAds.push(competitorAd);
    };

    console.log(competitorAds);
  });
};

var terms = ['transferwise', 'international money transfer', 'send money abroad'];

terms.forEach(function(term){
  getCompetitorAds(term);
});

app.listen(port, () => {
  console.log(`running on ${port}`);
});
