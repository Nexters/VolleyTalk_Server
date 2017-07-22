var Sequelize = require('sequelize');
var config = require('../config/config.json');
var sequelize = null;

exports.init = function(app) {
    sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.config);
    app.set('sequelize', sequelize);
    app.set('models', registModels(sequelize));
};

var registModels = function(sequelize) {
    var Team = sequelize.import(__dirname +'/../models/tb_teams');

    return {
        Team: Team
    };
};
