let app = angular.module('App', ["ui.router"]);

app.factory('Messages', function () {
    return function (lng) {

        let ruMessages = {
            form: {
                name: 'Форма логина',
                login: 'Логин',
                pw: 'Пароль',
                username: 'Имя пользователя',
                logged: 'Внутри системы'
            }
        };
        let enMessages = {
            form: {
                name: 'Login form',
                login: 'Login',
                pw: 'Password',
                username: 'Username',
                logged: 'Logged in'
            }
        };

        if (lng == 'ru')
            return ruMessages;
        else return enMessages;
    }
})


app.service('TranslateService', ['Messages', function (Messages) {

    let activeLanguage = 'ru';

    let getMessages = function () {
        return Messages(activeLanguage)
    };

    this.setLanguage = function (lng) {
        activeLanguage = lng;
        return getMessages();
    };

    this.getMessages = function () {
        return getMessages();
    }


}]);

app.service('LoginService', function () {
    let state = false;

    this.isLogged = isLogged;
    this.login = login;
    this.logout = logout;

    function isLogged() {
        return state;
    }

    function login() {
        state = true;
    }

    function logout() {
        state = false;
    }
});


app.config(function ($stateProvider) {
    var defaultState = {
        name: 'default',
        url: '',
        template: '<login></login>'
    };

    var content = {
        name: 'content',
        url: '/logout',
        template: '<logout></logout>'
    };

    $stateProvider.state(defaultState);
    $stateProvider.state(content)

});


app.component('header', {
    bindings: {},
    controller: HeaderCtrl,
    templateUrl: 'templates/header.html'
});
HeaderCtrl.$inject = ['$scope', 'TranslateService', '$rootScope'];
function HeaderCtrl($scope, TranslateService, $rootScope) {
    let $ctrl = this;
    $ctrl.lngs = [{name: 'en', type: 0},
        {name: 'ru', type: '1'}];
    $ctrl.language = $ctrl.lngs[0].name;

    let messages = TranslateService.setLanguage('ru')


    $scope.$watch(() => $ctrl.language,
        lg => {
            messages = TranslateService.setLanguage(lg)
            $rootScope.$broadcast('lng')
        }
    )
};


app.component('login', {
    bindings: {},
    controller: LoginCtrl,
    templateUrl: 'templates/login.html'
});

LoginCtrl.$inject = ['LoginService', '$state', 'TranslateService', '$rootScope'];
function LoginCtrl(LoginService, $state, TranslateService, $rootScope) {
    let $ctrl = this;
    $ctrl.form = {};

    $rootScope.$on('lng', () => $ctrl.messages = TranslateService.getMessages());

    $ctrl.messages = TranslateService.getMessages();

    $ctrl.submit = submit;
    function submit() {
        if ($ctrl.form.user && $ctrl.form.pw) {
            LoginService.login();
            $state.go('content');
        }

    };
}


app.component('logout', {
    bindings: {},
    controller: LogoutCtrl,
    templateUrl: 'templates/logout.html'
});

LogoutCtrl.$inject = ['LoginService', '$rootScope', 'TranslateService'];
function LogoutCtrl(LoginService, $rootScope, TranslateService) {
    let $ctrl = this;
    $ctrl.submit = submit;

    $rootScope.$on('lng', () => $ctrl.messages = TranslateService.getMessages());

    $ctrl.messages = TranslateService.getMessages();
    function submit() {
        LoginService.logout();
        $state.go('default')
    };
}


run.$inject = ['$transitions', 'LoginService', '$state', '$q'];
function run($transitions, LoginService, $state, $q) {


    $transitions.onStart({}, function ($transitions) {
        let to = $transitions.to().name;
        let isLogged = LoginService.isLogged();
        if (to != 'default' && !isLogged) {
            $state.go('default');
            return $q.reject();
        }
    })
}
app.run(run)

