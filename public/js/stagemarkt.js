//
//   stagemarkt.js defines the form behaviour for stagemarkt - PG for Informaat
//


$(document).ready(function () {


  // SEARCH SECTION //

  // clear button 
  $('.srch-input').keyup(function () {                                            // show 'x' button when typing into field, hide when deleting
    $(this).parent().parent().find(".srch-clear").toggle(Boolean($(this).val()));
  });
  $('.srch-clear').toggle(Boolean($(this).parent().find("input").val()));         // when loading
  $('.srch-clear').click(function () {                                            // clear onclick: empty input and hide itself 
    $(this).parent().find("input").eq(0).val('').focus();
    $(this).hide();
  });


  // depending on viewport size ("xs" or not) 
  if (isBreakpoint('xs')) {
    $('#srch-action-div').removeClass("button-gutter").addClass("narrow-gutter"); // the "zoeken" button needs to be aligned with other controls
    $('#branch-sort').addClass("mobile");                                         // results section is tight
    $('#details-table').addClass("mobile");                                       // different layout of details table
    $('.homepage #srch-section').removeClass("overlay");                          // SBB decided not to show carousel for mobile use
    $('#srch-loc').attr("placeholder", "Plaats");
    $('#srch-country-btn').html("NL <i class='fa fa-chevron-down'></i>");
  } else {
    $('#srch-action-div').removeClass("narrow-gutter").addClass("button-gutter"); // the "zoeken" button needs to be spaced from the previous control
    $('#branch-sort').removeClass("mobile");
    $('#details-table').removeClass("mobile");
    $('.homepage #srch-section').addClass("overlay");
  }


  // all droplists at page creation
  $('.dropdown-menu a').click(function () {

    // <a> inside dropmenu onclick: show content of selected <a> in button (leave out anything between '()' )
    $('#' + $(this).parent().parent().data("for")).html($(this).text().split("(")[0]).append("<i class='fa fa-chevron-down'></i>");

    // if this is inside the country dropdown list and text doesn't fit: use the 2-letter country code
    if ( $(this).parent().parent().data("for") == "srch-country-btn") {
      var el = document.getElementById("srch-country-btn");
      //if ((el.offsetWidth < el.scrollWidth + 22) && $(this).attr("data-cc")) {
      if (isBreakpoint('xs') && $(this).attr("data-cc")) {
        $('#' + $(this).parent().parent().data("for")).html($(this).attr("data-cc")).append("<i class='fa fa-chevron-down'></i>");
      }
    }
  });

  // country droplist specific
  $('#srch-country-btn + ul a').click(function () {  // <a> inside dropmenu onclick: remove any additional columns, disable loc + radius when appropriate
    $('li.xtra').hide();                                                          // hide 'xtra' countries
    $('li.more').show();                                                          // show 'more...' link

    $('#split-list').append($('#split-list').find('li'));                         // move all country items outside sub-lists
    $('#split-list').find('ul').remove();                                         // remove sub lists
    $('#split-list').removeAttr("width").css({ width: "" });                      // remove width definition

    if ($(this).parent().attr('class') == "xtra") { // if <li>.xtra disable loc + radius controls, otherwise enable them
      $('#srch-loc').val("n.v.t.").prop('disabled', true);                        // disable input and place 'nvt' inside (this will show clear button)
      $('#srch-loc').parent().parent().find('.srch-clear').hide();                // hide clear button relative to the input field
      $('#srch-radius-btn').html("n.v.t.").prop('disabled', true);                // place 'nvt' in label and disable button
    } else {
      $('#srch-loc').prop('disabled', false);                                     // enable input
      if ($('#srch-loc').val() == "n.v.t.") $('#srch-loc').val("");               // if 'nvt' in input, clear input
      $('#srch-radius-btn').prop('disabled', false);                              // enable button; if 'nvt', place default value with droplist icon in button
      if ($('#srch-radius-btn').text() == "n.v.t.") $("#srch-radius-btn").html("+ 0km <i class='fa fa-chevron-down'></i>");
    }
  });

  // more link inside country droplist
  $('li.more').click(function (e, viewport) { // <a> inside dropmenu onclick: show all xtra countries and spread them over appropriate number of columns

    e.stopPropagation();                                                          // ensure that dropdown menu stays open
    $('li.xtra').show();                                                          // show all 'xtra' items
    $('li.more').hide();                                                          // hide "+ show all"-link

    // determine how many countries there are and divide over columns if neccesary
    // max 3 cols, max 15 (adjust below!) items per col (unless 3 cols already)
    var max_items_per_col = 15;                                                   // SET HERE MAXIMUM NUMBER OF ITEMS IN THE LIST/COLUMN

    var num_cols = 1;                                                             // number of columns, default is 1
    var list_class = "list-unstyled no-gutter";                                   // lists inside lists should not have a gutter, if more than one column apprpriate bootstrap classes will be added
    var items = $('#split-list').find('li');                                      // handler for all foreign country items 

    if (!$('li.more').is(":visible") && !isBreakpoint('xs')) {                    // if the entire list of countries needs to be displayed, and not xs viewport: create extra columns

      if (items.length <= (2 * max_items_per_col) || isBreakpoint('sm')) {        // if 30 items or less, or screen is sm (can only fit 2 cols): 2 cols, add necessary classes
        num_cols = 2;
        list_class += " col-sm-6";
      } else {                                                                    // otherwise spread over 3 columns, add necessary classes
        num_cols = 3;
        list_class += " col-sm-4";
      }
    }
    // determine num of items per column (first column(s) may have 1 more item)
    var items_per_col = new Array();                                              // create an array with totals for each column
    var min_items_per_col = Math.floor(items.length / num_cols);                  // baseline totals for all columns
    var left_over = items.length - (min_items_per_col * num_cols);                // left_over needs to be spread over first columns
    var menu_width = $('#split-list').width();                                    // capture the needed width per column

    for (var i = 0; i < num_cols; i++) {
      if (i < left_over) {
        items_per_col[i] = min_items_per_col + 1;
      } else {
        items_per_col[i] = min_items_per_col;
      }
    }

    // spread list items over columns (vertically)
    for (var i = 0; i < num_cols; i++) {                                        // for each column; create a sub list, place "data-for" to find button for label, add classes
      $('#split-list').append($('<ul ></ul>').attr("data-for", "srch-country-btn").addClass(list_class));
      for (var j = 0; j < items_per_col[i]; j++) {                              // for each item in items_per_col; move top country item from base list into last column list
        $('#split-list').children().last().append($('#split-list').find('li').first());
      }
    }

    // since menu already created; resize the menu with extra width depending on # of columns 
    $('#split-list').width(menu_width * num_cols);
  });


  // FILTER SECTION //

  // determine whether filter section needs to be modal or not, depending on viewport (xs)
  if (isBreakpoint('xs')) {
    $('#filter-modal').removeClass().addClass("modal fade");
    $('#filter-dialog').removeClass().addClass("modal-dialog");
    $('#filter-content').removeClass().addClass("modal-content");
  } else {
    $('#filter-modal').removeClass();
    $('#filter-dialog').removeClass();
    $('#filter-content').removeClass();
  }

  // set the onclick event for checkbox groups to behave like wells
  $('#filter-content div.checkbox.check-pill').click(function () {

    if ($(this).find('input').prop("checked") == false) {                       // checkbox std cb already passed so counter intuitive
      $(this).removeClass('radio-sel');                                         // remove selection emphasis
      $(this).parent().find('.checkbox').removeClass('hidden');                 // show all choices in form group
    } else {
      $(this).addClass('radio-sel');                                            // add selection emphasis
      $(this).parent().find('.checkbox').addClass('hidden');                    // hide all checkboxes in form group
      $(this).removeClass('hidden');                                            // but show this one
    }

  });

  // hide the >5 items in list of work placement types and show more link  + set onclick
  if ($('#fltr-work > div > div').length > 5) {                                 // if there are more than 5 items in list:
    $('#more_work').show();                                                     // show more link
    $('#more_work').click(function () {                                         // set onclick
      $('#fltr-work > div > div').show();                                       // show all items
      $('#more_work').hide();                                                   // hide this link
    });
  }
  $('#fltr-work > div > div:gt(4)').hide();                                     // hide anything over 5 items (gt(4))

  // RESULTS SECTION //

  // popover for "niet beschikbaar"; since the content is rather large it is set here once (size is set in css)
  $('[data-toggle="popover"]').popover();                                       // initialize popup
  $('[data-toggle="popover"]').attr('data-content', "Er is waarschijnlijk geen stageplaats of leerbaan op dit moment. Je kunt ze altijd proberen te bellen als je graag bij dit bedrijf wilt stagelopen.");

  // DETAILS SECTION //

  // toggle for work pacement job details
  $('#details-table a.work').click(function () {
    if ($(this).hasClass("closed")) {                                           // more-than symbol is shown
      $(this).removeClass("closed").addClass("open");                           // show chevron-down symbol
      $(this).parent().parent().parent().nextUntil('.pot').show();              // show all available work placement jobs (until the next potential work placement row)
    } else {
      $(this).removeClass("open").addClass("closed");                           // show more-than symbol
      $(this).parent().parent().parent().nextUntil('.pot').hide();              // hide all available work placement jobs (until the next potential work placement row)
    }
  });
  // toggle for teacher details
  $('#details-table a.teach').click(function () {
    if ($(this).hasClass("closed")) {                                           // more-than symbol is shown
      $(this).removeClass("closed").addClass("open");                           // show chevron-down symbol
      $('#teach-body').show();                                                  // show teacher section
    } else {
      $(this).removeClass("open").addClass("closed");                           // show more-than symbol
      $('#teach-body').hide();                                                  // hide teacher section
    }
  });

  if ($('#map').length != 0) {                                                  // if there is a map on the page

    var address = $.trim($('#address').text()).replace(/[ \t\v]+/g, " ");       // take out address from html (is placed in address div), strip any superfluous spaces, tabs and returns 
    var geocoder = new google.maps.Geocoder();

    // Create map for entire Netherlands (zoom: 6), then zoom in and center when address found: zoom: 15
    var mapOptions = {
      center: new google.maps.LatLng(51.996, 5.509),
      zoom: 6,
      panControl: false,
      zoomControl: true,
      zoomControlOptions: {
        style: google.maps.ZoomControlStyle.SMALL,
        position: google.maps.ControlPosition.TOP_RIGHT                         // controls placed for right-handed people
      },
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    Map = new google.maps.Map(document.getElementById("map"), mapOptions);

    if (geocoder) {
      geocoder.geocode({
        'address': address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {
            Map.setCenter(results[0].geometry.location);
            Map.setZoom(15);
            var marker = new google.maps.Marker({
              position: results[0].geometry.location,
              map: Map,
              title: address
            });
          }
        }
      });
    }
  }

});               // /$(document).ready();


