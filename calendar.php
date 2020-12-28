



<!DOCTYPE html>
<html class="calendar-page with-subnav ">

        <meta charset="utf-8" /> 
        
      
    

       
    
        
    
        <link href='//fonts.googleapis.com/css?family=Lato:300,400,900,400italic' rel='stylesheet' type='text/css'>
        <!--jquery UI CSS-->
        <link href="https://app.gettimely.com/cdn/4643ec0c18eb626ffb1f9a20cd3634fe.css" rel="stylesheet" type="text/css" />

        
<script>
    (function () {
        if (!window.TimelyGlobals) window.TimelyGlobals = {};
        //A global container for storing buiness details that need to be used via JS
        window.TimelyGlobals.businessId = "34933";
        window.TimelyGlobals.timeFormat = "Military";
        window.TimelyGlobals.is24HourTime = "True" == 'True';
        window.TimelyGlobals.currencySymbol = "€";
        window.TimelyGlobals.timePickerJsFormat = "G:i";
        window.TimelyGlobals.mobiScrollPickerFormat = "HH:ii";
        window.TimelyGlobals.mobiScrollWheelFormat = "HHii";

    }());
</script>
        <!--jquery v1.9.1 Includes Sizzle.js-->
        <script src="https://app.gettimely.com/cdn/3682901946450b7087c7d6ad60a03a59.js"></script>
        <!--<script src="http://dev.rugcentrumgent.be/wp_dev/alice/assets/js/jquery-2.0.3.min.js"></script>
        <script src="http://dev.rugcentrumgent.be/wp_dev/alice/assets/js/sizzle.js"></script>
        <script type="text/javascript" src="http://cdn.raygun.io/raygun4js/raygun.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.0/knockout-min.js"></script>
        <script src="http://ricostacruz.com/jquery.transit/jquery.transit.min.js"></script>-->
    <link href="https://app.gettimely.com/cdn/521107357c4b6d7efdad0898f93153fc.css" rel="stylesheet" type="text/css" />

    <style>
        .uv-bottom-right { right: 26px !important; }
        </style>
    <link rel='stylesheet' type='text/css' media="print" href='/Content/fullcalendar/fullcalendar.print.css' />


    </head>
<body class="app-body">
    


       


    <div class="timely-navbar">
        
        <div class="rg-container-fluid">

            <div class="rg-row">
                
                <div class="col-xs-12">
                    
                    <div class="rg-constrained" style="position: relative;">

                        
                        <div class="timely-nav__company">
                            <h1>
                                Alice Patient Managementtt
                            </h1>
                        </div>

                       
                            <div class="notification-area timely-nav__notifications">
    <div class="btn-group">
        <a class="btn btn-xs btn-inverse dropdown-toggle" data-toggle="dropdown" href="#"><span class="notification-bell"></span></a>
        <ul class="dropdown-menu right">
            <li class="notifications-title">
                <span>notifications</span>
                <span class="mark-as-read-link">Mark all as read</span>
            </li>
            <li class="notification-divider"></li>
        </ul>
    </div>
</div>
                            
                            
                             
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>       
    </div>
     
    <div class="page-body">
        
        <div class="rg-container-fluid">
            





<div class="rg-row">
    <div class="calendar col-md-12">
        

<script>
    var locationDropdowns = '';
    var staffDropdowns = '';
    var addInvoiceButton = '';
    var canUseFlex = true;
</script>

    <script>
        locationDropdowns = '<span class="btn-group tip" data-original-title="Tapuz">' +
            '<span class="drop-container btn">' +
            '<span class="drop-arrow caret"></span>' +
            '<i class="fa fa-home"></i>' +
            '<span class="drop-label"></span>' +
            '<select class="drop-select location-select select-menu" >' +
                '<option   data-location-id="52806" value="52806">Rugcentrum Gent</option>' +
                '<option selected=&quot;selected&quot;  data-location-id="52805" value="52805">Rugcentrum Eeklo</option>' +
 +
            '</select>' +
            '</span></span>';
    </script>
    
     <script>
             staffDropdowns = '<span class="btn-group tip" data-original-title="">' +
            '<span class="drop-container btn">' +
            '<span class="drop-arrow caret"></span>' +
            '<i class="fa fa-user"></i>' +
            '<span class="drop-label"></span>' +
            '<select class="drop-select staff-select select-menu" >' +
                '<option id="all-rostered-option"  data-staff-id="all-rostered" value="all-rostered">Thyl Duhameeuw</option>'+
                '<option id="all-staff-option"   data-staff-id="false" value="false">Guy Duhameeuw</option>'+
                    '<option selected=&quot;selected&quot; data-staff-id="87675" value="87675">Thierry Duhameeuw</option>' +
                    
        '</select>' +
        '</span></span>';
