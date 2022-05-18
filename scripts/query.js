const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

const { endpoint, domain, index, edge } = params;

console.log(params);

var changed = 0;

if (endpoint) {
  console.log(`Adding ${endpoint} to endpoint field`);
  document.getElementById("endpoint").value += endpoint;
  changed++;
}

if (domain) {
  console.log(`Adding ${domain} to domain field`);
  document.getElementById("domain").value += domain;
  changed++;
}

if (index) {
  console.log(`Adding ${index} to index field`);
  document.getElementById("index").value = index;
  changed++;
}

if (edge) {
  console.log(`Adding ${edge} to the edge field`);
  document.getElementById("edge").value = edge;
}

if (changed == 3) {
  runQuery(); // imported from scripts/demo.js
}
