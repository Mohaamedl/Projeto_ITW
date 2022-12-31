var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Modalities/');
    //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
    self.displayName = 'Olympic Modalities List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.country=ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.favourites=ko.observableArray([])
    self.pagesize = ko.observable(21);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };
    self.toggleFavourite = function (id) {
        if (self. favourites.indexOf(id) == -1){
            self.favourites.push(id);
        }
        else {
            self.favourites.remove(id);
        }
        localStorage.setItem("fav",JSON.stringify(self.favourites()));
    };
    self.SetFavourites = function () {
        let storage;
        try{
            storage = JSON.parse(localStorage.getItem("fav"));
        } 
        catch (e) {
            ;
        }
        if (Array.isArray(storage)){
        self.favourites(storage);
        }
    }

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getGames...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            self.SetFavourites();
        });
    };
    self.activate2 = function(search, page) {
        console.log('CALL: searchGames...');
        var composedUri = "http://192.168.160.58/Olympics/api/Modalities/SearchByName?q=" + search;
        ajaxHelper(composedUri, 'GET').done(function(data) {
            console.log("search Games", data);
            hideLoading();
            self.records(data.slice(0 + 21 * (page - 1), 21 * page));
            console.log(self.records())
            self.totalRecords(data.length);
            self.currentPage(page);
            if (page == 1) {
                self.hasPrevious(false)
            } else {
                self.hasPrevious(true)
            }
            if (self.records() - 21 > 0) {
                self.hasNext(true)
            } else {
                self.hasNext(false)
            }
            if (Math.floor(self.totalRecords() / 21) == 0) {
                self.totalPages(1);
            } else {
                self.totalPages(Math.ceil(self.totalRecords() / 21));
            }  
        });

    };


    //--- Internal functions
    self.pesquisa = function() {
        self.pesquisado($("#SearchBar").val().toLowerCase());
        if (self.pesquisado().length > 0) {
            window.location.href = "modalities.html?search=" + self.pesquisado();
        }
    }
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

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

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

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    $("#SearchBar").val(undefined);
    self.pesquisado = ko.observable(getUrlParameter('search'));

    var pg = getUrlParameter('page');
    console.log(pg);
    if (undefined == undefined) {
        if (self.pesquisado() == undefined) {
            if (pg == undefined) {
                if ('j'!=undefined) self.activate(1);
                else self.activate(1)
            }
            else {
                if ('j'!=undefined) self.activate(pg);
                else self.activate(pg)
            }
        } else {
            if (pg == undefined) self.activate2(self.pesquisado(), 1);
            else self.activate2(self.pesquisado(), pg)
            self.displayName = 'Founded results for {' + self.pesquisado() + '}';
        }
    } else {
       
    }

    console.log("VM initialized!");
};;


$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})