</script>



<div class="fc-messages"></div>


<div id="flex-pane" class="flex">
    <div class="flex__inner">
        
            
        <div id="customers-search">
                
            <div class="flex__header">


                <form data-bind="submit: $root.search" class="">
                    <div class="form-group">
                        <div class="input-group">
                            
                            <input id="search" data-bind="event: { keydown:  $root.autoSearch }" name="search" type="text" class="form-control customer-search" placeholder="Find patient" value="" />
                            <span class="input-group-btn">
                                <button type="button" class="btn" data-bind="click: $root.search"><i class="fa fa-search fa-fw"></i></button>
                            </span>
                        </div>
                    </div>
                </form>

                <div class="flex__loader-container" data-bind="visible: isLoading">
                    <div class="flex__loader">
                        <div class="flex__loader-line"></div>
                        <div class="flex__loader-break flex__loader-dot1"></div>
                        <div class="flex__loader-break flex__loader-dot2"></div>
                        <div class="flex__loader-break flex__loader-dot3"></div>
                    </div>
                </div>
                

            </div>

                    
            <div class="flex__body">
                    
                <div class="directory-container directory--calendar" data-bind="css: { 'smooth-scroll': isIpad() }, visible: !$root.showingCustomer()">
                    <ul class="directory name-value-list" data-bind="foreach: customers ">
                        <li data-bind="css: { active: $data.id == $root.chosenCustomerId() }, click: $root.goToCustomer">
                            <h3><a href="#" data-bind="click: $root.goToCustomer"><i class="fa fa-user">&nbsp;&nbsp;</i><span data-bind="text: fullName"></span></a></h3>
                            <div></div>
                        </li>
                    </ul>
                    <a href="javascript:void(0);" class="btn btn-block" data-bind="click: $root.searchLoadMore, visible: $root.hasMoreCustomers() && customers().length != 0" id="load-more-results">Load more results</a>

                    <div data-bind="visible: customers().length == 0 && !$root.hasSearchTerm()">
                        <div class="flex__panel">
                           
                        </div>
                    </div>
                    
                    <div data-bind="visible: customers().length == 0 && $root.hasSearchTerm() && !isLoading()">
                        <div class="flex__panel">
                            <h3>No matches for this search</h3>
                            <p>
                                Sorry we haven't been able to find any customers matching this search.
                            </p>
                            
                            <p>
                                <b>Tip:</b> As well as searching using customer names, you can also search for customers using their phone numbers and email addresses.
                            </p>

                            <hr />
                            
                        </div>
                    </div>

                </div>
                    
                <div id="customer" class="customer-container" data-bind="with: chosenCustomer, visible: showingCustomer, css: { 'smooth-scroll': isIpad() }">

                    <div class="flex__panel">

                        <div data-bind="visible: isNew || hasAlert || isVip || badCount > 0" class="flex__section" style="padding-top: 3px; margin-top:-15px;padding-bottom: 3px;">

                            <div class="flex__badges">
                                <span class="badge " data-bind="visible: isNew">New</span>
                                <a data-bind="visible: hasAlert, attr: { 'data-content': alert }" href="javascript:void(0);" rel="popover" data-original-title="Alerts & Contra Indicators"><i class="fa fa-exclamation-circle"></i></a>
                                <a data-bind="visible: isVip" data-original-title="VIP" href="javascript:void(0);" class="tip"><i class="fa fa-star"></i></a>
                                <a data-bind="visible: badCount > 0, attr: { 'data-content' : badCountText }" style="color: red;" href="javascript:void(0);" rel="popover" data-original-title="Customer no-shows"><i class="fa fa-thumbs-down"></i>&nbsp;&nbsp;<span data-bind="text: badCount"></span>x</a>
                            </div>

                        </div>

                        <h3 class="alert alert-danger" data-bind="visible: isDeleted">
                            <b><i class="fa fa-exclamation-circle"></i>&nbsp;This customer has been deleted</b>
                        </h3>

                        <h3 style="line-height: 30px;">
                            <a href="#" data-bind="click: $root.showSearch"><i class="fa fa-long-arrow-left fa-fw"></i></a> &nbsp;
                            <a href="#" class="fc-customer-name" data-bind="text: fullName, attr:{href: $root.viewCustomerUrl()}"></a>
                        </h3>

                        <div class="flex__section" style="padding-top: 0">

                            <p class="fulljustify">
                                <a data-bind="attr: { href: $root.editCustomerUrl() }" class="modal-open">Edit</a>
                                &nbsp;|&nbsp;
                                <a data-bind="attr: { href: $root.mergeCustomerUrl() }" class="modal-open merge-customer">Merge</a>
                                &nbsp;|&nbsp;
                                <a data-bind="attr: { href: $root.contactCustomerUrl() }" class="modal-open">Contact</a>
                                &nbsp;|&nbsp;
                                <a data-bind="attr: {'data-content': deleteHtml()}" class="pop" href="javascript:void(0);" data-original-title="Delete this customer?">Delete</a>
                            </p>

                            <p class="btn-group btn-group-justified">
                                <a href="#" class="btn btn-sm flex-new-booking btn-success" data-bind="attr: {'data-customer-id': id}">New appointment</a>
                            </p>

                            <p class="btn-group btn-group-justified">
                                <a class="btn btn-sm add-invoice">New sale</a>
                            </p>

                            <p class="btn-group btn-group-justified" data-bind="visible: concessionsAvailable">
                                <a class="btn btn-sm  modal-open" data-modal-class="customer-concession-modal" data-bind="attr: { href: $root.addCustomerConcessionUrl()}" href="/Customer/ConcessionAdd?customerId=2666106">Add package to customer</a>
                            </p>

                        </div>

                        <div class="flex__section">

                            <ul class="name-value-list">
                                <li data-bind="">
                                    <h3>Telephone</h3>
                                    <div><a data-bind="text: telephone, visible: hasTelephone(), attr: { href: telephoneUrl() }"></a><span data-bind="text: telephone, visible: !hasTelephone()"></span></div>
                                </li>
                                <li data-bind="">
                                    <h3>SMS number</h3>
                                    <div><a data-bind="text: sms, visible: hasSms(), attr: { href: smsUrl() }"></a><span data-bind="text: sms, visible: !hasSms()"></span></div>
                                </li>
                                <li data-bind="visible: hasEmail()">
                                    <h3>Email</h3>
                                    <div><a class="tip" data-bind="text: email, visible: hasEmail(), attr: { href: emailUrl(), 'data-original-title': email }"></a><span data-bind="text: email, visible: !hasEmail()"></span></div>
                                </li>
                                <li data-bind="visible: inDebt">
                                    <h3>Amount owing</h3>
                                    <div data-bind="text: outstanding, attr: { class: inDebt ? 'error-text' : '' }"></div>
                                </li>
                                <li data-bind="visible: hasAlert">
                                    <h3>Alerts</h3>
                                    <div data-bind="text: alert"></div>
                                </li>
                                <li data-bind="visible: isVip">
                                    <h3>VIP</h3>
                                    <div data-bind="text: vipText"></div>
                                </li>
                            </ul>
                        </div>

                        <div class="flex__section">
                            <div data-bind="visible:showTimeSince">
                                <p><span data-bind="text: daysSinceText"></span> since last booking</p>
                            </div>
                            
                            <div data-bind="visible:!showTimeSince()">
                                <p>Has no previous booking</p>
                            </div>
                         </div>


                        <div class="flex__section visible">
                            <h4>Next appointment:</h4>
                            <ul class="appointment-list" data-bind="template: { name: 'bookingTemplate', foreach: nextBooking }, visible: futureBookings().length > 0"></ul>
                            <p data-bind="visible: !hasFutureBookings()">No future appointments.</p>
                            <p data-bind="visible: !hasFutureBookings()" class="btn-group btn-group-justified">
                                <a href="#" class="btn btn-sm flex-new-booking " data-bind="attr: {'data-customer-id': id}">Book next</a>
                            </p>
                        </div>

                        <div class="flex__section visible">
                            <h4>Last appointment:</h4>
                            <ul class="appointment-list" data-bind="template: { name: 'bookingTemplate', foreach: lastBooking }, visible: pastBookings().length > 0"></ul>
                            <p data-bind="visible: !hasPastBookings()">No previous appointments.</p>
                        </div>

                        <div class="flex__section visible">
                            <h4>Notes:</h4>
                            <ul class="appointment-list" data-bind="template: { name: 'note', foreach: notes.display }, visible: notes().length > 0"></ul>
                            <p data-bind="visible: !hasNotes()">No notes have been recorded for this customer.</p>

                            <a data-bind="visible: notes.showButton, click: notes.toggleShowAll" class="expand-toggle" href="#">
                                <span data-bind="visible: !notes.showAll()">More notes <i class="fa fa-angle-double-down"></i></span>
                                <span data-bind="visible: notes.showAll()">Less notes <i class="fa fa-angle-double-up"></i></span>
                            </a>

                            <p class="btn-group btn-group-justified">
                                <a data-bind="attr: { href: $root.addNoteUrl() }" class="btn btn-sm modal-open">Add note</a>
                                <a data-bind="attr: { 'data-customer-id': id }" class="btn btn-sm print-notes">Print notes</a>
                            </p>
                        </div>

                        <div class="flex__section visible" data-bind="visible: concessions().length > 0 && concessionsAvailable">
                            <h4>Packages:</h4>
                            <div class="" data-bind="visible: concessions().length > 0 && concessionsAvailable">
                                <div class="customer-concession-list" data-bind="template: { name: 'concessionTemplate', foreach: concessions() }, visible: concessions().length > 0"></div>
                            </div>
                        </div>

                        <div class="flex__section" data-bind="visible: outstandingInvoices().length > 0, css: { visible:  hasDetails() }">
                            <div>
                                <h4 style="margin-bottom: 5px">Unpaid invoices:</h4>
                                <div class="invoice-list" data-bind="template: { name: 'invoiceTemplate', foreach: outstandingInvoices.display }, visible: outstandingInvoices().length > 0">
                                </div>
                            </div>

                            <a data-bind="visible: outstandingInvoices.showButton, click: outstandingInvoices.toggleShowAll" class="expand-toggle expand-toggle--after-row" href="#">
                                <span data-bind="visible: !outstandingInvoices.showAll()">More invoices <i class="fa fa-angle-double-down"></i></span>
                                <span data-bind="visible: outstandingInvoices.showAll()">Less invoices <i class="fa fa-angle-double-up"></i></span>
                            </a>
                        </div>

                        <div class="flex__section" data-bind="visible: invoices().length > 0, css: { visible:  hasDetails() }">
                            <div>
                                <h4 style="margin-bottom: 5px">All invoices:</h4>
                                <div class="invoice-list" data-bind="template: { name: 'invoiceTemplate', foreach: invoices.display }, visible: invoices().length > 0">
                                </div>
                            </div>

                            <a data-bind="visible: invoices.showButton, click: invoices.toggleShowAll" class="expand-toggle expand-toggle--after-row" href="#">
                                <span data-bind="visible: !invoices.showAll()">More invoices <i class="fa fa-angle-double-down"></i></span>
                                <span data-bind="visible: invoices.showAll()">Less invoices <i class="fa fa-angle-double-up"></i></span>
                            </a>
                        </div>

                    </div>

                </div>
                
            </div>

        </div>


    </div>

