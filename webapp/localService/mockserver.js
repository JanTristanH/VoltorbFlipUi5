sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/util/UriParameters",
	"./gameGenerator"
], function (MockServer, UriParameters, Game) {
	"use strict";

	return {
		init: function () {
			// create
			var oMockServer = new MockServer({
				// eslint-disable-next-line
				//rootUri: "https://services.odata.org/V2/Northwind/Northwind.svc/"
				rootUri: "/destinations/northwind/V2/Northwind/Northwind.svc/"
			});

			var oUriParameters = new UriParameters(window.location.href);

			// configure mock server with a delay
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: oUriParameters.get("serverDelay") || 500
			});

			// simulate
			var sPath = "../localService";
			oMockServer.simulate(sPath + "/metadata.xml", sPath + "/mockdata");
			this._loadGame(oMockServer);
			// start
			oMockServer.start();
		},
		_loadGame: function (oMockServer) {

			let aRequests = oMockServer.getRequests();
			debugger
			aRequests.push({
				method: "GET",
				path: new RegExp("(.*)Order(.*)"),
				response: function (oXhr, sUrlParams) {
					debugger;
					//sUrlParams
					Game.newGame();
					var oResponse = {
						data: {}, //call corresponding game here
						headers: {
							"Content-Type": "application/json;charset=utf-8",
							"DataServiceVersion": "1.0"
						},
						status: "204",
						statusText: "No Content"
					};
					oXhr.respond(oResponse.status, oResponse.headers, JSON.stringify({
						d: oResponse.data
					}));
				}
			});

			oMockServer.setRequests(aRequests);

		}

	};

});