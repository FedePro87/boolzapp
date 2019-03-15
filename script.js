function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min +1)) + min;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerizeFirstLetter(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function getCommonAnswers() {
  var commonAnswers=["ciao","buon giorno", "buona notte","arrivederci"];
  return commonAnswers;
}

function getMoreAnswers() {
  var moreAnswers=["grazie","chi sei?","come stai?","stronzo","vaffanculo","come ti chiami?", "chi ti ha creato?"];
  return moreAnswers;
}

function isStringPresent(string, array){
  for (var i = 0; i < array.length; i++) {
    if (array[i]==string) {
      return true;
    }
  }
  return false;
}

function getFunnyAnswer(myText){
  var response;
  switch (myText) {
    case "grazie":
    response="prego";
    break;
    case "come stai?":
    response="bene";
    break;
    case "stronzo":
    response="ci sarai tu!";
    break;
    case "vaffanculo":
    response="ma vacci tu!";
    break;
    case "come ti chiami?":
    response="sto cazzo";
    break;
    case "chi ti ha creato?":
    response="dio, ovvero Federico Provenziani";
    break;
    case "chi sei?":
    response="goku non lo sai";
    break;
  }
  return response;
}

function getResponse(myText){
  var response;
  if (isStringPresent(myText,getCommonAnswers())) {
    response=capitalizeFirstLetter(myText);
  } else if (isStringPresent(myText,getMoreAnswers())) {
    response=getFunnyAnswer(myText);
  } else {
    response="Non capisco";
  }
  return response;
}

function getMyProfileImg() {
  return "https://scontent-fco1-1.xx.fbcdn.net/v/t1.0-9/1236584_10201366261910944_1300062444_n.jpg?_nc_cat=108&_nc_ht=scontent-fco1-1.xx&oh=a5189930c05d1205b6a727b091d68375&oe=5D17C039";
}

function sendMessage(sent,contacts,text){
  var inputText=$("#input-message");
  var contactName=$("#contact-name");
  var showedChat=$(".showed");
  var contactContainer=$(".messages-wrapper > .showed");
  var currentdate = new Date();
  var mins = ("0"+currentdate.getMinutes()).slice(-2);
  var currentTime=currentdate.getHours()+ ":" + mins;
  var data;

  if (sent) {
    updateContactList(text,currentTime);
    data={
      messageType:"sent",
      profileImgUrl:getMyProfileImg(),
      messageText:text,
      time:currentTime
    }
  } else {
    data={
      messageType:"received",
      profileImgUrl:contacts[showedChat.index()].img,
      messageText:capitalizeFirstLetter(getResponse(text.toLowerCase())),
      time:currentTime
    }
  }

  inputText.val("");

  var messageTemplate=$("#message-template").html();
  var compiled=Handlebars.compile(messageTemplate);
  var message=compiled(data);
  contactContainer.append(message);
}

function updateContactList(myText,currentTime){
  var contactBox=$(".contact-box");

  for (var i = 0; i < contactBox.length; i++) {
    if (contactBox.eq(i).hasClass("selected")) {
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
    var myUser=$(myContent.find("h4"));
    var myUserName=myUser.text();
    if (mySearch.length==0) {
      contactBox.eq(i).show();
    } else {
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
}

function removeHighlight(){
  var rightHeader=$(".right > .header");
  var longPressOptions=$("#long-press-options");
  var chats=$(".long-click-wrapper");
  var bin=$("#bin");

  rightHeader.removeClass("hidden");
  longPressOptions.addClass("hidden");
  bin.off("click");

  for (var i = 0; i < chats.length; i++) {
    if (chats.eq(i).hasClass("highlight-chat")) {
      chats.eq(i).removeClass("highlight-chat");
    }
  }
}

function selectContactChat(contacts){
  var contactBox=$(".contact-box");
  var contactName=$("#contact-name");
  var contactImage=$("#contact-img");
  var lastOnline=$("#last-online");
  var messagesWrapper=$(".messages-wrapper > .chat");
  var contactsWrapper=$(".contacts-wrapper > .contact-box")
  var inputText=$("#input-message");

  contactBox.click(function(){
    removeHighlight();
    inputText.focus();
    contactsWrapper.removeClass("selected");
    messagesWrapper.removeClass("showed");
    var me=$(this);
    me.addClass("selected");
    var myIndex=me.index();
    lastOnline.text("Ultimo accesso oggi alle " + contacts[myIndex].lastOnline);
    contactImage.attr("src",contacts[myIndex].img);
    contactName.text(contacts[myIndex].name);
    messagesWrapper.eq(me.index()).addClass("showed");
  });
}

function selectChatsToDelete(){
  var chats=".showed > .long-click-wrapper";
  var rightHeader=$(".right > .header");
  var longPressOptions=$("#long-press-options");
  var selectedChats=$("#selected-chats");
  var longpress = 400;
  var start;
  var indexesToDelete=[];
  var selectionActive=false;

  $(document).on( "mousedown", chats, function( e ) {
    start = new Date().getTime();
  } );

  $(document).on( "mouseleave", chats, function( e ) {
    start = 0;
  } );

  $(document).on( "mouseup", chats, function(e) {
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
  var chats=$(".showed > .long-click-wrapper");
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

function init(contacts){
  var userToSearch=$("#search-user");
  var inputText=$("#input-message");

  selectContactChat(contacts);
  selectChatsToDelete();
  userToSearch.on("input",function(){
    searchUser(userToSearch.val().toLowerCase());
  });

  inputText.keyup(function(e){
    if(e.keyCode == 13)
    {
      var myText=inputText.val();
      sendMessage(true,contacts,myText);
      setTimeout(sendMessage,1000,false,contacts,myText);
    }
    removeHighlight();
  });
}

function getContacts(){
  var contacts=[
    {"img":"https://media.tio.ch/files/domains/tio.ch/images/4bmv/s_-bill-gates-sempre-piu-ricco-trump-un-po-di-meno-7h0a.jpg?v=1","name":"Bill","lastOnline":getRandomTime() },
    {"img":"http://talkwithcelebs.com/wp-content/uploads/2017/03/Lauren-Cohan.jpg","name":"Lauren","lastOnline":getRandomTime() },
    {"img":"http://www.metal.it/image.ashx?id=43120&size=400&folder=note&suffix=photo&filters=square","name":"Bruce","lastOnline":getRandomTime() },
    {"img":"https://i1.wp.com/photogallery.indiatimes.com/celebs/celeb-themes/peoples-most-beautiful-women/Most-Beautiful-Women/photo/19723645/Les-Miserables-star-Amanda-Seyfried-has-bagged-the-third-place-in-the-list-of-most-beautiful-women-in-the-world.jpg","name":"Amanda","lastOnline":getRandomTime() },
    {"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS875ig8P-f9nCfdsC6LzksHkDTgfTiyPtmTa3szIc5Q_VF8lESSQ","name":"Evangeline","lastOnline":getRandomTime() },
    {"img":"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Mark_Zuckerberg_F8_2018_Keynote_%28cropped%29.jpg/220px-Mark_Zuckerberg_F8_2018_Keynote_%28cropped%29.jpg","name":"Mark","lastOnline":getRandomTime() },
    {"img":"https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fcdn-img.instyle.com%2Fsites%2Fdefault%2Ffiles%2Fstyles%2F684xflex%2Fpublic%2Fimages%2F2010%2Fgoldenglobes%2F011710-olivia-wilde-400_4.jpg%3Fitok%3D5k5A3b7h&w=200&c=sc&poi=face&q=85","name":"Olivia","lastOnline":getRandomTime()},
    {"img":"https://pbs.twimg.com/profile_images/1166664337/john-locke_400x400.jpg","name":"John","lastOnline":getRandomTime()},
  ]
  return contacts;
}

function getRandomTime(){
  var minutesFirst=getRandom(0,5);
  var minutesSecond=getRandom(0,9);
  var hour=getRandom(0,23);
  var rndTime=hour+":"+minutesFirst+minutesSecond;
  return rndTime;
}

function updateChatsContainer(contacts) {
  var messagesWrapper=$(".messages-wrapper");

  for (var i = 0; i < contacts.length; i++) {
    var newChatDiv=document.createElement("div");
    $(newChatDiv).addClass("chat");

    if (i==0) {
      $(newChatDiv).addClass("showed");
    }

    $(messagesWrapper).append(newChatDiv);
  }

  $(document).ready(function(){
    init(contacts);
  });
}

function updateRightHeader(name,img,time){
  var lastOnline=$("#last-online");
  var selectedContactImg=$("#contact-img");
  var contactName=$("#contact-name");

  lastOnline.text("Ultimo accesso oggi alle " + time);
  selectedContactImg.attr("src",img);
  contactName.text(name);
}

function updateContactsWrapper(){
  var contacts=getContacts();
  var contactsWrapper=$(".contacts-wrapper");

  for (var i = 0; i < contacts.length; i++) {

    var data={
      contactImg:contacts[i].img,
      contactName:contacts[i].name
    }

    var contactsTemplate=$("#contacts-template").html();
    var compiled=Handlebars.compile(contactsTemplate);
    var newContactBox=compiled(data);

    contactsWrapper.append(newContactBox);
    if (i==0) {
      updateRightHeader(contacts[i].name,contacts[i].img,contacts[i].lastOnline);
    }
  }

  $(".contact-box").eq(0).addClass("selected");
  updateChatsContainer(contacts);
}

$(window).on('load', updateContactsWrapper);
