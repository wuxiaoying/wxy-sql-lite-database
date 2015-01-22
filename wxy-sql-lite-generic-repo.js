(function() {
  Polymer({
    Get: function(id) {
      return (function(_this) {
        return function() {
          return {
            action: "SELECT * FROM " + _this.Table + " WHERE id = ?",
            args: [id],
            result: function(resultSet) {
              if (resultSet.rows.length === 1) {
                console.log(resultSet.rows.item(0));
                return resultSet.rows.item(0);
              }
            }
          };
        };
      })(this);
    }
  });

}).call(this);
