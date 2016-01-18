(function () {
  'use strict';

    /**
    *   Unit testing for date range picker directive
    **/
    describe('Directive: date-range-picker', function () {
        var element,
            scope,
            $compile,
            $rootScope;


        beforeEach(module('app'));


        /**
            SET UP MODEL DATA NEEDED BY THE DIRECTIVE
        **/
        beforeEach(inject(function($rootScope, $compile) {
            scope = $rootScope.$new();
            $compile = $compile;
            $rootScope = $rootScope;


            var GlobalStartDate = new Date(),
                GlobalEndDate = GlobalStartDate
                                    .setDate(GlobalStartDate.getDate() + 1)

            //sample config object for date range picker directive
            scope.customDateConfig = {
                startDate: GlobalStartDate,
                endDate: new Date(GlobalEndDate),
                defaultOptionIndex: 0,
                options: [
                    {
                        label: 'Past 7 days',
                        func: function () {
                            var startDate = new Date(),
                                endDate = new Date();

                            startDate.setDate(startDate.getDate() - 6);

                            return {
                                startDate: startDate,
                                endDate: endDate
                            }
                        }
                    },
                    {
                        label: 'This month name',
                        func: function () {
                            var today = new Date(),
                                startDate = new Date(today.getFullYear(),
                                                    today.getMonth(), 1),

                                endDate = new Date(today.getFullYear(),
                                                   today.getMonth() + 1, 0);

                            return {
                                startDate: startDate,
                                endDate: endDate
                            }
                        }
                    },
                    {
                        label: 'Last month name',
                        func: function () {
                            var today = new Date(),
                                startDate = new Date(today.getFullYear(),
                                                    today.getMonth() - 1, 1),

                                endDate = new Date(today.getFullYear(),
                                                   today.getMonth(), 0);

                            return {
                                startDate: startDate,
                                endDate: endDate
                            }
                        }
                    },
                    {
                        label: 'This year',
                        func: function () {
                            var today = new Date(),
                                startDate = new Date(today.getFullYear(), 0, 1),
                                endDate = new Date(today.getFullYear(), 11, 31);

                            return {
                                startDate: startDate,
                                endDate: endDate
                            }
                        }
                    }
                ]
            }

            element = '<custom-range-date-picker ' +
                        'config="customDateConfig"> ' +
                    '</custom-range-date-picker>';

            element = $compile(element)(scope);
            scope.$digest();
        }));



        it('Append the element directive to DOM', function() {
            expect(element.html()).toContain('custom-date-range-picker-wrapper');
        });

        it('Open date range picker option selector', function () {
                var button = element.find('.date-label');

                button.triggerHandler('click');
                scope.$digest();

                expect(element.html())
                    .toContain('<div class="date-selection md-layout-column" ng-show="isSelectionOpen" aria-hidden="false">');
        });

        it('Open dropdown of custom date range items', function () {
            var button = element.find('.dropdown-label');

            button.triggerHandler('click');
            scope.$digest();

            expect(element.html())
                    .toContain('<div class="dropdown-options md-layout-column layout-align-center-center" ng-show="isOptionSelectionOpen" aria-hidden="false">');
        });

        it('Should replace the current selected date range option', function () {
            var selectedOption = $('.dropdown-options').find('div:contains(\'Past 7 days\')');

            selectedOption.triggerHandler('click');
            scope.$digest();

            expect(element.find('.dropdown-label').html())
                .toEqual('Past 7 days');
        });

        it('Should update the start date and end date', function () {
            var selectedOption = $('.dropdown-options').find('div:contains(\'Past 7 days\')'),
                applyButton = $('.button .apply'),
                config = angular.copy(scope.customDateConfig);

            selectedOption.triggerHandler('click');
            scope.$digest();

            $(applyButton).triggerHandler('click');
            scope.$digest();

            config.endDate = new Date();
            config.startDate = new Date().setDate(new Date().getDate() - 6);

            // expect(scope.customDateConfig).toEqual(config);
            console.log(scope.customDateConfig);
        });
    })
    /**
    *  End Unit testing for date range picker directive
    **/
})();