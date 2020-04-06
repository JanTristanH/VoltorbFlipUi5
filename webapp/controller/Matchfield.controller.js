let fireEmoji = "💥";
let starEmoji = "⭐";
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/base/Log"

], function (Controller, MessageToast, Log) {
	"use strict";

	return Controller.extend("ZTHE.ZTHE_VOLTORB_FLIP.controller.matchfield", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZTHE.ZTHE_VOLTORB_FLIP.view.matchfield
		 */

		onInit: function () {
			let oLayout = this.getView().byId("BlockLayout");

			this._populateField(this, oLayout);
		},
		_imageHandler: function (oEvent) {
			//infoger
			Log.info("Image (ID) clicked: " + oEvent.getSource().getId());
		},

		_loadPicture: (that, id) => {
			return new Promise((resolve, reject) => {
				// get model
				var oModel = that.getOwnerComponent().getModel("odata");

				// set path with primary keys in a String
				var sPath;
				let mParam = {
					success: function (oData) {
						Log.info(JSON.stringify(oData));
						//weired Northwind file format! remove later
						//	oData.Picture = oData.Picture.substr(104);
						resolve(oData);
					},
					error: function (oError) {
						Log.info(JSON.stringify(oData));
						reject(oError);
					}

				};

				sPath = "/Categories(" + id + ")";
				oModel.read(sPath, mParam);

			});
		},

		_populateField: (that, oLayout) => {

			that._loadPicture(that, 1).then((oData) => {
				//build 5 rows with 5 "Gamecards" and one info Card
				for (let j = 0; j < 5; j++) {
					let oBlockLayoutRow = new sap.m.HBox("y" + j).setWidth("100%").setAlignItems("Center");
					for (let i = 0; i < 5; i++) {
						let oBlockLayoutCell = new sap.m.VBox("y" + j + "x" + i).setWidth("100%").setAlignItems("Center");
						var oImage = new sap.m.Image({
							id: "imageAt_y" + j + "X" + i,
							src: "data:image/png;base64," + oData.Picture,
							mode: "Background",
							height: "87px",
							width: "87px",
							press: that._imageHandler
						});
						oBlockLayoutCell.addItem(oImage);
						oBlockLayoutRow.addItem(oBlockLayoutCell);
					}
					//add counter card to the end of the row
					let oBlockLayoutCell = new sap.m.VBox("y" + j + "x" + 6).setWidth("100%");
					oBlockLayoutCell.addItem(new sap.m.Text().setText(starEmoji + ":5" + "\n" + fireEmoji)).setAlignItems("Start");
					oBlockLayoutRow.addItem(oBlockLayoutCell);
					oLayout.addItem(oBlockLayoutRow);
				}
				//build bottom row and add empty Box for spacing
				let oBlockLayoutRow = new sap.m.HBox("y" + 6).setWidth("100%").setAlignItems("Center");
				for (let i = 0; i < 5; i++) {
					let oBlockLayoutCell = new sap.m.VBox("y" + 6 + "x" + i).setWidth("100%").setAlignItems("Center");
					oBlockLayoutCell.addItem(new sap.m.Text().setText(starEmoji + ":5" + "\n" + fireEmoji));
					oBlockLayoutRow.addItem(oBlockLayoutCell);
				}
				let oBlockLayoutCell = new sap.m.VBox("y" + 6 + "x" + 6).setWidth("100%");
				oBlockLayoutRow.addItem(oBlockLayoutCell);
				oLayout.addItem(oBlockLayoutRow);
			});
		},

		onShowHello: function () {
			// read msg from i18n model
			//var oBundle = this.getView().getModel("i18n").getResourceBundle();
			//var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			//var sMsg = oBundle.getText("helloMsg", [sRecipient]);
			// show message
			MessageToast.show("Aloh");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ZTHE.ZTHE_VOLTORB_FLIP.view.matchfield
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ZTHE.ZTHE_VOLTORB_FLIP.view.matchfield
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ZTHE.ZTHE_VOLTORB_FLIP.view.matchfield
		 */
		//	onExit: function() {
		//
		//	}

	});

});