$(window).resize(function () {

  // determine whether filter section needs be modal or not, depending on viewport (xs)
  if (isBreakpoint('xs')) {
    $('#filter-modal').removeClass().addClass("modal fade");
    $('#filter-dialog').removeClass().addClass("modal-dialog");
    $('#filter-content').removeClass().addClass("modal-content");
    $('#srch-action-div').removeClass("button-gutter").addClass("narrow-gutter");

    // additional styling that cannot be solved by bootstrap
    $('#branch-sort').addClass("mobile");
    $('#details-table').addClass("mobile");
    $('.homepage #srch-section').removeClass("overlay");                          // SBB decided not to show carousel for mobile use
    $('#srch-loc').attr("placeholder", "Plaats");
    $('#srch-country-btn').html("NL <i class='fa fa-chevron-down'></i>");
  } else {
    $('#filter-modal').removeClass().show();                                      // make sure the filter bar is shown
    $('#filter-dialog').removeClass();
    $('#filter-content').removeClass();
    $('#srch-action-div').removeClass("narrow-gutter").addClass("button-gutter");
    $('#srch-loc').attr("placeholder", "Plaats of postcode");
    $('#srch-country-btn').html("Nederland <i class='fa fa-chevron-down'></i>");

    // additional styling that cannot be solved by bootstrap
    $('#branch-sort').removeClass("mobile");
    $('#details-table').removeClass("mobile");
    $('.homepage #srch-section').addClass("overlay");
  }

}); // /$(window).resize();



// used with the divs at the bottom of the page to test which viewport is used in bootstrap (alias: xs, sm, md, lg)
function isBreakpoint( alias ) {
    return $('.device-' + alias).is(':visible');
}
