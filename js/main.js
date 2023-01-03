document.querySelector('.activate-animation').addEventListener('click', function () {
    document.querySelector('.animated-icon').classList.toggle('open');
});
/* dark mode
function addDarkmodeWidget() {
    const options = {
        bottom: '32px', // default: '32px'
        right: '32px', // default: '32px'
        left: 'unset', // default: 'unset'
        time: '0.8s', // default: '0.3s'
        mixColor: '#f2c4b8', // default: '#fff'
        backgroundColor: '#fff',  // default: '#fff'
        buttonColorDark: '#100f2c',  // default: '#100f2c'
        buttonColorLight: '#fff', // default: '#fff'
        saveInCookies: true, // default: true,
        label: '🌓', // default: ''
        autoMatchOsTheme: false // default: true
    }

    const darkmode = new Darkmode(options);
    darkmode.showWidget();
}
window.addEventListener('load', addDarkmodeWidget);
*/
function moveToSelected(element) {

    if (element == "next") {
      var selected = $(".selected").next();
    } else if (element == "prev") {
      var selected = $(".selected").prev();
    } else {
      var selected = element;
    }
  
    var next = $(selected).next();
    var prev = $(selected).prev();
    var prevSecond = $(prev).prev();
    var nextSecond = $(next).next();
  
    $(selected).removeClass().addClass("selected");
  
    $(prev).removeClass().addClass("prev");
    $(next).removeClass().addClass("next");
  
    $(nextSecond).removeClass().addClass("nextRightSecond");
    $(prevSecond).removeClass().addClass("prevLeftSecond");
  
    $(nextSecond).nextAll().removeClass().addClass('hideRight');
    $(prevSecond).prevAll().removeClass().addClass('hideLeft');
  
  }
  
  // Eventos teclado
  $(document).keydown(function(e) {
      switch(e.which) {
          case 37: // left
          moveToSelected('prev');
          break;
  
          case 39: // right
          moveToSelected('next');
          break;
  
          default: return;
      }
      e.preventDefault();
  });
  
  $('#carousel div').click(function() {
    moveToSelected($(this));
  });
  
  $('#prev').click(function() {
    moveToSelected('prev');
  });
  
  $('#next').click(function() {
    moveToSelected('next');
  });
  (function ($) {

  "use strict";


  // Form
  var contactForm = function () {
      if ($('#contactForm').length > 0) {
          $("#contactForm").validate({
              rules: {
                  name: {required:true, minlength: 2},
                  subject: {required:true, minlength: 3},
                  email: {
                      required: true,
                      email: true
                  },
                  message: {
                      required: true,
                      minlength: 10
                  }
              },
              messages: {
                  name: "Please enter your name",
                  subject: "Please enter your subject",
                  email: "Please enter a valid email address",
                  message: "Please enter a message"
              },
              /* submit por ajax */

              submitHandler: function (form) {
                  var $submit = $('.submitting'),
                      waitText = 'Submitting...';

                  $.ajax({
                      type: "POST",
                      url: "php/sendEmail.php",
                      data: $(form).serialize(),

                      beforeSend: function () {
                          $submit.css('display', 'block').text(waitText);
                      },
                      success: function (msg) {
                          if (msg == 'OK') {
                              $('#form-message-warning').hide();
                              setTimeout(function () {
                                  $('#contactForm').fadeIn();
                              }, 1000);
                              setTimeout(function () {
                                  $('#form-message-success').fadeIn();
                              }, 1400);

                              setTimeout(function () {
                                  $('#form-message-success').fadeOut();
                              }, 8000);

                              setTimeout(function () {
                                  $submit.css('display', 'none').text(waitText);
                              }, 1400);

                              setTimeout(function () {
                                  $('#contactForm').each(function () {
                                      this.reset();
                                  });
                              }, 1400);

                          } else {
                              $('#form-message-warning').html(msg);
                              $('#form-message-warning').fadeIn();
                              $submit.css('display', 'none');
                          }
                      },
                      error: function () {
                          $('#form-message-warning').html("Something went wrong. Please try again.");
                          $('#form-message-warning').fadeIn();
                          $submit.css('display', 'none');
                      }
                  });
              } // end submitHandler

          });
      }
  };
  contactForm();

})(jQuery);
  let itemsc = document.querySelectorAll('.carousel .carousel-item')

		itemsc.forEach((el) => {
			const minPerSlide = 4
			let next = el.nextElementSibling
			for (var i=1; i<minPerSlide; i++) {
				if (!next) {
            // wrap carousel by using first child
            next = itemsc[0]
        }
        let cloneChild = next.cloneNode(true)
        el.appendChild(cloneChild.children[0])
        next = next.nextElementSibling
    }
})
