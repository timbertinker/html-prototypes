function gotoRoot() {
  window.location.href = '/v3/';
  return false;
}

var logo = document.getElementById('logo');
logo.onclick = gotoRoot;
