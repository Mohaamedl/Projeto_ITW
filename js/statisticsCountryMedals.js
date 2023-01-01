function VM() {
    var self = this;
    self.Medals = ko.observableArray([])
    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    showLoading();
    $.ajax({
        url: "http://192.168.160.58/Olympics/api/Statistics/Medals_Country",
        type: "GET",
        dataType: "JSON",
        data: JSON.stringify({}),
        success: function (data) {
            console.log(data)
            self.Medals(data)
        },
        complete: function () {
            console.log("complete")
        }

    })
}
$(document).ready(function () {
ko.applyBindings(new VM());
const urlGames = "http://192.168.160.58/Olympics/api/country/SearchByName?q="

            $("#SearchBar").autocomplete({
                minLength: 2,
                source: function (request, response) {
                    $.ajax({
                        type: "GET",
                        url: urlGames+$('#SearchBar').val().toLowerCase(),
                        data: {
                            q: $('#SearchBar').val().toLowerCase()
                        },
                        success: function (data) {
                            if (!data.length) {
                                var result = [{
                                    label: 'No results',
                                    value: response.term,
                                    source: ""
                                }];
                                response(result);
                            } else {

                                var newData = $.map(data, function (value, key) {
                                    return {
                                        label: value.Name,
                                        value: value.Id,
                                    }
                                });
                                results = $.ui.autocomplete.filter(newData, request.term).slice(0,10);
                                response(results);
                            }
                        },
                        error: function () {
                            alert("error!");
                        }
                    })
                },
                select: function (event, ui) {
                    event.preventDefault();
                    $("#SearchBar").val(ui.item.label);

                    window.location.href = "./countryDetails.html?id=" + ui.item.value;
                        
                    
                    // h.loadTitleModal(ui.item.value)
                },
                focus: function (event, ui) {
                    $("#searchbar").val(ui.item.label);
                }
            });
})
$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');})