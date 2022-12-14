// ViewModel KnockOut 

var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/countries/');
    self.displayName = 'Olympic Games edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Flag = ko.observable('');
    self.Events = ko.observableArray('');
    self.Name = ko.observable('');
    self.Participant= ko.observableArray('');
    self.Organizer = ko.observableArray('');
    self.IOC= ko.observable('');
    self.Url = ko.observable('');
    self.Medals=ko.observableArray('');
    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getGame...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Events(data.Events);
            self.Flag(data.Flag);
            self.Name(data.Name);
            self.Participant(data.Participant);
            self.Organizer(data.Organizer);
            self.IOC(data.IOC);
            //self.Medals(data.Medals)

            
        }
       
        )
         
        
    };
    console.log('deded',name)
    

    //--- Internal functions
    
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }
   
    

    function showLoading() {
        $('#myModal').modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    var s =JSON.stringify(self.Name);
    console.log("VM initialized!");
    ko.bindingHandlers.safeSrc = {
        update: function(element, valueAccessor) {
          var options = valueAccessor();
          var src = ko.unwrap(options.src);
          $('<img />').attr('src', src).on('load', function() {
            $(element).attr('src', src);
          }).on('error', function() {
            $(element).attr('src', "images/OlympicLogos/"+name+".jpg");
          });
        }
    }
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
    
    
});
$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
    
})