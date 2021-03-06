/**
 * Created by KK on 10/18/16.
 */
import Login from "./login.controller";
import DashboardLoader from "./dashboard.loader";
import DataManger from "./data.manager";
import InitialDataLoader from "./init.data.loader";

(function () {
    "use strict";
    let viewLoader = require('./view.loading');
    let dataManager = new DataManger();
    let mapViewGenerator = require("./map.controller");

    let contentNodeId = "div#contentToPush";
    let bodyNode = null;
    let qtController = null;

    function QtController() {
        this.loginPageContent = "views/loginPage.html";
        this.dashboardContainerContent = "views/dbContainer.html";
    }

    QtController.prototype.loadLoginPage = function () {
        $.get(this.loginPageContent, function (data) {
            $(contentNodeId).html(data);
            new Login(qtController);
        });
    };

    QtController.prototype.loadDashboardPage = function () {
        console.log("Loading dashboard page");

        $.get(this.dashboardContainerContent, function (data) {
            $(contentNodeId).html(data);
            addHashChangeEvent();
        });

        let dashboardLoader = new DashboardLoader(qtController, bodyNode);
        dashboardLoader.loadDashboard();
        let initialDataLoader = new InitialDataLoader(dataManager);
        initialDataLoader.loadInitialData();
    };


    $(document).ready(function () {
        $(window).resize(function () {
            //setDivHeight();
        });
        bodyNode = $("body");
        qtController = new QtController();
        qtController.loadLoginPage();

        $(document).on('click', "[data-toggle='open-new-driver']", function () {
            $("#modal-New-driver").modal('show');
        });

        $(document).on('click', "[data-toggle='driver-profile']", function () {
            var driverId = $(this).data('driver-id');
            $("#modal-driver-profile").modal('show');

            $("#modal-driver-profile .show-after-loading").putTemplate("#template-driver-profile", '');

        });


        $(document).ready(function () {
            $(document).on('click', "#expand-compress-icon", function (e) {
                e.preventDefault();
                $("#compressed-with-map").show();
                $("#expand-without-map").removeClass('col-sm-12').addClass('col-sm-6');
                mapViewGenerator.initQTMap(40.730610, -73.935242);
                mapViewGenerator.showActorsOnMap(dataManager.getActorPointsData());


            });
            $(document).on('change', "[name='email-setting']", function () {
                alert('button change working');
            });
            $(document).on('change', "input[type=radio]", function () {
                alert('button change working');
            });


            $(document).on('click', "#locationChange", function (e) {
                e.preventDefault();
                var dataToShow;
                $('#currencyDiv').hide();
                $("#menuDivDropdown").putTemplate("#template-location-change", dataToShow);
                var position = $("#dashboardDiv").offset();
                $("#dashboardDiv").height($(document).innerHeight() - position.top);
            });


            $(document).on('click', "#propicChange", function (e) {
                e.preventDefault();
                $('#currencyDiv').hide();
                var dataToShow;
                var src = $(this).attr('value');

                $("#menuDivDropdown").putTemplate("#template-propic-change", dataToShow);
                var position = $("#dashboardDiv").offset();
                $("#dashboardDiv").height($(document).innerHeight() - position.top);
                if (src !== "" && src !== null)
                    $("#setPicture").attr('src', src);
            });

            $(document).on('click', "#passChange", function (e) {
                e.preventDefault();
                $('#currencyDiv').hide();
                var dataToShow;
                $("#menuDivDropdown").putTemplate("#template-password-change", dataToShow);
                var position = $("#dashboardDiv").offset();
                $("#dashboardDiv").height($(document).innerHeight() - position.top);
            });


            //cancel button in menus
            $(document).on('click', "[data-task='profile']", function (e) {
                e.preventDefault();
                viewLoader.loadView('accountInfo');
            });

        });
        var $window = $(window),
            $body = $('body');

        $('.nav')
            .append('<a href="#" class="close"></a>')
            .appendTo($body)
            .panel({
                delay: 500,
                hideOnClick: true,
                hideOnSwipe: true,
                resetScroll: true,
                resetForms: true,
                side: 'right',
                target: $body,
                visibleClass: 'is-menu-visible'
            });


    });


    function addBackToPrevHashEvent() {
        $(document).on('click', "[data-task='back']", function (e) {
            e.preventDefault();
            history.back();
        });
    }

    function addHashChangeEvent() {
        window.addEventListener("hashchange", hashChanged, false);
        viewLoader.initialize(dataManager);
    }

    function hashChanged() {
        var newHash = location.hash;
        var loadUrl = newHash.substring(1);

        if (!loadUrl) {
            viewLoader.loadView('dashboard');

        } else if (loadUrl === 'dashboard' || loadUrl === 'map') {
            $("#navbarUnderline").hide();
            viewLoader.loadView(loadUrl);
        } else {
            $("#navbarUnderline").show();
            viewLoader.loadView(loadUrl);
        }
    }

    function setDivHeight() {
        var div1Height = $("body").height();
        var position = $("#dashboardDiv").offset();

        $(".dashboardButtonsContainer").height(div1Height - position.top);
    }
}());