var request = new XMLHttpRequest();
var data = '';
var gigDates = [];
var gigTimes = [];
var gigVenues = [];
var gigCity = [];
var gigUrl = [];

function findMonth(month){
  var theMonth = month.slice(5,7);
  //console.log(theMonth);
  if (theMonth === "01"){
    return "Jan";
  }
  else if(theMonth === "02"){
    return "Feb";
  }
  else if(theMonth === "03"){
    return "Mar";
  }
  else if(theMonth === "04"){
    return "Apr";
  }
  else if(theMonth === "05"){
    return "May";
  }
  else if(theMonth === "06"){
    return "Jun";
  }
  else if(theMonth === "07"){
    return "Jul";
  }
  else if(theMonth === "08"){
    return "Aug";
  }
  else if(theMonth === "09"){
    return "Sep";
  }
  else if(theMonth === "10"){
    return "Oct";
  }
  else if(theMonth === "11"){
    return "Nov";
  }
  else{
    return "Dec";
  }
}

function findDate(date){
  var theDate = date.slice(8,10);
  //console.log(theDate);
  return theDate;
}

function processDates(){
  for (var i=0; i<gigDates.length; i++){
    if (gigDates[i] != null){
      var month = findMonth(gigDates[i]);
      //console.log(month);
      var date = findDate(gigDates[i]);
      gigDates[i] = date+" "+month;
      //console.log(gigDates[i]);
    }
  }
}

function processTimes(){
  for (var i=0; i<gigDates.length; i++){
    if (gigTimes[i] != null){
      gigTimes[i] = gigTimes[i].slice(0,5);
    }
  }
}

function getGigData(eventArray){
  for (var i=0; i<eventArray.length; i++){
    gigDates[i] = eventArray[i].start.date;
    //console.log(gigDates[i]);
    gigTimes[i] = eventArray[i].start.time;
    //console.log(gigTimes[i]);
    if (eventArray[i].venue.displayName === "Unknown venue"){
      gigVenues[i] = eventArray[i].series.displayName;
      //console.log(eventArray[i].series.displayName);
    }
    else{
      gigVenues[i] = eventArray[i].venue.displayName;
    }
    //console.log(gigVenues[i]);
    gigCity[i] = eventArray[i].location.city;
    //console.log(gigCity[i]);
    gigUrl[i] = eventArray[i].uri;
    //console.log(gigUrl[i]);
  }
  processDates();
  processTimes();
}

function getData(){
  request.open('GET','https://api.songkick.com/api/3.0/artists/4618368/calendar.json?apikey=8r24OmrAooGLpUbX',true);
  request.send();
}

function createAnchorNode(anchor,link){
  var anchor = document.createElement('a');
  anchor.setAttribute("href",link);
  var tNode = document.createTextNode("Find on songkick");
  anchor.appendChild(tNode);
  return anchor;
}

function createParaNode(para,text){
  var para = document.createElement('p');
  var tNode = document.createTextNode(text)
  para.appendChild(tNode);
  return para;
}

function addDetails(detailsDiv, eventName, location, skEventLink){
  var eventPara = createParaNode(eventPara,eventName);
  eventPara.setAttribute("class","eventPara");
  var locationPara = createParaNode(locationPara, location);
  locationPara.setAttribute("class","locationPara");
  var skEventAnchor = createAnchorNode(skEventAnchor, skEventLink);
  skEventAnchor.setAttribute("class","skEventAnchor");
  detailsDiv.appendChild(eventPara);
  detailsDiv.appendChild(locationPara);
  detailsDiv.appendChild(skEventAnchor);
  return detailsDiv;
}

function addDate(dateDiv,date,time){
  var datePara = createParaNode(datePara,date);
  datePara.setAttribute("class","dataPara");
  dateDiv.appendChild(datePara);
  if (time != null){
    var timePara = createParaNode(timePara,time);
    timePara.setAttribute("class","timePara");
    dateDiv.appendChild(timePara);
  }
  return dateDiv;
}

function createGig(theSection,i){
  console.log(data.resultsPage);
  var gigDiv = document.createElement('div');
  var dateDiv = document.createElement('div');
  var detailsDiv = document.createElement('div');
  dateDiv.setAttribute("class","date col-lg-2 col-md-2 col-sm-2 col-xs-2");
  dateDiv = addDate(dateDiv,gigDates[i],gigTimes[i]);
  detailsDiv.setAttribute("class","details col-lg-10 col-md-10 col-sm-10 col-xs-10");
  detailsDiv = addDetails(detailsDiv,gigVenues[i],gigCity[i],gigUrl[i]);
  theSection.appendChild(dateDiv);
  theSection.appendChild(detailsDiv);
  return theSection;
}

request.onload = function(){
  data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    console.log(data.resultsPage.results.event[0].displayName);
    var eventArray = data.resultsPage.results.event;
    getGigData(eventArray);
    for (var i=0; i<gigDates.length; i++){
      var theSection = document.createElement('section');
      theSection.setAttribute("class","row table col-lg-12 col-md-12 col-sm-12 col-xs-12 col-centered");
      document.getElementById('skAPI').appendChild(theSection);
      theSection = createGig(theSection,i);
    }
  }
  else {
    console.log('error')
  }
}

window.onload=function(){
  getData();
}
