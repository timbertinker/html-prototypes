function gotoRoot() {
  window.location.href = '/';
  return false;
}

var logo = document.getElementById('logo');
logo.onclick = gotoRoot;