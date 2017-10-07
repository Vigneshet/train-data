var express = require('express');
var app = express();
var http = require('http');
var port = process.env.PORT || 8080;
var bodyParser = require('body-parser');

app.use(bodyParser());
//app.use(express.bodyParser());
app.get('/',function(req,res){
	//res.send('<h1>Hello World</h1>');	
	res.sendFile(__dirname+'/index.html');
});
 
 app.post('/pnrstatus',function(req,res){
	// console.log('body: ' + JSON.stringify(req.body));
	 console.log('inside this');
	 var obj = req.body;
	 console.log('pnr ::: ' + obj.pnr);
	 
	 
	 var options = {
  host: 'api.railwayapi.com',
  path: '/v2/pnr-status/pnr/'+obj.pnr+'/apikey/6aggfc95k2/',
  method: 'GET'

};
var responseData ='';
/* var responseData ='{"boarding_point":{"name":"CHENNAI CENTRAL","code":"MAS"},"doj":"29- 12-2017","reservation_upto":{"name":"SALEM JN","code":"SA"},"train_name":"NILAGIRI EXP","pnr":"4235633347","from_station":{"name":"CHENNAI CENTRAL","code":"MAS"},"train_num":"12671","to_station":{"name":"SALEM JN","code":"SA"},"journey_class":{"name":"SLEEPER CLASS","code":"SL"},"train_start_ date":null,"chart_prepared":false,"class":"SL","passengers":[{"coach_posi tion":0,"current_status":"CNF/-/0/GN","no":1,"booking_status":"CNF/S10/21 /GN"},{"coach_position":0,"current_status":"CNF/-/0/GN","no":2,"booking_s tatus":"CNF/S10/24/GN"},{"coach_position":0,"current_status":"CNF/-/0/GN","no":3,"booking_status":"CNF/S10/18/GN"},{"coach_position":0,"current_stat us":"CNF/-/0/GN","no":4,"booking_status":"CNF/S10/23/GN"}],"total_passenge rs":4,"response_code":200,"train":{"number":"12671","name":"NILAGIRI EXP "},"debit":3}'; */
var jsonReturn='{';
	 http.request(options, function(resp) {
  console.log('STATUS: ' + resp.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  resp.setEncoding('utf8');
  resp.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
	responseData = chunk;
	var jsonObj = JSON.parse(responseData);
console.log('check');
jsonReturn +='"from":"';
jsonReturn += jsonObj.from_station.name;
jsonReturn +='",';
jsonReturn +='"to":"';
jsonReturn += jsonObj.to_station.name;
jsonReturn +='",';
jsonReturn +='"date of boarding":"';
jsonReturn +=jsonObj.doj;
jsonReturn +='",';
jsonReturn +='"train":"';
jsonReturn +=jsonObj.train_name;
jsonReturn +='",';
jsonReturn +='"no":"';
jsonReturn +=jsonObj.train_num;
jsonReturn +='",';
jsonReturn +='"chart prepared":"';
jsonReturn +=jsonObj.chart_prepared;
jsonReturn +='",';
jsonReturn +='"booking_status":"';
var booking_status='';
var current_status='';
if(jsonObj.passengers.length>0){
	for(var i=0;i<jsonObj.passengers.length;i++){
		
		var keys = Object.keys(jsonObj.passengers[i]);
		if(keys.length>0){
			for(var j=0;j<keys.length;j++){
				if(keys[j].toLowerCase().indexOf("booking")>-1)
					booking_status+=jsonObj.passengers[i][keys[j]];
				if(keys[j].toLowerCase().indexOf("current")>-1)
					current_status+=jsonObj.passengers[i][keys[j]];
			}
		}
		
		booking_status+='~';
		current_status+='~';
	}
}

booking_status = booking_status.substring(0,booking_status.length-1);
current_status = current_status.substring(0,current_status.length-1);
jsonReturn +=booking_status;
jsonReturn +='",';
jsonReturn +='"current_status":"';
jsonReturn +=current_status;
jsonReturn +='"';
jsonReturn +='}';
console.log('jsonReturn:::: ' + jsonReturn);
  res.send(jsonReturn);
  });
  
}).end();
	 
 });
 
 
 
app.listen(port,function(){
	console.log('server up :: ' + port);
});
