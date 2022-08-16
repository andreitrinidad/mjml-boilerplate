const mjml2html = require('mjml');
const fs = require('fs');
const path = require('path');

function readFromFile(file, getText = true) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, function (err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        let _data;
        if (getText) {
          _data = data.toString();
        }
        else {
          _data = JSON.parse(data);
        }
        resolve(_data);
      }
    });
  });
}


function getVariants() {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, '../../variants'), (err, files) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      let variants = [];
      files.forEach(async (file) => {
        const directory = `../../variants/${file}`;
        const JSONFile = directory + `/${file}.json`;
        const stat = fs.statSync(path.resolve(__dirname, directory));
        if (stat.isFile()) return;
        variants.push(JSONFile);
      })
      resolve(variants);
    });
  });
}


const getTemplate = async () => {
  let template = await getVariants();
  let promises = [];
  template.forEach(dir => {
    promises.push(readFromFile(path.resolve(__dirname, dir), false))
  });
  const _template = await Promise.all(promises);
  return _template;
};


// per template generator
const generateTemplate = (fileName = 'index', template = []) => {
  let promises = [];
  //get index file
  promises.push(readFromFile(path.resolve(__dirname, '../global/' + 'index.mjml')));
  template.forEach(dir => {
    promises.push(readFromFile(path.resolve(__dirname, '../components/' + dir)))
  });

  Promise.all(promises).then(result => {
    let output = '';
    const header = result[0].split('<!-- split -->')[0];
    const footer = result[0].split('<!-- split -->')[1];

    // inject header
    output += header;

    // get each component
    result.shift(); // removes first component since it contains the header and footer
    result.forEach(res => {
      output += res;
    })

    // insert footer
    output += footer;

    // generate HTML output
    const htmlOutput = mjml2html(output, { keepComments: true });

    //  write the MJML file
    fs.writeFile(path.resolve(__dirname, `../../variants/${fileName}/${fileName}.mjml`), output, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log(`Variant ${fileName} generated!`);
      return;
    });

    //  write the MJML file
    fs.writeFile(path.resolve(__dirname, `../../variants/${fileName}/${fileName}.html`), htmlOutput.html, 'utf8', function (err) {
      if (err) return console.log(err);
      console.log(`Output for ${fileName} generated!`);
      return;
    });
  });
};

// generate all tempaltes and also create index.html as well
const generateTemplatesIndex = async () => {
  const template = await getTemplate();

  const package = require('./../../package.json');
  let indexHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/picnic">
    </head>
    <body>
      <h1>${package.name} </h1>
      <h3>${package.description} </h3>
      <hr>
      <ul>
  `;

  template.forEach(({ name, content }) => {
    indexHTML += `<li><a href="/variants/${name}/${name}.html">${name}</a></li>`;
    generateTemplate(name, content);
  });

  indexHTML += `
    </ul>
    </body>
  </html>
  `;

  fs.writeFile(path.resolve(__dirname, `../../index.html`), indexHTML, 'utf8', function (err) {
    if (err) return console.log(err);
    console.log('Index HTML generated!');
    return;
  });
}


generateTemplatesIndex();
