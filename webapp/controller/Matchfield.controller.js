sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/base/Log",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"

], function (Controller, MessageToast, Log, Filter, FilterOperator, JSONModel) {
	"use strict";

	const localModelName = "localJSONModel";
	const backImageId = 99;

	//make backend give you row and column count
	//backend idea could be improved upon
	return Controller.extend("ZTHE.ZTHE_VOLTORB_FLIP.controller.matchfield", {
		fireEmoji: "💥",
		starEmoji: "⭐",

		onInit: function () {
			let oModel = new JSONModel();
			this.getView().setModel(oModel, localModelName);

			this._populateField();
			// preload missing Images on the way out
			setTimeout(() => {
				for (let i = 0; i < 4; i++) {
					this._promisePicture(i).then(d => Log.info("preload"));
				}
			}, 0);
		},

		onAfterRendering: function () {
			this._loadTrapAndPointCount();
		},

		_populateTextCard: function (x, y, oVBox) {
			//check whether the box is located on the side or bottom
			//and this for counts the score of a row or a column
			let infix = x > y ? "Rows" : "Columns";

			oVBox.addItem(new sap.m.Text("x" + x + "y" + y + "startext").bindText({
				//use lower number
				path: localModelName + ">/" + infix + "Points" + (y < x ? y : x)
			}));

			oVBox.addItem(new sap.m.Text("x" + x + "y" + y + "firetext").bindText({
				path: localModelName + ">/" + infix + "Traps" + (y < x ? y : x)
			}));
		},

		//should be one request
		_loadTrapAndPointCount: function () {
			let oModel = this.getView().getModel("odata"); 
			let oPointsModel = this.getView().getModel(localModelName);
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

		_promiseValueAtPosition: function (x, y) {
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

		_promisePicture: function (id) {
			return new Promise((resolve, reject) => {
				let sPath = "/Pictures";
				let oModel = this.getOwnerComponent().getModel("odata");
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

		_onImagePress: function (x, y, something, oEvent) {
			//infoger
			Log.debug("Image (ID) clicked: " + oEvent.getSource().getId());
			let oImage = oEvent.getSource();

			//nested Promise is not good but await gives syntax errors
			this._promiseValueAtPosition(x + 1, y + 1).then(oData => {
				//Log.debug("value for this card" + oData.value);
				this._promisePicture(oData.value).then(oDataP => {
					//try changing src of existing image
					oImage.setSrc("data:image/png;base64," + oDataP.Picture);
				});
			});

		},

		_populateField: function () {
			let oLayout = this.getView().byId("BlockLayout");

			this._promisePicture(backImageId).then((oData) => {
				this._buildPlayableRows(oLayout, oData);

				let oInfoRow = this._buildInfoRow();
				let oSpacingRow = this._buildSpacingRow(oInfoRow);

				oInfoRow.addItem(oSpacingRow);
				oLayout.addItem(oInfoRow);
			});
		},

		_buildPlayableRows: function (oLayout, oData) {
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
						press: this._onImagePress.bind(this, i, j, "foo")
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
		},

		_buildInfoRow: function () {
			let oHBox = new sap.m.HBox("y" + 6).setWidth("100%").setAlignItems("Center");
			for (let i = 0; i < 5; i++) {
				let oVBox = new sap.m.VBox("y" + 6 + "x" + i).setWidth("100%").setAlignItems("Center");
				//oVBox.addItem(new sap.m.Text().setText(starEmoji + ":" + "\n" + fireEmoji + ":"));
				this._populateTextCard(i, 6, oVBox);
				oHBox.addItem(oVBox);
			}

			return oHBox;
		},

		_buildSpacingRow: function () {
			return new sap.m.VBox("y" + 6 + "x" + 6).setWidth("100%");
		}
	});
});