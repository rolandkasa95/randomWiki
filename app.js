const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var fetch = require('node-fetch');

app.use(bodyParser());
app.set('view engine', 'pug');

const generateNumber = () => {
    return parseInt(Math.random() * 60000000);
};

const generateNumberLimited = (top) => {
    return parseInt(Math.random() * top);
};

const load = async (n = undefined) => {
    let resultJson;
    const number = n || generateNumber();

    try {
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=info&pageids=${number}&inprop=url&format=json`;
        const result = await fetch(url);
        resultJson = await result.json();
    } catch (e) {
        return await load(n);
    }

    const parseble = resultJson.query.pages[number];
    if (parseble.hasOwnProperty('missing')) {
        console.log('handled');
        return await load(n);
    }

    return parseble;
};

function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return '%' + c.charCodeAt(0).toString(16);
    });
  }

const loadCategory = async (category) => {
    let resultJson;

    try {
        let url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=allcategories&acfrom=${category}&acprop=size`;
        let result = await fetch(url);
        resultJson = await result.json();
        let parseble = resultJson.query.allcategories;
        let data = fixedEncodeURIComponent(parseble[generateNumberLimited(parseble.length)]['*']);
        url = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=categorymembers&cmtitle=Category:${data}&cmlimit=20&cmsort=timestamp`;
        result = await fetch(url);
        resultJson = await result.json();
        const pageId = resultJson.query.categorymembers[generateNumberLimited(resultJson.query.categorymembers.length)].pageid;
        return await load(pageId);
    } catch (e) {
        return await loadCategory(category);
    }
};

app.get('/', async (req, res) => {
    const category = (req.query && req.query.category) ? req.query.category : undefined; 

    const data = category ? await loadCategory(category) : await load(); 
    res.render('index', { ...data, category });
});

app.listen(3000);