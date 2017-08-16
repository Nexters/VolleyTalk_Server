//sequelize-auto -o "./models" -d volleytalk -h localhost -u root -p 3306 -x '' -e mysql
var Sequelize = require('sequelize');
var config, sequelize;

exports.init = function(app) {
    config = app.get('config');
    sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.config);
    app.set('sequelize', sequelize);
    app.set('models', registModels(sequelize));
};

var registModels = function(sequelize) {
    var Team          = sequelize.import(__dirname +'/../models/tb_teams');
    var Player        = sequelize.import(__dirname +'/../models/tb_players');
    var Follow        = sequelize.import(__dirname +'/../models/tb_follows');
    var Like          = sequelize.import(__dirname +'/../models/tb_likes');
    var User          = sequelize.import(__dirname +'/../models/tb_userinfos');
    var TeamPost      = sequelize.import(__dirname +'/../models/tb_team_posts');
    var TeamComment   = sequelize.import(__dirname +'/../models/tb_team_comments');
    var PlayerPost    = sequelize.import(__dirname +'/../models/tb_player_posts');
    var PlayerComment = sequelize.import(__dirname +'/../models/tb_player_comments');
    var Cheering      = sequelize.import(__dirname +'/../models/tb_cheerings');


    Team.hasMany(Player,       {foreginKey: 'teamseq'});
    Team.hasMany(Like,         {foreignKey: 'typeseq', as: 'like'});
    Team.hasMany(Follow,       {foreignKey: 'typeseq', as: 'follow'});
    Team.hasMany(TeamPost,     {foreignKey: 'teamseq'});

    Player.hasMany(Like,       {foreignKey: 'typeseq', as: 'like'});
    Player.hasMany(Follow,     {foreignKey: 'typeseq', as: 'follow'});
    Player.hasMany(PlayerPost, {foreignKey: 'playerseq'});
    Player.hasMany(Cheering,   {foreignKey: 'playerseq'});

    TeamPost.hasMany(TeamComment,     {foreignKey: 'teamseq', as: 'comment'});

    TeamComment.belongsTo(User,       {foreignKey: 'userid', targetKey:'userid', as: 'user'});

    PlayerPost.hasMany(PlayerComment, {foreignKey: 'playerseq', as: 'comment'});

    PlayerComment.belongsTo(User,     {foreignKey: 'userid', targetKey:'userid', as: 'user'});

    Cheering.belongsTo(User,          {foreignKey: 'userid', targetKey:'userid', as: 'user'});


    return {
        Team: Team,
        Player: Player,
        Follow: Follow,
        Like: Like,
        User: User,
        TeamPost: TeamPost,
        TeamComment: TeamComment,
        PlayerPost: PlayerPost,
        PlayerComment: PlayerComment,
        Cheering: Cheering
    };
};
