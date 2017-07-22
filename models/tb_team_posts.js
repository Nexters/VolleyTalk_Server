/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_team_posts', {
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
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    contents: {
      type: DataTypes.STRING(1000),
      allowNull: false
    },
    img_url: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    img_url_thumb: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    author: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    likecount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    commentcount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    regdate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'tb_team_posts'
  });
};
