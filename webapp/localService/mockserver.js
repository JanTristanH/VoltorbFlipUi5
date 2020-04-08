sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/base/util/UriParameters",
	"./gameGenerator"
], function (MockServer, UriParameters, Game) {
	"use strict";

	return {
		init: function () {

			Game.newGame(1);
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
		_loadGame: (oMockServer) => {
			let spliceXnYOut = (s) => {
				let params = s.split("filter=")[1].split("%20");
				let obj = {};
				obj.x = params[params.indexOf("x") + 2];
				obj.y = params[params.indexOf("y") + 2];
				return obj;
			};
			//todo streamline forwarding function
			//add value request
			let fnValue = (oEvent) => {
				var oXhr = oEvent.getParameter("oXhr");
				let coordinates = spliceXnYOut(oXhr.url);
				oEvent.getParameter("oFilteredData").results = [{
					value: Game.valueAt(coordinates.x, coordinates.y)
				}];
			};
			oMockServer.attachAfter("GET", fnValue, "Values");
			//add point request row
			let fnRowPoints = (oEvent) => {
				var oXhr = oEvent.getParameter("oXhr");
				let coordinates = spliceXnYOut(oXhr.url);
				oEvent.getParameter("oFilteredData").results = [{
					value: Game.getRowPoints(coordinates.y)
				}];
			};
			oMockServer.attachAfter("GET", fnRowPoints, "RowsPoints");
			//add Trap request row
			let fnRowTraps = (oEvent) => {
				var oXhr = oEvent.getParameter("oXhr");
				let coordinates = spliceXnYOut(oXhr.url);
				oEvent.getParameter("oFilteredData").results = [{
					value: Game.getRowTraps(coordinates.y)
				}];
			};
			oMockServer.attachAfter("GET", fnRowTraps, "RowsTraps");

			//add point request column
			let fnColumnPoints = (oEvent) => {
				var oXhr = oEvent.getParameter("oXhr");
				let coordinates = spliceXnYOut(oXhr.url);
				oEvent.getParameter("oFilteredData").results = [{
					value: Game.getColumnPoints(coordinates.x)
				}];
			};
			oMockServer.attachAfter("GET", fnColumnPoints, "ColumnPoints");
			//add Trap request Column
			let fnColumnTraps = (oEvent) => {
				var oXhr = oEvent.getParameter("oXhr");
				let coordinates = spliceXnYOut(oXhr.url);
				oEvent.getParameter("oFilteredData").results = [{
					value: Game.getColumnTraps(coordinates.x)
				}];
			};
			oMockServer.attachAfter("GET", fnColumnTraps, "ColumnTraps");

		}

	};

});