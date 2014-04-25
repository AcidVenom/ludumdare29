/* 
 * @name State Manager
 * @description This is used to switch between different game states
 * so that we can easily manage objects
 * @author Daniël Konings
 */
var StateManager = {
	__state: null,
	__states: {},

	// Returns the current state
	getState: function()
	{
		return this.__state;
	},

	/* Switches the state to another state by name,
	 * destroying the previous one if it exists
	 */
	switchState: function(name)
	{
		if (this.__state != null)
		{
			this.__state.destroy();
		}

		this.__state = this.__states[name];
		if(typeof(this.__state) == "undefined")
		{
			throw "State doesn't exist";
		}
		this.__state.initialise();
	},

	// Adds a state to the state manager
	addState: function(obj)
	{
		this.__states[obj.name] = obj;
	},

	// Updates the state
	updateState: function(data)
	{
		this.__state.update(data);
	}
};

// StateManager.addState({
//  name: "levelState1",

//  initialise: function()
//     {
//         console.log("Switched to level 1");
//     },

//     update: function()
//     {

//     },

//     destroy: function()
//     {
//         console.log("Destroyed level 1");
//     },

//  enemies: [],
//  poepjes: []
// });