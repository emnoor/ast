(function() {
    // add event listeners

    let enFileSelector = document.getElementById("en-file-selector");
    enFileSelector.addEventListener("change", (_) => {
        const fileList = enFileSelector.files;
        console.log(fileList);
        readFile(fileList[0]);
    });

    let enFileSelectorButton = document.getElementById("en-file-selector-button");
    enFileSelectorButton.addEventListener("click", (_) => {
        enFileSelector.click();
    });

    let enDownloadButton = document.getElementById("en-download-button");
    enDownloadButton.addEventListener("click", (_) => {
        downloadEnglishXML();
    });

    let bnDownloadButton = document.getElementById("bn-download-button");
    bnDownloadButton.addEventListener("click", (_) => {
        downloadBanglaXML();
    });
})();


function readFile(file) {
    if (file.type && file.type.indexOf("xml") === -1) {
        console.log("file is not an xml.", file.type, file);
        return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
        parseFile(event.target.result);
    });
    reader.readAsText(file, "UTF-8");
}


function parseFile(content) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(content, "text/xml");

    let stringList = doc.getElementsByTagName("string");
    let tableBody = document.getElementById("table-body");
    tableBody.innerHTML = ""

    for (let i = 0; i < stringList.length; i++) {
        let key = stringList[i].getAttribute("name");
        let value = stringList[i].textContent;

        tableBody.append(
            createTr(
                // createTd(key),
                createTd(createTextarea(key, value, "en-td")),
                createTd(createTextarea(key, value, "bn-td")),
            )
        );
    }

    return doc;
}


function createTextarea(name, text, className) {
    let textarea = document.createElement("textarea");
    textarea.name = name;
    textarea.innerText = text;
    textarea.rows = "3";
    textarea.classList.add(className, "form-control");
    return textarea;
}


function createTd(content) {
    let td = document.createElement("td");
    td.append(content);
    return td;
}


function createTr(...contents) {
    let tr = document.createElement("tr");
    tr.append(...contents);
    return tr;
}


function downloadEnglishXML() {
    downloadXML("en");
}


function downloadBanglaXML(params) {
    downloadXML("bn");
}


function downloadXML(lang) {
    let className, filename;
    if (lang === "bn") {
        className = "bn-td";
        filename = "bn.xml";
    } else {
        className = "en-td";
        filename = "en.xml";
    }

    let textareaList = document.getElementsByClassName(className);
    let doc = document.implementation.createDocument(null, "resources");

    for (let i = 0; i < textareaList.length; i++) {
        let e = doc.createElement('string');
        e.setAttribute("name", textareaList[i].name);
        e.textContent = textareaList[i].value;
        doc.documentElement.append(e);
    }

    console.log(doc);

    let serializer = new XMLSerializer();
    let xmlString = serializer.serializeToString(doc);

    let blob = new Blob([xmlString], {type: "text/xml"});
    var url = URL.createObjectURL(blob);
    // document.open(url);

    var a = document.createElement('a');
    // a.href = 'data:attachment/text,' + encodeURI(xmlString);
    a.href = url;
    a.target = '_blank';
    a.download = filename;
    a.click();

    console.log(a.href);
}
