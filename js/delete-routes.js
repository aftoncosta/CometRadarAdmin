$.ajax({
    url: 'http://127.0.0.1:3000/route-names',
    type: 'GET',
    dataType: 'json',
    timeout: 5000,
    success: function(data) {
        
        for(var i in data){
            document.getElementById("route-list").innerHTML = document.getElementById("route-list").innerHTML 
                                                            + '<a class="list-group-item" onclick="deleteRoute(' + "'" 
                                                            + data[i].route_name + "'" + ')"><span class="badge"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span>' 
                                                            + data[i].route_name + '</a>';
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        alert('error ' + textStatus + " " + errorThrown);
    }
});

function deleteRoute(name){
    console.log('delete ' + name);

    var json = { FFFFFOOOOOOOOOOOOOOOO : "BARRRRRRRRRRRRRRRRRRRR"};
    console.log(json);
    $.ajax({
        method: 'POST',
        url: 'http://127.0.0.1:3000/delete-route',
        jsonData: { FFFFFOOOOOOOOOOOOOOOO : "BARRRRRRRRRRRRRRRRRRRR"},
        headers: { "Content-Type": "application/json" }
    });
};