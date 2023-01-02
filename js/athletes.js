// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---VariÃ¡veis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/athletes');
    //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
    self.displayName = 'Athletes List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.favourites = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
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
    self.activate = function (id, sortby = 'NameUp') {
        console.log('CALL: getAthletes...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize() + "&sortby=" + sortby;
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
        console.log('CALL: searchAthletes...');
        var composedUri = "http://192.168.160.58/Olympics/api/Athletes/SearchByName?q=" + search;
        ajaxHelper(composedUri, 'GET').done(function(data) {
            console.log("search Athletes", data);
            hideLoading();
            self.records(data.slice(0 + 24 * (page - 1), 24 * page));
            console.log(self.records())
            self.totalRecords(data.length);
            self.currentPage(page);
            if (page == 1) {
                self.hasPrevious(false)
            } else {
                self.hasPrevious(true)
            }
            if (self.records() - 24 > 0) {
                self.hasNext(true)
            } else {
                self.hasNext(false)
            }
            if (Math.floor(self.totalRecords() / 24) == 0) {
                self.totalPages(1);
            } else {
                self.totalPages(Math.ceil(self.totalRecords() / 24));
            }  
        });

    };
    

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

    self.pesquisa = function() {
        self.pesquisado($("#SearchBar").val().toLowerCase());
        if (self.pesquisado().length > 0) {
            window.location.href = "athletes.html?search=" + self.pesquisado()+'&page=' + '1';
        }
    }

    //--- start ....
    showLoading();
    $("#SearchBar").val(undefined);
    self.pesquisado = ko.observable(getUrlParameter('search'));
    var pg = getUrlParameter('page');
    console.log(pg);
    self.sortby = ko.observable(getUrlParameter('sortby'));
        if (self.pesquisado() == undefined) {
            if (pg == undefined) {
                if (self.sortby() != undefined) self.activate(1, self.sortby());
                else self.activate(1)
            }
            else {
                if (self.sortby() != undefined) self.activate(pg, self.sortby());
                else self.activate(pg)
            }
        } else {
            if (pg == undefined) self.activate2(self.pesquisado(), 1);
            else self.activate2(self.pesquisado(), pg)
            self.displayName = 'Founded results for <b>' + self.pesquisado() + '</b>';
        }

    showLoading();
    console.log("VM initialized!");
        ko.bindingHandlers.safeSrc = {
            update: function (element, valueAccessor) {
                var options = valueAccessor();
                var src = ko.unwrap(options.src);
                if (src == null) {
                    $(element).attr('src', ko.unwrap(options.fallback));
                }
                $('<img />').attr('src', src).on('load', function () {
                    $(element).attr('src', src);
                }).on('error', function () {
                    $(element).attr('src', ko.unwrap(options.fallback));
                });

            }
        };
    };

function conv(BestPosition){
    if (BestPosition == 1){
        return "Gold Medal";
    }
    if (BestPosition == 2){
        return "Silver Medal";
    }
    if (BestPosition == 3){
        return "Bronze Medal";
    }
        return "No Medal";
}

function medal(BestPosition){
    if (BestPosition == 1)
        return "images/goldMedal.png";  
    else if (BestPosition == 2)
        return "images/silverMedal.png";
    else if (BestPosition == 3)
        return "images/bronzeMedal.png";
    else return "images/noMedal.png"
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
    const urlGames = "http://192.168.160.58/Olympics/api/athletes/SearchByName?q="

            $("#SearchBar").autocomplete({
                minLength: 4,
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

                    window.location.href = "./athletesDetails.html?id=" + ui.item.value;
                        
                    
                    // h.loadTitleModal(ui.item.value)
                },
                focus: function (event, ui) {
                    $("#searchbar").val(ui.item.label);
                }
            });
});
$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
    $(".material-card > .mc-btn-action").click(function () {
        var self = this;
        var card = $(self).parent(".material-card");
        var icon = $(self).children("i");
        icon.addClass("fa-spin-fast");
    
        if (card.hasClass("mc-active")) {
            console.log("here")
          card.removeClass("mc-active");
    
          window.setTimeout(function () {
            icon
              .removeClass("fa-arrow-left")
              .removeClass("fa-spin-fast")
              .addClass("fa-bars");
          }, 800);
        } else {
          card.addClass("mc-active");
    
          window.setTimeout(function () {
            icon
              .removeClass("fa-bars")
              .removeClass("fa-spin-fast")
              .addClass("fa-arrow-left");
          }, 800);
        }
      });
    });