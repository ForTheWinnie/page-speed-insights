var currURL = "https://www.winniekwok.com/";
run(currURL);

function run(currURL) {
  const url = setUpQuery(currURL);
  const fetch = require("node-fetch");
  fetch(url)
    .then(response => response.json())
    .then(json => {
      // See https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed#response
      // to learn more about each of the properties in the response object.
      showInitialContent(json.id);
      const cruxMetrics = {
        "Score": (json.lighthouseResult.categories.performance.score)*100,	
        "First Contentful Paint": json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
        "First Input Delay": json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category
      };
      showCruxContent(cruxMetrics);
      const lighthouse = json.lighthouseResult;
      const lighthouseMetrics = {
        'First Contentful Paint': lighthouse.audits['first-contentful-paint'].displayValue,
        'Speed Index': lighthouse.audits['speed-index'].displayValue,
        'Time To Interactive': lighthouse.audits['interactive'].displayValue,
        'First Meaningful Paint': lighthouse.audits['first-meaningful-paint'].displayValue,
        'First CPU Idle': lighthouse.audits['first-cpu-idle'].displayValue,
        'Estimated Input Latency': lighthouse.audits['estimated-input-latency'].displayValue
      };
      showLighthouseContent(lighthouseMetrics);
    });
}

function setUpQuery(currURL) {
  const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const parameters = {
    url: currURL,//encodeURIComponent('https://www.winniekwok.com/'), 
    //strategy: 'mobile', 
    key: 'key'
  };
  let query = `${api}?`;
  for (key in parameters) {
    query += `${key}=${parameters[key]}&`;
  }
  console.log("query: " + query);
  return query;
}

function showInitialContent(id) {
  document.body.innerHTML = '';
  const title = document.createElement('h1');
  title.textContent = 'PageSpeed Insights Data';
  document.body.appendChild(title);
  const page = document.createElement('p');
  page.textContent = `Page tested: ${id}`;
  document.body.appendChild(page);
}

function showCruxContent(cruxMetrics) {
  const cruxHeader = document.createElement('h2');
  cruxHeader.textContent = "Chrome User Experience Report Results";
  document.body.appendChild(cruxHeader);
  for (key in cruxMetrics) {
    const p = document.createElement('p');
    p.textContent = `${key}: ${cruxMetrics[key]}`;
    document.body.appendChild(p);
  }
}

function showLighthouseContent(lighthouseMetrics) {
  const lighthouseHeader = document.createElement('h2');
  lighthouseHeader.textContent = "Lighthouse Results";
  document.body.appendChild(lighthouseHeader);
  for (key in lighthouseMetrics) {
    const p = document.createElement('p');
    p.textContent = `${key}: ${lighthouseMetrics[key]}`;
    document.body.appendChild(p);
  }
}




// const psi = require('psi');
 
// // Get the PageSpeed Insights report
// psi('www.malwarebytes.com/products/').then(data => {
//   console.log(data.ruleGroups.SPEED.score);
//   console.log(data.pageStats);
// });
 
// // Output a formatted report to the terminal
// psi.output('www.malwarebytes.com/products/').then(() => {
//   console.log('done');
// });
 
// // Supply options to PSI and get back speed and usability scores
// psi('www.malwarebytes.com/products/', {nokey: 'true', strategy: 'desktop', threshold: '40'}).then(data => {
//   console.log('Speed score:', data.ruleGroups.SPEED.score);
//   console.log('Usability score:', data.ruleGroups.USABILITY.score);
// });