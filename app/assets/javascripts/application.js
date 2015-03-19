function gotoRoot() {
  window.location.href = '/v1-2/';
  return false;
}

var logo = document.getElementById('logo');
logo.onclick = gotoRoot;