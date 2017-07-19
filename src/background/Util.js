const Util = {};

Util.getIcon = function(appInfo,callback){
  var iconUrl=undefined;
  if(appInfo.icons){
    var maxSize=0;
    for(var j=0;j<appInfo.icons.length;j++){
      var iconInfo=appInfo.icons[j];
      if(iconInfo.size>maxSize){
        maxSize=iconInfo.size;
        iconUrl=iconInfo.url;
      }
    }
  }
  if(!iconUrl){
    var canvas=document.createElement("canvas");
    canvas.width=128;
    canvas.height=128;
    var ctx=canvas.getContext('2d');
    ctx.font="120px Arial";
    ctx.fillStyle="grey";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="white";
    ctx.fillText(appInfo.name[0],22,110);
    var dataUrl=canvas.toDataURL();
    callback(dataUrl);
  }
  else{
    dataUrlFromUrl(iconUrl,callback);
  }
}

export { Util as default };