</div>



<script>
    var customersList = [];
    var customersFlexPaneModel;

    if (canUseFlex) {

        $(function() {
            customersFlexPaneModel = new CustomersViewModel(customersList, 52805, 34933);
            ko.applyBindings(customersFlexPaneModel, $("#customers-search")[0]);
        });

    }


</script>



<script type="text/html" id="physicalAddressTemplate">
</script>

<script type="text/html" id="bookingTemplate">
    <li>
        <h3>
            <a data-bind="attr: {href: editBookingUrl()}, visible: (!isCancelled || bookingId > 0), click: $root.openBookingModal"><span data-bind="text: service"></span> for <span data-bind="text: customerName" class="fc-customer-name"></span></a>

            <span class="label" data-bind="visible: isPending">Pencilled-in</span>
            <span class="label label-important" data-bind="visible: isCancelled">Cancelled</span>
            <span class="label label-inverse" data-bind="visible: isDidNotShow">Did not show</span>
            <span class="label label-success" data-bind="visible: isCompleted">Completed</span>
            <span class="label label-success" data-bind="visible: isAttended">Attended</span>

            <span data-bind="visible: isCancelled && classId > 0"><span data-bind="text: service"></span> for <span data-bind="text: customerName" class="fc-customer-name"></span></span>
            
           
            
            <a href="#" data-bind="visible: isRecurring, attr:{ 'data-content': recurrenceText()}" rel="popover" data-original-title="Recurring appointment"><i class="fa fa-refresh"></i></a>
            <a href="javascript:void(0);" data-bind="visible: hasComments, attr:{ 'data-content': comments}" rel="popover" data-original-title="Customer comments"><i class="fa fa-comment"></i></a>
        </h3>
        <div><i class="fa fa-clock-o fa-fw"></i> &nbsp; <span data-bind="text: startDate"></span>&nbsp;<span data-bind="text: startTime"></span></div>
        <div><i class="fa fa-user fa-fw"></i> &nbsp; <span data-bind="text: staffName"></span></div>
        <div><i class="fa fa-home fa-fw"></i> &nbsp; <span data-bind="text: location"></span></div>
        <div data-bind="visible: isPending"><i class="fa fa-cog fa-fw"></i> &nbsp; <span class="" data-bind="visible: isPending">Pencilled-in</span></div>
        <div data-bind="visible: isCancelled"><i class="fa fa-cog fa-fw"></i> &nbsp; <span class="label label-important" data-bind="visible: isCancelled">Cancelled</span></div>

        <div style="margin-top:10px;">
            <p class="btn-group btn-group-justified">
                <a href="#" class="btn btn-sm show-booking" data-bind="attr: {'data-date': startDate, 'data-booking-id': bookingId, 'data-class-id': classId, 'data-staff-id': staffId, 'data-location-id': locationId}">Show</a>
                <a href="#" class="btn btn-sm rebook" data-bind="visible: bookingId > 0, attr: {'data-booking-id': bookingId, 'data-class-id': classId}">Book next</a>
            </p>

        </div>
    </li>
