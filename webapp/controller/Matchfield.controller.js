sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"

], function (Controller, MessageToast) {
	"use strict";

	return Controller.extend("ZTHE.ZTHE_VOLTORB_FLIP.controller.matchfield", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ZTHE.ZTHE_VOLTORB_FLIP.view.matchfield
		 */

		onInit: function () {
			let oLayout = this.getView().byId("BlockLayout");
			this._populateField(oLayout);
		},
		_populateField: (oLayout) => {
			for (let j = 0; j < 5; j++) {
				let oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow("y" + j);
				for (let i = 0; i < 5; i++) {
					let oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell("y" + j + "x" + i);
					var oImage = new sap.m.Image({
						src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFcAAABXCAYAAABxyNlsAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAASdEVYdFNvZnR3YXJlAEdyZWVuc2hvdF5VCAUAAAPXSURBVHhe7Z3balNBFIaDFRGsIAjSNk3SnHqwIL6A4J3gK3ihOTbP4JVWq1ZTW7Uea9U3Xa5/x8SUDhqT+feW8l98d8nea76ZWTuwVmbnyrWqnZubEwRypUrZcrmcYDCUe6G8aFdbd8Ws3L9zWu7FzRVbfPRAzMjCw3sZyn38wJa2nSeN9Nhu2KLfE/cOxhSRzORikPmdhhVeNK30smWlfgq8allxt2XLz5qWd9GhuGKSnVwfXCL2ddsq7zpWOeymQvmgY0WXDMGhuGKSnVxftaV+26o+4NWjLVs97vH52rP6p4HgZZ/YBXJqyExufmewaqsfurb2rWcbP/isf3fBX7as/LZjBU8PkhsRySUiuUQkl4jkEpFcIpJLRHKJSC4RySUiuUQkl4jkEpFcIpJLRHKJSC6R/1YuAokFKq+oYZ2Q6wNPg3G5qDyH4puWU87+JhdV2qWnDcu7DNSdYlF82bKVfZf7rmO1j92ktpUGtfddq7xpW7HfDsY1EzuD8v2wbP9nuf6hvIst7DZtZa9t5QMGnQH7KZHcLxTHjPhCKaCq/Lw56I34m9wll1vwD0MsqrT1z1vRqHk6qLzpWMmvjVnHfdhg4KMdc9jxlRyObSp8V5R9PLj+sCfiz3I9J6G3AF/CBfBAiAVyX8VzH4JJUo9PZBog1694rsfkrnuuD8U2DWvHPat6yintuVxPD5PJ9ZSQyHUZoSfwtJyU+/shwGbZf6VAbt3lbkT8lYKJwoRJruRykFwikktEcolILhHJJSK5RCSXiOQSkVwikktEcolILhHJJSK5RCSXiOQSkVwikktEcolILhHJJSK5RP4vuWMdN+hGXEN3yYygQ+WEXJw9E+iOiY6PBw2FkAsR68fh+KbCr1VBx03f5T6dRK4HlLR69gdHpaAbMRZo/Rn2ihVccPEFH7SN4pyb8e7KaPhkoSEPZ+hM1Cs26nL01QvBCComgw7BTrIzIDoNcK9hV2Iopqnx3YBFgsU4UZdjsnrRJOczgTyCL8YCqwhBJd2GnnJWUwIrbNSfi87HQGzTgHSDhZiI9UU5kdxxFiKR7Ah/sGTdWT6SEIlTvv5Fbkz0nwgikktEcolILhHJJSK5RCSXiOQSkVwikktEcolILhHJJSK5RCSXiOQSkVwikksE74nAyzBQXseA60e9VEiqtPuD00nOrtwnv6rKODsHFVmXnAouFlVa7JxQXDHJTu7jRlItTc6d2W36gFPCJ3R0ilIgrphkJhdgWw47YVIDqWBIIKaYZCr3rBOUe/7aFbt8+6aYkflbN07LFQTWNq/bpcvzIjrz9hOWLKljK3yJ7QAAAABJRU5ErkJggg==",
						mode: "Background",
						height: "87px",
						width: "87px",
						press: function () {
							alert("InkYourCode Blog");
						}
					});
					oBlockLayoutCell.addContent(oImage);
					oBlockLayoutRow.addContent(oBlockLayoutCell);
				}
				//add counter card to the end of the row
				let oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell("y" + j + "x" + 6);
				oBlockLayoutCell.setTitle("⭐:5\n💥:1");
				oBlockLayoutRow.addContent(oBlockLayoutCell);
				oLayout.addContent(oBlockLayoutRow);
			}
			let oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow("y" + 6);
			for (let i = 0; i < 5; i++) {
				let oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell("y" + 6 + "x" + i);
				oBlockLayoutCell.setTitle("⭐:5\n💥:1");
				oBlockLayoutRow.addContent(oBlockLayoutCell);
			}
			let oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell("y" + 6 + "x" + 6);
			oBlockLayoutRow.addContent(oBlockLayoutCell);
			oLayout.addContent(oBlockLayoutRow);

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