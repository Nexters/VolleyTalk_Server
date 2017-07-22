var sequelize, models;

exports.init = function(app){
    sequelize = app.get('sequelize');
    models = app.get('models');
};

exports.getTeam = function(req, res){
    models.Team.findAll().then(function(teams){
        for(var team in teams){
            console.log(teams[team].name);
        }
    });
    res.end();
};
