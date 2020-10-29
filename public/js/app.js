console.log("Client-side JS file is loaded!");

const getAddressInput = () => document.getElementById("address").value;

const getWeather = async (address) => {
  const res = await fetch(`/weather?address=${address}`);
  const data = await res.json();
  return data;
};

const renderWeather = (location, forecast) => {
  document.getElementById("result").innerHTML = `
  <p>
    <strong>Location:</strong> ${location}
  </p>
  <p>
    <strong>Forecast:</strong> ${forecast}
  </p>`;
};

const renderError = (error) => {
  document.getElementById("result").innerHTML = `
  <p>
    <strong style="color:red;">Error:</strong> ${error}
  </p>`;
};

const renderResponse = (response) => {
  if (response.error) renderError(response.error);
  else renderWeather(response.location, response.forecast);
};

const showLoading = () => {
  document.getElementById("result").innerHTML = "<p><em>Loading...</em></p>";
};

const disableSubmitBtn = () => {
  document.getElementById("submit").disabled = true;
};

const enableSubmitBtn = () => {
  document.getElementById("submit").disabled = false;
};

document.getElementById("form").addEventListener("submit", async (event) => {
  event.preventDefault();
  disableSubmitBtn();
  showLoading();
  const address = getAddressInput();
  const res = await getWeather(address);
  renderResponse(res);
  enableSubmitBtn();
});