</script>


<script type="text/html" id="concessionTemplate">
    <div class="name-value-list-row">
        <div><a href="javascript:void(0)" data-bind="text: concessionName, attr: { href: editUrl }" data-modal-class="customer-concession-modal" class="modal-open"></a></div>
        <ul class="name-value-list" data-bind="attr: { 'data-id': customerConcessionId }">
            <li>
                <h3>Usage</h3>
                <div data-bind="visible: customerConcessionItems.length > 1">
                    <a href="#" rel="popover" data-original-title="Package items" data-bind="attr: { 'data-content': concessionItemsHtml()}" data-original-class="customer-concession-items-balloon"><i class="fa fa-list-alt fw"></i>&nbsp;View usage</a>
                </div>
                <div data-bind="visible: customerConcessionItems.length == 1, html: singleConcessionItemHtml()">

                </div>
            </li>
            <li>
                <h3>Payment</h3>
                <div>
                    <span class="label label-success" data-bind="text: paid ? 'Paid' : 'Unpaid', css: { 'label-success': paid, 'label-warning': !paid }"></span>
                </div>
            </li>
            <li>
                <h3>Status</h3>
                <div>
                    <span class="label" data-bind="css: {'label-success': status == 'Active', 'label-important': status == 'Expired'  }, text: status"></span>
                </div>
            </li>
            <li>
                <h3>Date added</h3>
                <div data-bind="text: dateCreated">                    
                </div>
            </li>
            <li>
                <h3>Expiry date</h3>
                <div data-bind="text: expiryDate">
                </div>
            </li>
            
        </ul>

        <div data-bind="visible:  status == 'Active' && !includesClasses" style="margin-top:10px;">
            <p class="btn-group btn-group-justified">
                <a data-bind="attr: { href: bookUrl, 'data-package-id':  customerConcessionId, 'data-customer-id':  customerId }, visible: status == 'Active' && !includesClasses" class="btn  btn-sm book-package">Book package</a>
            </p>
        </div>

    </div>
        
