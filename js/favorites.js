//--- Internal functions
function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
            hideLoading();
        }
    });
}

function showLoading() {
    $("#myModal").modal('show', {
        keyboard: false
    });
}
function hideLoading() {
    $('#myModal').on('shown.bs.modal', function (e) {
        $("#myModal").modal('hide');
    });
}

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}


function removeFav(Id) {
    console.log("remove fav")
    $("#fav-" + Id).remove();

    let fav = JSON.parse(localStorage.fav || '[]');

    const index = fav.indexOf(Id);

    if (index != -1)
        fav.splice(index, 1);

    localStorage.setItem("fav", JSON.stringify(fav));
}

function removeFav2(Id) {
    console.log("remove fav2")
    $("#fav2-" + Id).remove();

    let fav2 = JSON.parse(localStorage.fav2 || '[]');

    const index = fav2.indexOf(Id);

    if (index != -1)
        fav2.splice(index, 1);

    localStorage.setItem("fav2", JSON.stringify(fav2));
}

function removeFav3(Id) {
    console.log("remove fav3")
    $("#fav3-" + Id).remove();

    let fav3 = JSON.parse(localStorage.fav3 || '[]');

    const index = fav3.indexOf(Id);

    if (index != -1)
        fav3.splice(index, 1);

    localStorage.setItem("fav3", JSON.stringify(fav3));
}

function removeFav4(Id) {
    console.log("remove fav4")
    $("#fav4-" + Id).remove();

    let fav4 = JSON.parse(localStorage.fav4 || '[]');

    const index = fav4.indexOf(Id);

    if (index != -1)
        fav4.splice(index, 1);

    localStorage.setItem("fav4", JSON.stringify(fav4));
}


$(document).ready(function () {
    showLoading();

    let fav = JSON.parse(localStorage.fav || '[]');

    console.log(fav);


    for (const i of fav) {
        console.log(i);

        ajaxHelper('http://192.168.160.58/Olympics/api/Athletes?id=' + i, 'GET').done(function (data) {
            console.log(data)
            if (localStorage.fav.length != 0) {
                $("#table-favourites").show();
                $('#noadd').hide();
                $('#nofav').hide();
                $("#table-favourites").append(
                    `<tr id="fav-${i}">
                        <td class="align-middle">${i}</td>
                        <td class="align-middle">${data.Name}</td>
                        <td class="align-middle">${data.Sex}</td>
                        <td class="text-end">
                            <a class="btn btn-default btn-outline-danger btn-sm btn-favourite" onclick="removeFav(${i})"><i class="fa fa-heart" title="Selecione para remover dos favoritos"></i></a>
                        </td>
                    </tr>`
                )

            }
        });
        sleep(50);
    }
    

    hideLoading();
})
let fav3 = JSON.parse(localStorage.fav3 || '[]');

console.log(fav3);


for (const i of fav3) {
    console.log(i);

    ajaxHelper('http://192.168.160.58/Olympics/api/Modalities?id=' + i, 'GET').done(function (data) {
        console.log(data)
        if (localStorage.fav3.length != 0) {
            $("#table-favourites3").show();
            $('#noadd').hide();
            $('#nofav').hide();
            $("#table-favourites3").append(
                `<tr id="fav3-${i}">
                        <td class="align-middle">${i}</td>
                        <td class="align-middle">${data.Name}</td>
                        <td class="text-end">
                            <a class="btn btn-default btn-outline-danger btn-sm btn-favourite" onclick="removeFav3(${i})"><i class="fa fa-heart" title="Selecione para remover dos favoritos"></i></a>
                        </td>
                    </tr>`
            )

        }
    });
    sleep(50);
}
let fav4 = JSON.parse(localStorage.fav4 || '[]');

console.log(fav4);


    for (const i of fav4) {
        console.log(i);
    
        ajaxHelper('http://192.168.160.58/Olympics/api/competitions?id=' + i, 'GET').done(function (data) {
            console.log(data)
            if (localStorage.fav4.length != 0) {
                $("#table-favourites4").show();
                $('#noadd').hide();
                $('#nofav').hide();
                $("#table-favourites4").append(
                    `<tr id="fav4-${i}">
                            <td class="align-middle">${i}</td>
                            <td class="align-middle">${data.Name}</td>
                            <td class="align-middle">${data.Modality}</td>
                            <td class="text-end">
                                <a class="btn btn-default btn-outline-danger btn-sm btn-favourite" onclick="removeFav4(${i})"><i class="fa fa-heart" title="Selecione para remover dos favoritos"></i></a>
                            </td>
                        </tr>`
                )
    
            }
        });
        sleep(50);
    }
    
let fav2 = JSON.parse(localStorage.fav2 || '[]');

console.log(fav2);


for (const i of fav2) {
    console.log(i);

    ajaxHelper('http://192.168.160.58/Olympics/api/games?id=' + i, 'GET').done(function (data) {
        console.log(data)
        if (localStorage.fav2.length != 0) {
            $("#table-favourites2").show();
            $('#noadd').hide();
            $('#nofav').hide();
            $("#table-favourites2").append(
                `<tr id="fav2-${i}">
                        <td class="align-middle">${i}</td>
                        <td class="align-middle">${data.Name}</td>
                        <td class="align-middle">${data.Year}</td>
                        <td class="align-middle">${data.City}</td>
                        <td class="align-middle">${data.CountryName}</td>
                        <td class="text-end">
                            <a class="btn btn-default btn-outline-danger btn-sm btn-favourite" onclick="removeFav2(${i})"><i class="fa fa-heart" title="Selecione para remover dos favoritos"></i></a>
                        </td>
                    </tr>`
            )

        }
    });
    sleep(50);
}