module.exports = {
    /**
     * set the application routes with their name defined as a constant
     * @example "url/:id": "name"
     */
    ROUTE_ROUTES: {
        //"todos": 'todos',
        // "flickr": 'flickr',
        // "flickr/:query": 'flickr',
        "help": 'help',
        // "topic": 'todos',
        "topic/:id": 'topic',
        "todos/:id": 'todos',
        "users/:id": 'users'

    },

    // default route when undefined
    ROUTE_DEFAULT: 'index'
};