</script>

<script type="text/html" id="invoiceTemplate">
    <div class="name-value-list-row">
        <ul class="name-value-list">         
            <li>
                <h3>Invoice #</h3>
                <div>
                    <a data-bind="attr: { href: editUrl }, text: invoiceIdDisplay, visible: !isInVend"></a>
                    <a data-bind="attr: { href: vendSaleUrl }, text: invoiceIdDisplay, visible: isInVend" class="modal-open" data-modal-class="iframe-modal"></a>
                </div>
            </li>
            <li>
                <h3>Status</h3>
                <div>
                    <span class="badge badge-success" data-bind="visible: paid">Paid</span><span class="badge badge-warning" data-bind="    visible: !paid">Unpaid</span>
                </div>
            </li>
            <li data-bind="visible: isInVend">
                <h3>Vend</h3>
                <div>
                    <a data-bind="attr: { href: vendSaleUrl }, visible: isInVend" class="modal-open" data-modal-class="iframe-modal"><img src="/Images/vend-tiny.png" /></a>
                </div>
            </li>
            <li>
                <h3>Invoice date</h3>
                <div>
                    <span data-bind="text: invoiceDate"></span>
                </div>
            </li>
            <li>
                <h3>Due date</h3>
                <div>
                    <span data-bind="text: dueDate"></span>
                </div>
            </li>
            <li data-bind="visible: hasReference()">
                <h3>Reference</h3>
                <div>
                    <span data-bind="text: reference"></span>
                </div>
            </li>
            <li>
                <h3>Amount</h3>
                <div>
                    <span data-bind="text: amount"></span>
                </div>
            </li>
        </ul>  
        
        <div data-bind="visible: !paid" style="margin-top:10px;">
            <p class="btn-group btn-group-justified">
                <a href="#" class="btn btn-sm modal-open" data-bind="attr: { href: payUrl }">Apply payment</a>
                <a href="#" class="btn btn-sm modal-open" data-bind="attr: { href: requestUrl }">Request payment</a>
            </p>

        </div>
              
    </div>

