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
        <div class="date-selection-wrapper"></div> \
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
                <md-datepicker ng-model="startDate" md-placeholder="Enter date"></md-datepicker> \
                <md-datepicker ng-model="endDate" md-placeholder="Enter date"></md-datepicker> \
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
                *   when the user select an option, this function is called
                *   and it updates selected option index and also the action
                *   when the user click save button
                **/
            var openOptionsSelection = function () {
                    scope.isOptionSelectionOpen = !scope.isOptionSelectionOpen;
                },
                optionSelected = function (label) {
                    var options = scope.options,
                        length = options.length;

                    for (var i = 0; i < length; i++) {
                        var option = options[i];

                        if (option.label == label) {
                            selectedOptionAction = option.func;
                            scope.optionIndex = i;
                            scope.temptSelectedOptionLabel = option.label;
                            break;
                        }
                    }

                    scope.isOptionSelectionOpen = false;
                },

                /**
                *   open/close option selection modal
                **/
                openDateRangeOptionSelection = function () {
                    scope.isSelectionOpen = !scope.isSelectionOpen;
                },

                /**
                *   validate dates
                **/
                validStartEndDate = function () {
                    var result = true;

                    if (  !scope.startDate
                        ||!scope.endDate) {
                        result = false;
                    } else if (scope.startDate > scope.endDate) {
                        result = false;
                    } else if (scope.startDate == 'Invalid Date'
                        ||!scope.endDate == 'Invalid Date') {
                        result = false;
                    }

                    return result;
                },

                /**
                *   check for null dates and return an error
                **/
                validateDates = function () {
                    var result = true;

                    scope.errorMessages = [];

                    if (   !scope.startDate
                        || !scope.endDate) {
                        // Show specific error
                        if (   !scope.startDate
                            && !scope.endDate) {
                            scope.errorMessages.push('Error no dates');
                            result = false;
                        } else if (!scope.startDate) {
                            scope.errorMessages.push('Error no start date');
                            result = false;
                        } else {
                            scope.errorMessages.push('Error no end date');
                            result = false;
                        }
                        return result;
                    }

                    // Actual validation
                    if (!validStartEndDate()) {
                        // Invalid dates
                        scope.errorMessages.push('Error invalid dates');
                        result = false;
                        return result;
                    }

                    return result;
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
                        var dates = selectedOptionAction();

                        scope.config.startDate = dates.startDate;

                        scope.config.endDate = dates.endDate;
                    }
                },

                selectedOptionAction;

            //initialize an array object to store error messages
            scope.errorMessages = [];

            scope.cancel = cancel;

            scope.save = save;

            scope.openOptionsSelection = false;

            //models for custom date option
            scope.customDates = {
                startDate: new Date(new Date().getFullYear(),
                                         new Date().getMonth(), 1),
                endDate: new Date()
            };

            scope.openDateRangeOptionSelection = openDateRangeOptionSelection;

            scope.startDate = scope.config.startDate;

            scope.endDate = scope.config.endDate;

            scope.options = scope.config.options;

            //Add a function that let's user select custom date range
            scope.options.push({
                label: 'Custom period',
                func: function () {
                    var selectedDates = scope.customDates;

                    if (   selectedDates.startDate
                        && selectedDates.endDate) {

                        if (typeof selectedDates.startDate == 'object') {
                            selectedDates.startDate =
                                            selectedDates.startDate.getTime();
                        } else {
                            selectedDates.startDate =
                                            selectedDates.startDate;
                        }

                        if (typeof selectedDates.endDate == 'object') {
                            selectedDates.endDate =
                                            selectedDates.endDate.getTime();
                        } else {
                            selectedDates.endDate = selectedDates.endDate;
                        }
                    }

                    scope.custom = selectedDates;
                    return scope.custom;
                }
            });

            scope.optionIndex = scope.config.defaultOptionIndex;

            scope.selectedOptionLabel = scope.options[scope.optionIndex]['label'];

            scope.temptSelectedOptionLabel = scope.selectedOptionLabel;

            //assign the default action of the default option
            selectedOptionAction = scope.options[scope.optionIndex]['func'];

            scope.openOptionsSelection = openOptionsSelection;

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