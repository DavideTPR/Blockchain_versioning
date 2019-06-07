//Get data of specified cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

//check if a user is logged to modify menu options
function checkLogged(){
  var menu = document.getElementById("menu");

  if(getCookie("ID") != ""){
    menu.innerHTML += '<a href="/" onclick="logout()">Logout</a>';
  }
  else{
    var logi = document.createElement("A");
    logi.appendChild(document.createTextNode("Login"));
    logi.setAttribute("href", "login.html");
    
    var subs = document.createElement("A");
    subs.appendChild(document.createTextNode("Subscribe"));
    subs.setAttribute("href", "subscribe.html");

    menu.appendChild(subs);
    menu.appendChild(logi);
  }
}

//logout function, delete cookies
function logout(){
  document.cookie = "ID= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "wall= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "name= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
}