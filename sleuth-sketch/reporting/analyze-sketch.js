const ns = require('node-sketch');

let externalSymbolIds;
let externalTextStyleIds;
let externalLayerStyleIds;

const countLayers = (node, counts) => {
    if (node.layers) {
        node.layers.forEach((layerNode) => {
            countLayers(layerNode, counts);
        });
    } else {
        counts.layers++;
    }

    if (node.symbolID && externalSymbolIds.has(node.symbolID)) {
        counts.layersReferencingExternalSymbols++;
    }
    if (node.sharedStyleID && externalLayerStyleIds.has(node.sharedStyleID)) {
        counts.layersReferencingExternalLayerStyles++;
    }

    if (node.sharedStyleID && externalTextStyleIds.has(node.sharedStyleID)) {
        counts.layersReferencingExternalTextStyles++;
    }

    return counts;
};

module.exports = async filePath => {
    const sketch = await ns.read(filePath);
    const pages = [...sketch.pages, sketch.symbolsPage];
    externalSymbolIds = new Set(sketch.foreignSymbols.map((item) => item.symbolID));
    externalTextStyleIds = new Set(sketch.foreignTextStyles.map((item) => item.do_objectID));
    externalLayerStyleIds = new Set(sketch.foreignLayerStyles.map((item) => item.do_objectID));

    const counts = {
        layers: 0,
        layersReferencingExternalSymbols: 0,
        layersReferencingExternalLayerStyles: 0,
        layersReferencingExternalTextStyles: 0
    };

    var haveCheckedSymbolsPage = false;
    pages.forEach(page => {
        if (page && (page != sketch.symbolsPage || !haveCheckedSymbolsPage)) {
            countLayers(page, counts);
        }
        if (page == sketch.symbolsPage) {
            haveCheckedSymbolsPage = true;
        }
    });

    return counts;
};
