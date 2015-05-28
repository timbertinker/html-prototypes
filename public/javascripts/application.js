function gotoRoot() {
  window.location.href = '/v2/';
  return false;
}

var logo = document.getElementById('logo');
logo.onclick = gotoRoot;
