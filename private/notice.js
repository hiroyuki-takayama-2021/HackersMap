const os = require('os');

exports.getip = function getLocalAddress() {
    var ifacesObj = {};
    ifacesObj.ipv4 = [];
    ifacesObj.ipv6 = [];
    var interfaces = os.networkInterfaces();

    for (var dev in interfaces) {
        interfaces[dev].forEach(function(details){
            if (!details.internal){
                switch(details.family){
                    case "IPv4":
                        ifacesObj.ipv4.push({name:dev, address:details.address});
                    break;
                    case "IPv6":
                        ifacesObj.ipv6.push({name:dev, address:details.address})
                    break;
                }
            }
        });
    }
    return ifacesObj.ipv4;
};

exports.getipClient = function getClientAddress(request) {
  if (request.headers['x-forwarded-for']) {
    return request.headers['x-forwarded-for'];
  }
  if (request.connection && request.connection.remoteAddress) {
    return request.connection.remoteAddress;
  }
  if (request.connection.socket && request.connection.socket.remoteAddress) {
    return request.connection.socket.remoteAddress;
  }
  if (request.socket && request.socket.remoteAddress) {
    return request.socket.remoteAddress;
  }
  return '0.0.0.0';
};
