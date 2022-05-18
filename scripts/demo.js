// This is where the graph generation code goes

function createNode(name, rad, color) {
  const node = {
    id: name,
    marker: { radius: rad },
    color,
  };

  return node;
}

function pickArticle(nextWord) {
  const vowels = ["a", "e", "i", "o", "u", "y"];

  return vowels.includes(nextWord.charAt(0).toLowerCase()) ? "an" : "a";
}

function createGraph(requestedDomain, analysisResults) {
  const edgeRad = 10,
    squatterMinRad = 15,
    squatterMaxRad = 20,
    originalRad = 30;

  const {
    suspectedOriginal,
    suspectedSquatters,
    edgeDomains,
    originalityScores,
    rawMetrics,
  } = analysisResults;

  var edgeColor = "#E8544E",
    squatterColor = "#FFD265",
    originalColor = "#2AA775";

  const nodeTypes = Object.fromEntries([
    [edgeColor, "Edge Node"],
    [squatterColor, "Squatter Node"],
    [originalColor, "Original Node"],
  ]);

  const originalNode = createNode(
    suspectedOriginal,
    originalRad,
    originalColor
  );
  var nodes = [originalNode];

  const allRoutes = suspectedSquatters
    .concat(edgeDomains)
    .map((domain) => [suspectedOriginal, domain]);

  const scores = Object.values(originalityScores);

  const max = Math.max(...scores),
    min = Math.min(...scores);

  nodes = suspectedSquatters
    .map((domain) => {
      const score = originalityScores[domain];

      const radius =
        squatterMinRad +
        (score / (max - min)) * (squatterMaxRad - squatterMinRad);

      return createNode(domain, radius, squatterColor);
    })
    .concat(nodes);

  nodes = edgeDomains
    .map((domain) => {
      return createNode(domain, edgeRad, edgeColor);
    })
    .concat(nodes);

  Highcharts.chart("container", {
    chart: {
      type: "networkgraph",
      marginTop: 80,
    },

    title: {
      text: `Typosquatting analysis of ${requestedDomain}.com`,
    },

    tooltip: {
      formatter: function () {
        const domain = this.key;
        var info = "";

        const metrics = rawMetrics[domain];

        Object.entries(metrics).map(([key, value]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1);
          info += `<b>${label}</b>: ${value}<br\>`;
        });

        if ([squatterColor, originalColor].includes(this.color)) {
          info += `<b>Originality</b>: ${originalityScores[domain]}`;
        } else {
          info =
            "This is an <b>edge domain</b>.<br/>To include originality score increase the<br/><b>similarity index.</b>";
        }
        const type = nodeTypes[this.color];
        return (
          `<b>${this.key}</b> is ${pickArticle(type)} <b>${type}</b> <br/>` +
          info
        );
      },
    },

    plotOptions: {
      networkgraph: {
        keys: ["from", "to"],
        layoutAlgorithm: {
          enableSimulation: true,
          integration: "verlet",
          linkLength: 100,
        },
      },
    },

    series: [
      {
        marker: {
          radius: 13,
        },
        dataLabels: {
          enabled: true,
          linkFormat: "",
          allowOverlap: true,
          style: {
            textOutline: false,
          },
        },
        data: allRoutes,
        nodes,
      },
    ],
  });
}