</script>


<script type="text/html" id="note">
    <li>       
    <h3>
        <span data-bind="text: title"></span>&nbsp;
        <a data-bind="attr: { href: editUrl }" class="modal-open"><i class="fa fa-pencil-square-o fa-lg"></i></a>
        <a data-bind="attr: {'data-content': deleteNoteHtml()}" class="pop" href="javascript:void(0);" data-original-title="Delete this note?"><i class="fa fa-trash-o fa-lg"></i></a>

    </h3>
    <div data-bind="html: noteText">
    </div>
    </li>
</script>




<div id="calendar">

    <div class="calendar__loader-container">
        <div class="calendar__loader">
            <div class="calendar__loader-line"></div>
            <div class="calendar__loader-break calendar__loader-dot1"></div>
            <div class="calendar__loader-break calendar__loader-dot2"></div>
            <div class="calendar__loader-break calendar__loader-dot3"></div>
        </div>
    </div>

</div>






    </div>
</div>

        </div>
   
    </div>
    <!--some scripts put together -->
    <script src="https://app.gettimely.com/cdn/bbb8426e82995d7fbbbd64d840de8464.js"></script>

    
    <!--some timely script-->
    <script src="https://app.gettimely.com/cdn/d5e7722da42751272dab3cc1c8e49cd9.js"></script>
    
    
   
         


        
    
    



    


       <script src="https://app.gettimely.com/cdn/ee3064525865064bf09ce76bb19c4226.js"></script>
    

    </script>



</body>
</html>
