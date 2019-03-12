function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerizeFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function sendMessage(){
  var inputText=$("#input-message");
  var messagesWrapper=$(".messages-wrapper");
  var contactName=$("#contact-name");

  inputText.keyup(function(e){
    if(e.keyCode == 13)
    {
      var currentdate = new Date();
      var currentContact=contactName.text();
      currentContact=lowerizeFirstLetter(currentContact);

      setTimeout(receiveMessage,1000);
      var newText=document.createElement("p");
      $(newText).text(inputText.val());
      inputText.val("");
      var newTime=document.createElement("span");
      $(newTime).addClass("messages-time")
      .text(currentdate.getHours()+ ":" + currentdate.getMinutes());
      var newMessage=document.createElement("div");
      $(newMessage).addClass("message")
      .addClass("sent")
      .addClass(currentContact)
      .append(newText)
      .append(newTime);
      var newLongClickWrapper=document.createElement("div");
      $(newLongClickWrapper).addClass("long-click-wrapper")
      .append(newMessage);
      messagesWrapper.append(newLongClickWrapper);
    }
    selectChatsToDelete();
  });
}

function receiveMessage(){
  var currentdate = new Date();
  var messagesWrapper=$(".messages-wrapper");
  var contactName=$("#contact-name");

  var currentContact=contactName.text();
  currentContact=lowerizeFirstLetter(currentContact);

  var newText=document.createElement("p");
  $(newText).text("Ok");
  var newTime=document.createElement("span");
  $(newTime).addClass("messages-time")
  .text(currentdate.getHours()+ ":" + currentdate.getMinutes());
  var newMessage=document.createElement("div");
  $(newMessage).addClass("message")
  .addClass("received")
  .addClass(currentContact)
  .append(newText)
  .append(newTime);
  var newLongClickWrapper=document.createElement("div");
  $(newLongClickWrapper).addClass("long-click-wrapper")
  .append(newMessage);
  messagesWrapper.append(newLongClickWrapper);

  selectChatsToDelete();
}

function searchUser(mySearch){
  var messageContent=$(".message-content");
  var messageBox=$(".message-box");

  for (var i = 0; i < messageContent.length; i++) {
    var myContent=$(messageContent.eq(i));
    var myUser=$(myContent.children("h4"));
    var myUserName=myUser.text();
    if (mySearch.length==0) {
      messageBox.eq(i).show();
    }
    for (var z = 0; z < mySearch.length; z++) {
      var myChar=mySearch[z];
      if (z==0) {
        myChar=capitalizeFirstLetter(mySearch[z]);
      }
      if (myChar==myUserName[z]) {
        messageBox.eq(i).show();
      } else {
        messageBox.eq(i).hide();
        break;
      }
    }
  }
}

function removeHighlight(){
  var rightHeader=$(".right > .header");
  var longPressOptions=$("#long-press-options");
  var chats=$(".long-click-wrapper");

  rightHeader.removeClass("hidden");
  longPressOptions.addClass("hidden");

  for (var i = 0; i < chats.length; i++) {
    if (chats.eq(i).hasClass("highlight-chat")) {
      chats.eq(i).removeClass("highlight-chat");
    }
  }
}

function selectContactChat(){
  var messageBox=$(".message-box");
  var contactName=$("#contact-name");
  var contactImage=$("#contact-img");
  var chats=$(".long-click-wrapper");
  var bin=$("#bin");

  messageBox.click(function(){
    removeHighlight();
    bin.off("click");
    var activeChat=$(".selected");
    activeChat.removeClass("selected");
    var currentContact=lowerizeFirstLetter(contactName.text());
    currentContact="." + currentContact;
    var currentClass=$(currentContact);
    var me=$(this);
    me.addClass("selected");
    var meContent=me.children(".message-content");
    var meContentName=meContent.children("h4").text();
    var meContentImage=me.children("img");
    var meContentImageUrl=meContentImage.attr("src");
    contactImage.attr("src",meContentImageUrl);
    contactName.text(meContentName);
    meContentName=lowerizeFirstLetter(meContentName);
    currentClass.addClass("hidden");
    var classToShow="." + meContentName;
    $(classToShow).removeClass("hidden");
  });
}

function selectChatsToDelete(){
  var chats=$(".long-click-wrapper");
  var rightHeader=$(".right > .header");
  var longPressOptions=$("#long-press-options");
  var selectedChats=$("#selected-chats");
  var longpress = 400;
  var start;
  var indexesToDelete=[];
  var selectionActive=false;

  chats.off("mousedown")
       .off("mouseleave")
       .off("mouseup");
  removeHighlight();

  chats.on( "mousedown", function( e ) {
    start = new Date().getTime();
  } );

  chats.on( "mouseleave", function( e ) {
    start = 0;
  } );

  chats.on( "mouseup", function(e) {
    var me;
    //Questo succede al long click
    if ( new Date().getTime() >= ( start + longpress )  ) {
      me=$(this);
      indexesToDelete=[];
      indexesToDelete.push(me.index());
      selectedChats.text(indexesToDelete.length + " elemento selezionato");
      selectionActive=true;
      rightHeader.addClass("hidden");
      longPressOptions.removeClass("hidden");
      me.addClass("highlight-chat");
    } else {
      //Questo succede al click
      me=$(this);
      //Se è selezionato fa questo
      if (me.hasClass("highlight-chat")) {
        me.removeClass("highlight-chat");
        var myIndex=indexesToDelete.indexOf(me.index());
        if (myIndex > -1) {
          indexesToDelete.splice(myIndex, 1);
        }
        if (indexesToDelete.length==1) {
          selectedChats.text(indexesToDelete.length + " elemento selezionato");
        } else {
          selectedChats.text(indexesToDelete.length + " elementi selezionati");
        }
        if (indexesToDelete.length==0) {
          rightHeader.removeClass("hidden");
          longPressOptions.addClass("hidden");
          selectionActive=false;
        }
      } else {
        //Se non è selezionato fa questo
        if (selectionActive) {
          indexesToDelete.push(me.index());
          if (indexesToDelete.length==1) {
            selectedChats.text(indexesToDelete.length + " elemento selezionato");
          } else {
            selectedChats.text(indexesToDelete.length + " elementi selezionati");
          }
          me.addClass("highlight-chat");
        }
      }
    }
    deleteChats(indexesToDelete)
  });
}

function deleteChats(indexesToDelete){
  var bin=$("#bin");
  var chats=$(".long-click-wrapper");
  var rightHeader=$(".right > .header");
  var longPressOptions=$("#long-press-options");

  bin.click(function(){
    rightHeader.removeClass("hidden");
    longPressOptions.addClass("hidden");
    for (var i = 0; i < chats.length; i++) {
      for (var z = 0; z < indexesToDelete.length; z++) {
        if (indexesToDelete[z]==i) {
          chats.eq(i).html("");
        }
      }
    }
  });
}

function init(){
  sendMessage();
  selectContactChat();
  selectChatsToDelete();
  var userToSearch=$("#search-user");
  userToSearch.on("input",function(){
    searchUser(userToSearch.val());
  });
}

$(document).ready(init);
