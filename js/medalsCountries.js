$(document).ready(function () {
    function VM() {
        var self = this;
        self.Medals = ko.observableArray([])

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
    ko.applyBindings(new VM());
})

