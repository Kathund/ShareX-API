/* eslint-disable */

const timestampToggle = document.getElementsByClassName('timestampToggle')[0];
const timestampSwitch = document.getElementsByClassName('timestampSwitch')[0];

const randomColorToggle = document.getElementsByClassName('randomColorToggle')[0];
const randomColorSwitch = document.getElementsByClassName('randomColorSwitch')[0];

let randomColorState = false;
let timestampState = false;

timestampToggle.addEventListener('click', () => {
  timestampState = !timestampState;
  timestampSwitch.classList.toggle('timestampActive');
});

randomColorToggle.addEventListener('click', () => {
  randomColorState = !randomColorState;
  randomColorSwitch.classList.toggle('randomColorActive');
});

function resetToDefault() {
  document.getElementById('authorInput').value = 'Kathund';
  document.getElementById('siteNameInput').value = 'Source Code';
  document.getElementById('descriptionInput').value = 'ShareX-API Made by Kathund';
  document.getElementById('authorURLInput').value = 'https://github.com/kathund';
  document.getElementById('siteNameURLInput').value = 'https://github.com/kathund/ShareX-API';
  document.getElementById('titleInput').value = 'ShareX-API';
  document.getElementById('colorInput').value = '#52A396';

  if (!timestampState) {
    timestampToggle.click();
  }

  if (randomColorState) {
    randomColorToggle.click();
  }
}

function clearBoxes() {
  document.getElementById('authorInput').value = '';
  document.getElementById('siteNameInput').value = '';
  document.getElementById('descriptionInput').value = '';
  document.getElementById('authorURLInput').value = '';
  document.getElementById('siteNameURLInput').value = '';
  document.getElementById('titleInput').value = '';
  document.getElementById('colorInput').value = '#000000';

  if (timestampState) {
    timestampToggle.click();
  }

  if (randomColorState) {
    randomColorToggle.click();
  }
}

function saveData() {
  const author = document.getElementById('authorInput').value;
  const siteName = document.getElementById('siteNameInput').value;
  const description = document.getElementById('descriptionInput').value;
  const authorURL = document.getElementById('authorURLInput').value;
  const siteNameURL = document.getElementById('siteNameURLInput').value;
  const title = document.getElementById('titleInput').value;
  const color = document.getElementById('colorInput').value;

  const urlParams = new URLSearchParams(window.location.search);
  const key = urlParams.get('key');

  fetch(`/embed?key=${key}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: author,
      siteName: siteName,
      description: description,
      authorURL: authorURL,
      siteNameURL: siteNameURL,
      title: title,
      color: color,
      timestampState: timestampState,
      randomColorState: randomColorState,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Log the response from the server
      console.log(data);
    });
}
