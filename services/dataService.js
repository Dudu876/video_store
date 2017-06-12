myApp.service('dataService', ['$http', '$q', function($http, $q) {
    const searchapi = '/api/search';
    const listapi = '/api/list/';

    let _ticket;

    this.search = (params) => {
        return $http.get(searchapi, { params });
    };

    this.getPage = (page) => {
        return $http.get(searchapi, { params: { page } });
    }

    this.getLists = () => {
        let deferred = $q.defer();
        $q.all([
            $http.get(listapi + 'categories'),
            $http.get(listapi + 'languages'),
            $http.get(listapi + 'actors')
        ]).then((data) => {
            deferred.resolve({
                categories: data[0].data,
                languages: data[1].data,
                actors: data[2].data
            });
        }).catch((err) => deferred.reject(err));

        return deferred.promise;
    }

    this.updateTicket = (ticketData) => {
        ticketData.authToken = token;
        return $http.post(editurl, ticketData);
    }
}]);