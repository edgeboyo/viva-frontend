document.getElementById("button").addEventListener("click", runQuery, false);

function runQuery() {
  const endpoint = document.getElementById("endpoint").value;
  const domain = document.getElementById("domain").value;
  const index = document.getElementById("index").value;
  const edge = document.getElementById("edge").value;

  var request = `http://${endpoint}/api/analyze?domain=${domain}&similarity=${index}`;

  if (edge !== "None") {
    request += `&edge=${edge}`;
  }

  console.log(request);

  fetch(request).then((data) => {
    data.json().then((json) => {
      const jsonString = JSON.stringify(json, null, 2);
      document.getElementById("raw").innerHTML = jsonString;
      console.log(json);
      createGraph(domain, json);
    });
  });
}
