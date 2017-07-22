/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_players', {
    seq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    teamseq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'tb_teams',
        key: 'seq'
      }
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    birth: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    physical: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    position: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    likecount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    postcount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    profileimg_url: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'tb_players'
  });
};
