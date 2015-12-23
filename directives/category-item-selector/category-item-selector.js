'use strict';
angular.module('directives.category-item-selector',[])

.directive('categoryItemSelector', ['$timeout', function ($timeout) {
    var template =
    '<div class="category-item-selector-wrapper"> \
        <div class="category-selector-label"> \
            <button class="category-item-btn" \
                    ng-bind="label" \
                    ng-click="openCloseSelector()"> \
            </button> \
        </div> \
        <div layout="column" \
             ng-show="isCategoryDisplayed" \
             class="category-selector"> \
            <div class="categories"> \
                <md-radio-group \
                    ng-model="selectedCategory"> \
                        <md-radio-button \
                             class="category md-primary" \
                             ng-repeat="category in categories" \
                             ng-value="category.category" \ \
                             ng-style="{\'display\':\'inline\'}"> \
                             {{::category.category}} \
                        </md-radio-button> \
                </md-radio-group> \
            </div> \
            <div class="category-items"> \
                <md-checkbox \
                    class="items md-primary" \
                    ng-repeat="item in items" \
                    ng-model="items[selectedCategory][item.label]" \
                    aria-label="item.label" \
                    ng-init="items[selectedCategory][item.label]=item.value" \
                    ng-style="{\'display\':\'block\'}"> \
                {{::item.label}} \
            </div> \
            <div class="action-buttons"> \
                <button class="category-item-btn save" ng-click="save()">Save</button> \
                <button class="category-item-btn cancel" ng-click="cancel()">Cancel</button> \
            </div> \
        </div> \
    </div>';
    return {
        restrict: 'E',
        template: template,
        scope: {
            /**
            *   config = [
            *       {
            *           category: 'string',
            *           items: [
            *               {
            *                   label: 'string',
            *                   value: bool
            *               }...
            *           ]
            *       }...
            *   ]
            **/
            config: '=',
            defaultCategory: '@',
            label: '@'
        },
        link: function (scope, elem, attrs, ngModel) {
            var getDefaultCategory = function () {
                    var configLength = scope.config.length,
                        category = scope.defaultCategory,
                        index = 0;

                    if (   scope.defaultCategory
                        && scope.defaultCategory.length > 0) {
                        for (var i = 0; i < configLength; i++) {
                            if (scope.config[i].category == category) {
                                index = i;
                                break;
                            }
                        }
                    }

                    return index;
                },
                loadCategoryItems = function () {
                    var itemsLength = scope.categories.length,
                        category = scope.selectedCategory,
                        items = [];

                        for (var i = 0; i < itemsLength; i++) {
                            if (scope.categories[i].category == category) {
                                items = scope.categories[i].items;
                                break;
                            }
                        }
                    return items;
                },
                openCloseSelector = function () {
                    scope.isCategoryDisplayed = !scope.isCategoryDisplayed;

                    if (scope.isCategoryDisplayed) {
                        scope.reserveCopy = angular.copy(scope.config);
                    }
                },
                save = function () {
                    var configLength = scope.config.length,
                        category = scope.selectedCategory;

                    for (var i = 0; i < configLength; i++) {
                        if (scope.config[i].category == category) {
                            var items = scope.config[i].items,
                                itemsLength = items.length;


                            for (var x = 0; x < itemsLength; x++) {
                                var label = items[x].label;

                                scope.config[i].items[x].value =
                                    scope.items[category][label];
                            }
                        }
                    }
                    scope.isCategoryDisplayed = false;
                },
                cancel = function () {
                        scope.isCategoryDisplayed = false;
                        scope.categories = scope.reserveCopy;
                },
                reserveCopy,
                defaultCatIndex = getDefaultCategory();

            scope.cancel = cancel;

            scope.save = save;

            scope.categories = angular.copy(scope.config);

            scope.selectedCategory = scope.categories[defaultCatIndex].category;

            scope.openCloseSelector = openCloseSelector;

            scope.isCategoryDisplayed = false;


            scope.$watch('selectedCategory', function () {
                scope.items = loadCategoryItems();
            });
            // $("*").on('click', function(event) {
            //     if (scope.displaySelector) {
            //         if(    event.target.nodeName != 'svg'
            //             && !$(event.target).closest(elem).length) {
            //             prepareDataChanges();
            //             scope.onChange();
            //             scope.displaySelector = false;
            //         }
            //     }
            // });
        }
    }
}]);