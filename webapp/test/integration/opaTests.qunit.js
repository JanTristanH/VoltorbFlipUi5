/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ZTHE/ZTHE_VOLTORB_FLIP/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});