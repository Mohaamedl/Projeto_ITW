//start code
var vm = function () {
    console.log('ViewModel initiated...');
    //---local variables
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/games');
    self.displayName = 'Olympic Games editions in cards';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(24);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.gamesName = ko.observableArray([]);
    self.favourites=ko.observableArray([])
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
        localStorage.setItem("fav2",JSON.stringify(self.favourites()));
    };
    self.SetFavourites = function () {
        let storage;
        try{
            storage = JSON.parse(localStorage.getItem("fav2"));
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
            self.SetFavourites()
        });
    };
    self.activate2 = function(search, page) {
        console.log('CALL: searchGames...');
        var composedUri = "http://192.168.160.58/Olympics/api/Games/SearchByName?q=" + search;
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
    self.activeautocom = function(id){
        console.log('Getting data to autocomplete...');
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
            window.location.href = "games.html?search=" + self.pesquisado();
        }
    }
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
            self.displayName = 'Founded results for <b>' + self.pesquisado() + '</b>';
        }
    } else {
       
    }

    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
    const urlGames = "http://192.168.160.58/Olympics/api/games/SearchByName?q="

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
                                results = $.ui.autocomplete.filter(newData, request.term);
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

                    window.location.href = "./gameDetails.html?id=" + ui.item.value;
                        
                    
                    // h.loadTitleModal(ui.item.value)
                },
                focus: function (event, ui) {
                    $("#searchbar").val(ui.item.label);
                }
            });
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
    var main = function () {

        $('.push-bar').on('click', function(event){
          if (!isClicked){
            event.preventDefault();
            $('.arrow').trigger('click');
            isClicked = true;
          }
        });
      
        $('.arrow').css({
          'animation': 'bounce 2s infinite'
        });
        $('.arrow').on("mouseenter", function(){
            $('.arrow').css({
                    'animation': '',
                    'transform': 'rotate(180deg)',
                    'background-color': 'black'
               });
        });
         $('.arrow').on("mouseleave", function(){
            if (!isClicked){
                $('.arrow').css({
                        'transform': 'rotate(0deg)',
                        'background-color': 'black'
                   });
            }
        });
    
        var isClicked = false;
    
        $('.arrow').on("click", function(){
            if (!isClicked){
                isClicked = true;
                $('.arrow').css({
                    'transform': 'rotate(180deg)',
                    'background-color': 'black',
               });
    
                $('.bar-cont').animate({
                    top: "-15px"
                }, 300);
                $('.main-cont').animate({
                    top: "0px"
                }, 300);
                // $('.news-block').css({'border': '0'});
                // $('.underlay').slideDown(1000);
    
            }
            else if (isClicked){
                isClicked = false;
                $('.arrow').css({
                    'transform': 'rotate(0deg)',       'background-color': 'black'
               });
    
                $('.bar-cont').animate({
                    top: "-215px"
                }, 300);
                $('.main-cont').animate({
                    top: "-215px"
                }, 300);
            }
        console.log('isClicked= '+isClicked);
        });
      
        $('.card').on('mouseenter', function() {
          $(this).find('.card-text').slideDown(300);
        });
      
        $('.card').on('mouseleave', function(event) {
           $(this).find('.card-text').css({
             'display': 'none'
           });
         });
    };
    
    
    $().ready(main);
    function searchToggle(obj, evt){
        var container = $(obj).closest('.search-wrapper');
        console.log("hey")
            if(!container.hasClass('active')){
                container.addClass('active');
                evt.preventDefault();
            }
            else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
                container.removeClass('active');
                // clear input
                container.find('.search-input').val('');
            }
    }
    
})
