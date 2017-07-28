//sequelize-auto -o "./models" -d volleytalk -h localhost -u root -p 3306 -x '' -e mysql
var Sequelize = require('sequelize');
var config = require('../config/config.json');
var sequelize = null;

exports.init = function(app) {
    sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.config);
    app.set('sequelize', sequelize);
    app.set('models', registModels(sequelize));
};

var registModels = function(sequelize) {
    var Team   = sequelize.import(__dirname +'/../models/tb_teams');
    var Player = sequelize.import(__dirname +'/../models/tb_players');
    var Follow = sequelize.import(__dirname +'/../models/tb_follows');
    var Like   = sequelize.import(__dirname +'/../models/tb_likes');

    Team.hasMany(Player,  {foreginKey: 'teamseq'});
    Team.hasMany(Like,    {foreignKey: 'typeseq', as: 'like'});
    Team.hasMany(Follow,  {foreignKey: 'typeseq', as: 'follow'});

    Player.hasMany(Like,  {foreignKey: 'typeseq', as: 'like'});
    Player.hasMany(Follow,{foreignKey: 'typeseq', as: 'follow'});

    return {
        Team: Team,
        Player: Player,
        Follow: Follow,
        Like: Like
    };
};
