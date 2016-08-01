(function(){
angular
  .module('app', ['ui.router'])
  .config([
    '$urlRouterProvider',
    '$stateProvider',
    function (
      $urlRouterProvider,
      $stateProvider) {
    $stateProvider.state('xxx', {
        controller: 'xxx',
        controllerAs: 'vm',
        url: '/xxx',
        templateUrl: 'xxx'
    });

  }]);
})();
