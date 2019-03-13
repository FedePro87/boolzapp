function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerizeFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function sendMessage(sent){
  var inputText=$("#input-message");
  var contactName=$("#contact-name");

  var currentdate = new Date();
  var currentContact=contactName.text();
  currentContact=lowerizeFirstLetter(currentContact);
  var mins = ("0"+currentdate.getMinutes()).slice(-2);
  var currentTime=currentdate.getHours()+ ":" + mins;
  var newText=document.createElement("p");

  if (sent) {
    $(newText).text(inputText.val());
    updateContactList(currentContact,inputText.val(),currentTime);
  } else {
    $(newText).text("Ok");
  }

  inputText.val("");
  var newTime=document.createElement("span");
  $(newTime).addClass("messages-time")
            .text(currentTime);
  var newMessage=document.createElement("div");

  if (sent) {
    $(newMessage).addClass("sent");
  } else {
    $(newMessage).addClass("received");
  }

  $(newMessage).addClass("message")
               .append(newText)
               .append(newTime);
  var newLongClickWrapper=document.createElement("div");
  $(newLongClickWrapper).addClass("long-click-wrapper")
                        .append(newMessage);
  var contactContainer=$(".messages-wrapper > ." + currentContact);
  contactContainer.append(newLongClickWrapper);

  selectChatsToDelete();
}

function updateContactList(currentContact,myText,currentTime){
  var contactBox=$(".contact-box");

  for (var i = 0; i < contactBox.length; i++) {
    if (contactBox.eq(i).hasClass(currentContact)) {
      var myContent=contactBox.eq(i).children(".message-content");
      myContent.children(".last-message").text(myText);
      contactBox.eq(i).children(".time").text(currentTime);
    }
  }
}

function searchUser(mySearch){
  var messageContent=$(".message-content");
  var contactBox=$(".contact-box");

  for (var i = 0; i < messageContent.length; i++) {
    var myContent=$(messageContent.eq(i));
    var myUser=$(myContent.children("h4"));
    var myUserName=myUser.text();
    if (mySearch.length==0) {
      contactBox.eq(i).show();
    }
    for (var z = 0; z < mySearch.length; z++) {
      var myChar=mySearch[z];
      if (z==0) {
        myChar=capitalizeFirstLetter(mySearch[z]);
      }
      if (myChar==myUserName[z]) {
        contactBox.eq(i).show();
      } else {
        contactBox.eq(i).hide();
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
  var contactBox=$(".contact-box");
  var contactName=$("#contact-name");
  var contactImage=$("#contact-img");
  var lastOnline=$("#last-online");
  var bin=$("#bin");
  var messagesWrapper=$(".messages-wrapper > div");

  contactBox.click(function(){
    removeHighlight();
    bin.off("click");
    var activeChat=$(".selected");
    messagesWrapper.eq(activeChat.index()).addClass("hidden");
    activeChat.removeClass("selected");
    var me=$(this);
    me.addClass("selected");
    var meContent=me.children(".message-content");
    var meContentName=meContent.children("h4").text();
    lastOnline.text("Ultimo accesso oggi alle " + getLastOnline(meContentName));
    var meContentImage=me.children("img");
    var meContentImageUrl=meContentImage.attr("src");
    contactImage.attr("src",meContentImageUrl);
    contactName.text(meContentName);
    messagesWrapper.eq(me.index()).removeClass("hidden");
  });
}

function getLastOnline(meContentName){
  var lastOnline;
  switch (meContentName) {
    case "Kishi":
    lastOnline="15:40";
    break;
    case "Hikata":
    lastOnline="11:32";
    break;
    case "Matsumoto":
    lastOnline="16:18";
    break;
    case "Hinata":
    lastOnline="18:11";
    break;
    case "Reika":
    lastOnline="02:33";
    break;
    case "Ichigo":
    lastOnline="05:20";
    break;
  }
  return lastOnline;
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
  var userToSearch=$("#search-user");
  var inputText=$("#input-message");

  selectContactChat();
  selectChatsToDelete();

  userToSearch.on("input",function(){
    searchUser(userToSearch.val().toLowerCase());
  });

  inputText.keyup(function(e){
    if(e.keyCode == 13)
    {
      sendMessage(true);
      setTimeout(sendMessage,1000,false);
    }
  });
}

$(document).ready(init);
