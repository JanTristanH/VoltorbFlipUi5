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
			this.populateField(oLayout);
		},

		populateField: (oLayout) => {

			for (let j = 0; j < 5; j++) {
				let oBlockLayoutRow = new sap.ui.layout.BlockLayoutRow("y" + j);
				for (let i = 0; i < 5; i++) {
					let oBlockLayoutCell = new sap.ui.layout.BlockLayoutCell("y" + j + "x" + i);
					oBlockLayoutCell.setTitle("Cell from Controller");
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