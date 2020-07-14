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
		fireEmoji: "💥",
		starEmoji: "⭐",

		onInit: function () {
			let oLayout = this.getView().byId("BlockLayout");
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "localJSONModel");

			this._populateField(oLayout);
			this._loadTrapAndPointCount();
			// preload missing Images on the way out
			setTimeout(() => {
				for (let i = 0; i < 4; i++) {
					this._loadPicture(i).then(d => Log.info("preload"));
				}
			}, 0);
		},
		_populateTextCard: (x, y, oVBox) => {
			//check whether the box is located on the side or bottom
			//and this for counts the score of a row or a column
			let infix = x > y ? "Rows" : "Columns";

			oVBox.addItem(new sap.m.Text("x" + x + "y" + y + "startext").bindText({
				//use lower number
				path: "localJSONModel>/" + infix + "Points" + (y < x ? y : x)
			}));

			oVBox.addItem(new sap.m.Text("x" + x + "y" + y + "firetext").bindText({
				path: "localJSONModel>/" + infix + "Traps" + (y < x ? y : x)
			}));
		},
		_loadTrapAndPointCount: function () {

			let oModel = this.getOwnerComponent().getModel("odata");
			let oPointsModel = this.getView().getModel("localJSONModel");
			let _loader = (sPath, emoji, index, filterOn) => {
				let mParam = {
					success: function (oData) {
						oPointsModel.setProperty(sPath + index, emoji + ": " + oData.results[0].value);
					},
					error: (oError) => {
						Log.error(JSON.stringify(oError));
					},
					filters: [new Filter(filterOn, FilterOperator.EQ, index + 1)]
				};
				oModel.read(sPath, mParam);
			};
			let loadRow = (sPath, emoji, index) => {
				_loader(sPath, emoji, index, "y");
			};
			let loadColumn = (sPath, emoji, index) => {
				_loader(sPath, emoji, index, "x");
			};
			const sPathRowsPoints = "/RowsPoints";
			const sPathRowsTraps = "/RowsTraps";
			const sPathColumnsPoints = "/ColumnsPoints";
			const sPathColumnsTraps = "/ColumnsTraps";
			for (let i = 0; i < 5; i++) {
				loadRow(sPathRowsPoints, this.starEmoji, i);
				loadRow(sPathRowsTraps, this.fireEmoji, i);
				loadColumn(sPathColumnsPoints, this.starEmoji, i);
				loadColumn(sPathColumnsTraps, this.fireEmoji, i);
			}
		},
		_imageHandler: function (oEvent) {
			//infoger
			Log.debug("Image (ID) clicked: " + oEvent.getSource().getId());
			let oImage = this;
			var oView = this.getParent().getParent().getParent().getParent().getParent().getParent();
			let that = oView.getController(); //for private Method access
			let x = parseInt(this.getId().charAt(11), 10) + 1;
			let y = parseInt(this.getId().charAt(9), 10) + 1;
			//nested Promise is not good but await gives syntax errors
			that._loadValueAtPosition(x, y).then(oData => {
				//Log.debug("value for this card" + oData.value);
				that._loadPicture(oData.value).then(oDataP => {
					var oImageNew = new sap.m.Image({
						id: "flipped" + oImage.getId(),
						src: "data:image/png;base64," + oDataP.Picture,
						mode: "Background",
						height: "87px",
						width: "87px"
					});
					that._flipFromToImage(oImage, oImageNew);

				});
			});

		},
		_flipFromToImage: function (oImageFrom, oImageTo) {
			//todo add flipping animation
			oImageFrom.getParent().addItem(oImageTo);
			oImageFrom.destroy();
		},
		_loadValueAtPosition: function (x, y) {
			return new Promise((resolve, reject) => {
				// get model
				var oModel = this.getView().getModel("odata");

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

					filters: [new Filter("x", FilterOperator.EQ, x), new Filter("y", FilterOperator.EQ, y)]
				};

				sPath = "/Values";
				oModel.read(sPath, mParam);

			});

		},
		_loadPicture: function (id) {
			return new Promise((resolve, reject) => {
				let sPath = "/Pictures";

				var oModel = this.getOwnerComponent().getModel("odata");

				let lCache = oModel.getProperty(sPath + `(${id})`);
				if (lCache) {
					resolve(lCache);
				} else {
					let mParam = {
						success: function (oData) {
							Log.debug(JSON.stringify(oData));
							resolve(oData.results[0]);
						},
						error: function (oError) {
							Log.error(JSON.stringify(oError));
							reject(oError);
						},
						filters: [new Filter("PictureID", FilterOperator.EQ, id)]
					};
					oModel.read(sPath, mParam);
				}
			});
		},

		_populateField: function (oLayout) {

			this._loadPicture(99).then((oData) => {
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
							press: this._imageHandler
						});
						oVBox.addItem(oImage);
						oHBox.addItem(oVBox);
					}
					//add counter card to the end of the row
					let oVBox = new sap.m.VBox("y" + j + "x" + 6).setWidth("100%").setAlignItems("Start");

					this._populateTextCard(6, j, oVBox);

					oHBox.addItem(oVBox);
					oLayout.addItem(oHBox);
				}
				//build bottom row and add empty Box for spacing
				let oHBox = new sap.m.HBox("y" + 6).setWidth("100%").setAlignItems("Center");
				for (let i = 0; i < 5; i++) {
					let oVBox = new sap.m.VBox("y" + 6 + "x" + i).setWidth("100%").setAlignItems("Center");
					//oVBox.addItem(new sap.m.Text().setText(starEmoji + ":" + "\n" + fireEmoji + ":"));
					this._populateTextCard(i, 6, oVBox);
					oHBox.addItem(oVBox);
				}
				let oVBox = new sap.m.VBox("y" + 6 + "x" + 6).setWidth("100%");
				oHBox.addItem(oVBox);
				oLayout.addItem(oHBox);
			});
		}

	});
});