# HackersMap

<< for developers >>

database名 : incident_database

table名 : incidents_info
    postid : int
    userid : int
    date : datetime
    title : text
    lat : double
    lng : double
    details text
    danger : int
    ip_address : text //deprecated 
    
table名 : incidents_polyline
    postid : int
    userid : int
    date : datetime
    title : text
    lat1 : double
    lng1 : double
    lat2 : double
    lng2 : double
    details text
    danger : int
    ip_address : text //deprecated 

table名 : users_info
    userid : int
    username : text
    in_address : text
