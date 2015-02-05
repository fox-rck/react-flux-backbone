var forceAlerts = false;
module.exports={
/* Basic centalized logging function
 * so you can always toggle it all off
*/
	log:function(val){
		if(forceAlerts){
			alert(val);
		} else {
			console.log(val);
		}
	}
}