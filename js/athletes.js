var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/athletes');
    //self.baseUri = ko.observable('http://localhost:62595/api/drivers');
    self.displayName = 'Olympic Games editions List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.athletes=ko.observableArray([]);
    self.currentPage = ko.observable(1);
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

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getAthletes...');
        var composedUri = self.baseUri()  + "?page=" + id + "&pagesize=" + self.pagesize();
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
            //self.SetFavourites();
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

    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
    ko.bindingHandlers.safeSrc = {
        update: function(element, valueAccessor) {
          var options = valueAccessor();
          var src = ko.unwrap(options.src);
          if (src==null){
            $(element).attr('src', ko.unwrap(options.fallback))
          }
          $('<img />').attr('src', src).on('load', function() {
            $(element).attr('src', src);
          }).on('error', function() {
            $(element).attr('src', ko.unwrap(options.fallback));
          });

        }
    }
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})

//search TITLES -> TURN THIS INTO KNOCKOUT AND READY TO GO

$("#1stform").on("submit", function (e) {
    var inputed = document.getElementById("forminput").value;
    console.log("Search here!")
    console.log(inputed); // good 

    var baseUri = 'http://192.168.160.58/Olympics/api/athletes/SearchByName';
    var composedUri = baseUri + "?q=" + q;
    console.log(composedUri); //nice

    $('#tab2 tr:not(:first)').remove();
    $("#1stform")[0].reset();

    function searchTitles(inputed) {
        console.log(inputed + " SUP"); // nice so far

        $.ajax({
            type: "GET",
            url: composedUri,

            data: {
                pagesize: 50,
            },

            success: function (data) {
                console.log("Data:" + JSON.stringify(data, null, 4)); // show all data retrieved
                console.log("Data Length: " + data.length);
                if (data.length == 0) {
                    $("#myModal2").modal("show");
                    $("#tab2").hide();
                    $("#tab1").show();
                    $("#pagination").show();
                } else {

                    $.each(data, function () {
                        var self = this;
                        $("#tab1").hide();
                        $("#tab2").show();
                        $("#pagination").hide();

                        var Id_GET = parseInt(this['Id']);
                        var baseUrl = './titleDetails.html?id=';
                        var urlDetails = baseUrl + Id_GET;

                        $("#tab2 > tbody")
                            .append($('<tr>')
                                .append($('<td>')
                                    .append($(`<span>${self['Id']}</span>`))
                                )
                                .append($('<td>')
                                    .append($(`<span>${self['Name']}</span>`))
                                )
                                .append($('<td class="text-right">')
                                    .append($(`<a href=${urlDetails}><i class="fa fa-eye" title="Selecione para ver detalhes"></i></a>
                                    <button class="btn btn-sm addfav">
                                        <i class="fa fa-heart-o" id="showme" style="font-size: 14px;"
                                            onclick="addfav(event)" data-bind="attr : { 'id': 'favourite_'+Id }"
                                            title="Selecione para adicionar aos favoritos"></i>
                                    </button>`)
                                    )
                                )
                            );
                    });
                }
            },
            error: function () {
                console.log("erroooor")
            }

        })
    };

    inputed.value = "";
    searchTitles(inputed);
    e.preventDefault();
})

$(function() {
    $('.material-card > .mc-btn-action').click(function () {
        var card = $(this).parent('.material-card');
        var icon = $(this).children('i');
        icon.addClass('fa-spin-fast');

        if (card.hasClass('mc-active')) {
            card.removeClass('mc-active');

            window.setTimeout(function() {
                icon
                    .removeClass('fa-arrow-left')
                    .removeClass('fa-spin-fast')
                    .addClass('fa-bars');

            }, 800);
        } else {
            card.addClass('mc-active');

            window.setTimeout(function() {
                icon
                    .removeClass('fa-bars')
                    .removeClass('fa-spin-fast')
                    .addClass('fa-arrow-left');

            }, 800);
        }
    });
});
(function ($) {
    var MaterialCard = function (element, options) {
        this.options        = options;
        this.card           = $(element);
        this.button         = $(element).children('.mc-btn-action');
        this.icon           = $(element).children('.mc-btn-action').children('i');
        this.card_activator = options.card_activator;
        this.timing         = this.getTransitionTiming();

        var that = this;

        if (that.card_activator == 'click') {
            if (!this.icon.hasClass(this.options.icon_open)) {
                this.icon.attr('class', this.icon.attr('class').replace(/\bfa-.*\b/g, '')).addClass(this.options.icon_open);
            }
            this.button.on('click', function () {
                that.toggle();
            });
        } else {
            this.button.hide();
        }

        if (that.card_activator == 'hover') {
            this.card.on('mouseenter', function () {
                that.open();
            });
            this.card.on('mouseleave', function () {
                that.close();
            });
        }

    };

    MaterialCard.defaults = {
        icon_close: 'fa-arrow-left',
        icon_open: 'fa-bars',
        icon_spin: 'fa-spin-fast',
        card_activator: 'click'
    };

    MaterialCard.prototype.toggle = function () {
        this.icon.addClass(this.options.icon_spin);
        return this.isOpen() ? this.close() : this.open();
    };

    MaterialCard.prototype.getTransitionTiming = function () {
        var duration = 0;
        this.card.find('*').each(function () {
            if ( (transitionDurationToMilliseconds($(this).css('transition-duration')) + transitionDurationToMilliseconds($(this).css('transition-delay'))) > duration) {
                duration = (transitionDurationToMilliseconds($(this).css('transition-duration')) + transitionDurationToMilliseconds($(this).css('transition-delay')));
            }
        });
        return duration;
    };

    MaterialCard.prototype.close = function () {
        var that = this;
        this.card.trigger('hide.material-card');
        this.card.removeClass('mc-active');
        window.setTimeout(function() {
            that.icon
                .removeClass(that.options.icon_spin)
                .removeClass(that.options.icon_close)
                .addClass(that.options.icon_open);

            that.card.trigger('hidden.material-card');
        }, this.timing);
    };

    MaterialCard.prototype.open = function () {
        var that = this;
        this.card.trigger('show.material-card');
        this.card.addClass('mc-active');

        window.setTimeout(function() {
            that.icon
                .removeClass(that.options.icon_spin)
                .removeClass(that.options.icon_open)
                .addClass(that.options.icon_close);

            that.card.trigger('shown.material-card');
        }, this.timing);
    };

    MaterialCard.prototype.isOpen = function () {
        return this.card.hasClass('mc-active');
    };

    var transitionDurationToMilliseconds = function(duration) {
        var pieces = duration.match(/^([\d\.]+)(\w+)$/),
            time, unit, multiplier;

        if (pieces.length <= 1) {
            return duration;
        }
        time = pieces[1];
        unit = pieces[2];
        switch(unit) {
            case 'ms': multiplier = 1;
                break;
            case 's': multiplier = 1000;
                break;
        }
        return time * multiplier;
    };

    var Plugin = function (options) {
        return this.each(function () {
            var $this    = $(this);
            var $MCData    = $this.data('material-card');
            var $options = $.extend({}, MaterialCard.defaults, typeof options == 'object' && options);

            if (!$MCData) {
                $this.data('material-card', ($MCData = new MaterialCard(this, $options)));
            }

            if (typeof options == 'string') {
                $MCData[options]();
            }
        })
    };

    $.fn.materialCard = Plugin;
}(jQuery));