const request = require('request');
const urlModlue = require('url');
const querystring= require('querystring');

module.exports=(req,res)=>{

    var thiscity = urlModlue.parse(req.url,true).query.city;
    console.log(thiscity);
    var options = {
        method: 'GET',
        url: 'https://community-open-weather-map.p.rapidapi.com/weather',
        qs: {units: '"metric"'},
        headers: {
          'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com',
          'x-rapidapi-key': '8fc276d6b1msh014ed03df2a9b00p1ab62bjsnc642b2d125f7'
        }
      };
      
      options.qs.q=thiscity;
      console.log(options.qs.q);
      request(options, function (error, response, body) {
          if (error) throw new Error(error);
            
          res.writeHead(200, {'content-type': 'application/json'});
          res.end(JSON.stringify(body));
       

          console.log(body);
      });
      



};