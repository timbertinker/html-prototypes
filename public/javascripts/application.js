function gotoRoot() {
  if ((window.location.href.indexOf("/v3-1") > 1) || (window.location.href.indexOf("/v3-2") > 1)) {
  	window.location.href = '/v3-1/';
  }
  else {
  	window.location.href = '/v3/';
  }
  return false;
}


var logo = document.getElementById('logo');
logo.onclick = gotoRoot;

