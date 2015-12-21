(function (angular) {
    angular.module('app', [
            'ngMaterial',
            'directives.custom-range-date-picker'
        ]).

    controller('appCtrl', ['$scope', function ($scope) {
        var GlobalStartDate = new Date(),
            GlobalEndDate = GlobalStartDate.setDate(GlobalStartDate.getDate() + 1)

        $scope.customDateConfig = {
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

    }])

})(angular);
