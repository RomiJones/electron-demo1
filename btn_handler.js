var hello = require("hello");
function onClickBtn1() {
	//alert(hello.f1());
	
	//文档上说，只有main process中才能调用gui模块和系统底层模块(本地gui模块是啥？)
	//意思是不是说render process中只调用前端js和electron接口
	//main process中才能调用nodejs，底层c++，以及electron接口
	alert("current process id :" + hello.getCurrentProcessId());
}

const {ipcRenderer} = require('electron');
function onClickBtn2() {
  var originStr = "zengsheng";
  ipcRenderer.send("invoke-cpp-module", originStr);
}

ipcRenderer.on("invoke-cpp-module-reply", function (event, arg) {
  //alert(arg);
  var x = document.getElementById("ui_label_1");
  x.innerHTML = arg;
})

window.onload = function() {
	addTitlebar("top-titlebar", "tbp_mark.png");
	updateContentStyle();
}

function closeWindow() {
  window.close();
}

function updateImageUrl(image_id, new_image_url) {
  var image = document.getElementById(image_id);
  if (image)
    image.src = new_image_url;
}

function createImage(image_id, image_url) {
  var image = document.createElement("img");
  image.setAttribute("id", image_id);
  image.src = image_url;
  return image;
}

function createButton(button_id, button_name, 
				normal_image_url, hover_image_url, click_func)
{
  var button = document.createElement("div");
  button.setAttribute("class", button_name);
  var button_img = createImage(button_id, normal_image_url);
  button.appendChild(button_img);
  button.onmouseover = function() {
    updateImageUrl(button_id, hover_image_url);
  }
  button.onmouseout = function() {
    updateImageUrl(button_id, normal_image_url);
  }
  button.onclick = click_func;
  return button;
}

function addTitlebar(titlebar_name, titlebar_icon_url) {
  var titlebar = document.createElement("div");
  titlebar.style.backgroundColor = "#3a3d3d";
  titlebar.setAttribute("id", titlebar_name);
  titlebar.setAttribute("class", titlebar_name);

  var icon = document.createElement("div");
  icon.setAttribute("class", titlebar_name + "-icon");
  icon.appendChild(createImage(titlebar_name + "icon", titlebar_icon_url));
  titlebar.appendChild(icon);

  var title = document.createElement("div");
  title.setAttribute("class", titlebar_name + "-text");
  title.innerText = "轻客户端验证";
  titlebar.appendChild(title);
  
  var closeButton = createButton(titlebar_name + "-close-button",
                                 titlebar_name + "-close-button",
                                 "button_close.png",
                                 "button_close_hover.png",
                                 closeWindow);
  titlebar.appendChild(closeButton);
  
  var divider = document.createElement("div");
  divider.setAttribute("class", titlebar_name + "-divider");
  titlebar.appendChild(divider);

  document.body.appendChild(titlebar);
}

function updateContentStyle()
{
  var content = document.getElementById("content");
  if (!content)
    return;

  var left = 0;
  var top = 0;
  var width = window.outerWidth;
  var height = window.outerHeight;

  var titlebar = document.getElementById("top-titlebar");
  if (titlebar)
  {
    height -= titlebar.offsetHeight;
    top += titlebar.offsetHeight;
  }

  var contentStyle = "position: absolute; ";
  contentStyle += "left: " + left + "px; ";
  contentStyle += "top: " + top + "px; ";
  contentStyle += "width: " + width + "px; ";
  contentStyle += "height: " + height + "px; ";
  content.setAttribute("style", contentStyle);
}
