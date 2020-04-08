let fireEmoji = "💥";
let starEmoji = "⭐";
let pictureCache = [];
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/base/Log",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"

], function (Controller, MessageToast, Log, Filter, FilterOperator, JSONModel) {
	"use strict";

	return Controller.extend("ZTHE.ZTHE_VOLTORB_FLIP.controller.matchfield", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZTHE.ZTHE_VOLTORB_FLIP.view.matchfield
		 */

		onInit: function () {
			let oLayout = this.getView().byId("BlockLayout");
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "points");

			this._populateField(this, oLayout);
			this._loadTrapAndPointCount(this);
			//todo preload missing Images on the way out
		},
		_populateTextCard: (x, y, oVBox) => {
			//todo bookmark
			oVBox.addItem(new sap.m.Text("x" + x + "y" + y + "startext").bindText({
				path: "points>/RowsPoints" + y
			}));

			oVBox.addItem(new sap.m.Text("x" + x + "y" + y + "firetext").bindText({
				path: "points>/RowsTraps" + y
			}));
		},
		_loadTrapAndPointCount: (that) => {
			let oModel = that.getOwnerComponent().getModel("odata");
			let oPointsModel = that.getView().getModel("points");
			let loadRow = (sPath, emoji, index) => {
				let mParam = {
					success: function (oData) {
						let obj = {};
						obj[`${sPath.slice(1)}${index}`] = emoji + ": " + oData.results[0].value;
						oPointsModel.setData(obj, true);
					},
					error: (oError) => {
						Log.error(JSON.stringify(oError));
					},
					filters: [new Filter("y", FilterOperator.EQ, index + 1)]
				};

				oModel.read(sPath, mParam);

			};
			const sPathRowsPoints = "/RowsPoints";
			const sPathRowsTraps = "/RowsTraps";
			for (let y = 0; y < 5; y++) {
				loadRow(sPathRowsPoints, starEmoji, y);
				loadRow(sPathRowsTraps, fireEmoji, y);
			}
		},
		_imageHandler: function (oEvent) {
			//infoger
			Log.info("Image (ID) clicked: " + oEvent.getSource().getId());
			let oImage = this;
			var oView = this.getParent().getParent().getParent().getParent().getParent().getParent();
			let that = oView.getController(); //for private Method
			let x = parseInt(this.getId().charAt(11), 10) + 1;
			let y = parseInt(this.getId().charAt(9), 10) + 1;
			//nested Promise bad
			that._loadValueAtPosition(oView, x, y).then(oData => {
				//Log.info("value for this card" + oData.value);
				that._loadPicture(that, oData.value).then(oDataP => {
					var oImageNew = new sap.m.Image({
						id: "flipped" + oImage.getId(),
						src: "data:image/png;base64," + oDataP.Picture,
						mode: "Background",
						height: "87px",
						width: "87px"
							//,press: that._imageHandler
					});
					that._flipFromToImage(oImage, oImageNew);
					//	oImage.setSrc("data:image/png;base64," + oDataP.Picture);
				});
			});

		},
		_flipFromToImage: (oImageFrom, oImageTo) => {
			//todo add flipping animation
			oImageFrom.getParent().addItem(oImageTo);
			oImageFrom.destroy();
		},

		_loadValueAtPosition: (that, x, y) => {
			return new Promise((resolve, reject) => {
				// get model
				var oModel = that.getModel("odata");

				// set path with primary keys in a String
				var sPath;
				let mParam = {
					success: function (oData) {
						Log.debug(JSON.stringify(oData));
						resolve(oData.results[0]);
					},
					error: function (oError) {
						Log.error(JSON.stringify(oError));
						reject(oError);
					},
					/*urlParameters: new Map([
						['x', x],
						['y', y]
					])
*/
					filters: [new Filter("x", FilterOperator.EQ, x), new Filter("y", FilterOperator.EQ, y)]
				};

				sPath = "/Values";
				oModel.read(sPath, mParam);

			});

		},
		_loadPicture: (that, id) => {
			return new Promise((resolve, reject) => {
				let a = pictureCache.filter(e => e.PictureID === id);
				if (a.length > 0) {
					resolve(a[0]);
				} else {

					// get model
					var oModel = that.getOwnerComponent().getModel("odata");

					// set path with primary keys in a String
					var sPath;
					let mParam = {
						success: function (oData) {
							Log.info(JSON.stringify(oData));
							pictureCache.push(oData.results[0]);
							resolve(oData.results[0]);
						},
						error: function (oError) {
							Log.error(JSON.stringify(oError));
							reject(oError);
						},
						// urlParameters: new Map([
						// 	['id', id]
						// ])
						filters: [new Filter("PictureID", FilterOperator.EQ, id)]

					};

					sPath = "/Pictures";

					oModel.read(sPath, mParam);

				}
			});
		},

		_populateField: (that, oLayout) => {

			that._loadPicture(that, 99).then((oData) => {
				//build 5 rows with 5 "Gamecards" and one info Card
				for (let j = 0; j < 5; j++) {
					let oHBox = new sap.m.HBox("y" + j).setWidth("100%").setAlignItems("Center");
					for (let i = 0; i < 5; i++) {
						let oVBox = new sap.m.VBox("y" + j + "x" + i).setWidth("100%").setAlignItems("Center");
						var oImage = new sap.m.Image({
							id: "imageAt_y" + j + "X" + i,
							src: "data:image/png;base64," + oData.Picture,
							mode: "Background",
							height: "87px",
							width: "87px",
							press: that._imageHandler
						});
						oVBox.addItem(oImage);
						oHBox.addItem(oVBox);
					}
					//add counter card to the end of the row
					let oVBox = new sap.m.VBox("y" + j + "x" + 6).setWidth("100%").setAlignItems("Start");
					//todo these numbers could be bound
					that._populateTextCard(6, j, oVBox);

					oHBox.addItem(oVBox);
					oLayout.addItem(oHBox);
				}
				//build bottom row and add empty Box for spacing
				let oHBox = new sap.m.HBox("y" + 6).setWidth("100%").setAlignItems("Center");
				for (let i = 0; i < 5; i++) {
					let oVBox = new sap.m.VBox("y" + 6 + "x" + i).setWidth("100%").setAlignItems("Center");
					oVBox.addItem(new sap.m.Text().setText(starEmoji + ":" + "\n" + fireEmoji + ":"));
					oHBox.addItem(oVBox);
				}
				let oVBox = new sap.m.VBox("y" + 6 + "x" + 6).setWidth("100%");
				oHBox.addItem(oVBox);
				oLayout.addItem(oHBox);
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