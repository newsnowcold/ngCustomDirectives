'use strict';

angular.module('directives.custom-range-date-picker',[])

.directive('customRangeDatePicker',
           ['$filter',
            function ($filter) {

    var template =
    '<div class="custom-date-range-picker-wrapper"> \
        <div class="date-label" ng-click="openDateRangeOptionSelection()"> \
            <span ng-bind="selectedOptionLabel"></span> \
        </div> \
        <div class="date-selection" \
             layout="column" \
             ng-show="isSelectionOpen"> \
            <!-- //error messages --> \
            <div class="error-item" \
                 ng-bind="error" \
                 ng-repeat="error in errorMessages"> \
            </div> \
            <div> \
                <div class="dropdown-label field" \
                     ng-click="openOptionsSelection()" \
                     ng-bind="temptSelectedOptionLabel"></div> \
                <div class="dropdown-options" \
                     ng-show="isOptionSelectionOpen" \
                     layout="column" \
                     layout-align="center center"> \
                    <div ng-repeat="option in options" \
                         ng-bind="option.label" \
                         ng-click="optionSelected(option.label)"> \
                    </div> \
                </div> \
            </div> \
            <div ng-if="temptSelectedOptionLabel == \'Custom period\'" \
                 layout="row" \
                 layout-align="space-between center" \
                 class="custom-date-range"> \
                <md-datepicker ng-model="customDates.startDate" md-placeholder="Enter date"></md-datepicker> \
                <md-datepicker ng-model="customDates.endDate" md-placeholder="Enter date"></md-datepicker> \
             </div> \
            <div class="footer" \
                 layout="row" \
                 layout-align="end"> \
                <button class="button cancel" ng-click="cancel()">Cancel</button> \
                <button class="button apply" ng-click="save()">Apply</button> \
            </div> \
        </div> \
    </div>';

    return {
        restrict: 'E',
        template: template,
        scope: {
            /**
            *   config = {
            *        startDate: date,
            *        endDate: date,
            *        defaultOptionIndex: int,
            *        format: string,
            *        options: [
            *            {
            *                label: string,
            *                func: function () {
            *
            *                }
            *            }...
            *        ]
            *    }
            *
            **/
            config: '='
        },
        link: function (scope, elem, attrs, ngModel) {
                /**
                *   open/close the selector/dropdown of date range options
                **/
            var openOptionsSelection = function () {
                    //variable use for modal selector ngShow
                    scope.isOptionSelectionOpen = !scope.isOptionSelectionOpen;
                },

                /**
                *   when the user select an option, this function is called
                *   and it updates selected option index and also the prepares
                *    the action that will be use when user click save button
                **/
                optionSelected = function (label) {
                    var options = scope.options,
                        length = options.length;

                    //find the label from array of options
                    for (var i = 0; i < length; i++) {
                        var option = options[i];

                        // if found get the function and its index and update
                        // the label of the selector/dropdown
                        if (option.label == label) {
                            scope.selectedOptionAction = option.func;
                            scope.optionIndex = i;
                            scope.temptSelectedOptionLabel = option.label;
                            break;
                        }
                    }

                    //close the option selector/dropdown
                    scope.isOptionSelectionOpen = false;
                },

                /**
                *    open/close the modal where user select a date range option
                **/
                openDateRangeOptionSelection = function () {
                    scope.errorMessages = [];
                    scope.isSelectionOpen = !scope.isSelectionOpen;
                },

                /**
                *   validate dates
                **/
                validStartEndDate = function () {
                    var result = true,
                        dates = scope.customDates;

                    if (  !dates.startDate
                        ||!dates.endDate) {
                        result = false;
                    } else if (dates.startDate > dates.endDate) {
                        result = false;
                    } else if (dates.startDate == 'Invalid Date'
                        ||!dates.endDate == 'Invalid Date') {
                        result = false;
                    }

                    return result;
                },

                /**
                *   check for null dates and return an error
                **/
                validateDates = function () {
                    var result = true,
                        dates = scope.customDates;

                    scope.errorMessages = [];

                    //check for null errors
                    if (   !dates.startDate
                        || !dates.endDate) {
                        if (   !dates.startDate
                            && !dates.endDate) {
                            scope.errorMessages.push('Error no dates');
                            result = false;
                        } else if (!dates.startDate) {
                            scope.errorMessages.push('Error no start date');
                            result = false;
                        } else {
                            dates.errorMessages.push('Error no end date');
                            result = false;
                        }
                        return result;
                    }

                    // check if dates starting date is not greater than end date
                    // and if dates are valids
                    if (!validStartEndDate()) {
                        scope.errorMessages.push('Error invalid dates');
                        result = false;
                        return result;
                    }

                    return result;
                },

                /**
                *   create a label according to its format
                **/
                createLabel = function (datePeriod) {
                    var toLabel = (datePeriod)? datePeriod :
                                                scope.customDates,
                        startDate = toLabel.startDate,
                        endDate = toLabel.endDate,
                        format = scope.config.format;

                    return $filter('date')(startDate, format)
                        +' - '
                        + $filter('date')(endDate, format)
                },

                /**
                *   reset custom date to default values
                **/
                resetDefaultCustomDate = function () {
                    var today = new Date();

                    scope.customDates = {
                        startDate: new Date(today.getFullYear(),
                                            today.getMonth(), 1),
                        endDate: new Date()
                    };

                    console.log(moment(new Date()).format('YYYY-MM-DD'))
                },

                /**
                *   close custom date range picker and cancel all changes
                **/
                cancel = function () {
                    scope.isSelectionOpen = false;
                },
                /**
                *   close custom date range picker, save and update values
                **/
                save = function () {

                    if (validateDates()) {
                        var dates = scope.selectedOptionAction();

                        //updates values of the model from main controller
                        scope.config.startDate = dates.startDate;
                        scope.config.endDate = dates.endDate;

                        scope.selectedOptionLabel = scope.temptSelectedOptionLabel

                        if (scope.temptSelectedOptionLabel === 'Custom period') {
                            scope.selectedOptionLabel =
                                                createLabel(scope.customDates);
                        }

                        scope.isSelectionOpen = false;
                    }
                };

            // this variable will hold the function that will be use to
            // to calculate start date and end date when user click save
            scope.selectedOptionAction;

            //initialize an array object to store error messages
            scope.errorMessages = [];

            scope.cancel = cancel;

            scope.save = save;

            scope.openDateRangeOptionSelection = openDateRangeOptionSelection;

            //models for custom date option
            // scope.customDates = {
            //     startDate: new Date(new Date().getFullYear(),
            //                              new Date().getMonth(), 1),
            //     endDate: new Date()
            // };
            resetDefaultCustomDate();

            scope.options = scope.config.options;

            //Add a function that let's user select custom date range
            scope.options.push({
                label: 'Custom period',
                func: function () {
                    return scope.customDates;
                }
            });

            // get the default option index
            scope.optionIndex = scope.config.defaultOptionIndex;

            //get the default option label
            scope.selectedOptionLabel = scope.options[scope.optionIndex]['label'];

            //get the default option label for the dropdown
            scope.temptSelectedOptionLabel = scope.selectedOptionLabel;

            //assign the default action of the default option
            scope.selectedOptionAction = scope.options[scope.optionIndex]['func'];

            scope.openOptionsSelection = openOptionsSelection;

            // by default close dropdown/option selector
            scope.isOptionSelectionOpen = false;

            scope.optionSelected = optionSelected;
            //close custom date range picker when user click outside directive
            // $("*").on('click', function(event) {
            //     if (scope.isSelectionOpen) {
            //         console.log(event.target)
            //         if(!$(event.target).closest(elem).length) {
            //             scope.$apply(cancel());
            //         }
            //     }
            // });
        }
    }
}]);