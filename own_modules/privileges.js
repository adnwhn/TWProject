
/**
 @typedef Privileges
 @type {Object}
 @property {Symbol} viewUsers Privilege to enter the page with the user table.
 @property {Symbol} deleteUsers Privilege to delete users
 @property {Symbol} buyProducts Privilege to buy products
 @property {Symbol} viewCharts Privilege to see the sells charts

 @property {Symbol} addProducts Privilege to add new products to sell
 @property {Symbol} deleteProducts Privilege to delete products that can no longer be sold
 @property {Symbol} updateProducts Privilege to edit existent products (update the specs of a product)
 */


/**
 * @name module.exports.Privileges
 * @type Privileges
 */
const Privileges = {
	viewUsers: Symbol("viewUsers"),
	deleteUsers: Symbol("deleteUsers"),
	buyProducts: Symbol("buyProducts"),
	viewCharts: Symbol("viewCharts"),

	addProducts: Symbol("addProducts"),
	deleteProducts: Symbol("deleteProducts"),
	updateProducts: Symbol("updateProducts")
}

module.exports=Privileges;