myApp.controller('mainCtrl', ['$scope', '$timeout', 'dataService', function($scope, $timeout, dataService) {

    $scope.page = 0;
    $scope.search = { category: '' };
    $scope.auto = {};
    $scope.totalItems = 0;
    $scope.currentPage = 0;

    $scope.actsel = (selection) => {
        $scope.search.actor = selection.name;
    }
    $scope.langsel = (selection) => {
        $scope.search.language = selection.name;
    }
    $scope.catsel = (selection) => {
        $scope.search.category = selection.name;
    }

    dataService.getLists().then((lists) => {
        $scope = Object.assign($scope, lists);
        console.log(lists);
    })

    $scope.go = (search) => {
        dataService.search(search).then((data) => {
            console.log(data);
            $scope.films = data.data.results;
            $scope.totalItems = data.data.total;
        }).catch((err) => {
            console.error(err);
        });
    }

    $scope.$watch("search", function() {
        $timeout(() => $scope.go($scope.search), 1);
    }, true);

    $scope.pageChanged = () => {
        dataService.getPage($scope.currentPage).then((data) => {
            console.log(data);
            $scope.films = data.data;
        });
    }

}]);