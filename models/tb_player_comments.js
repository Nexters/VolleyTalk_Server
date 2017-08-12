/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_player_comments', {
    seq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    postseq: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'tb_player_posts',
        key: 'seq'
      }
    },
    comment: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    userid: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'tb_player_comments'
  });
};
