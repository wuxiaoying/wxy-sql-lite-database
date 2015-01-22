(function() {
  Polymer({
    ready: function() {
      this.db = window.openDatabase(this.name, this.version, this.displayName, this.size);
    },
    Transaction: function(commands, _arg) {
      var failureCallback, successCallback, _ref;
      _ref = _arg != null ? _arg : {}, successCallback = _ref.successCallback, failureCallback = _ref.failureCallback;
      return this.db.transaction((function(_this) {
        return function(transaction) {
          _this.ExecuteCommands(commands, {
            transaction: transaction,
            index: 0,
            previousResultSet: null,
            successCallback: function(resultSet) {
              if (typeof successCallback === "function") {
                successCallback(resultSet);
              }
            },
            failureCallback: function(error) {
              if (typeof failureCallback === "function") {
                failureCallback(error);
              }
            }
          });
        };
      })(this));
    },
    ExecuteCommands: function(commands, _arg) {
      var command, failureCallback, index, previousResultSet, successCallback, transaction, _ref;
      _ref = _arg != null ? _arg : {}, transaction = _ref.transaction, index = _ref.index, previousResultSet = _ref.previousResultSet, successCallback = _ref.successCallback, failureCallback = _ref.failureCallback;
      if (index === commands.length) {
        successCallback(previousResultSet);
        return;
      }
      command = commands[index](previousResultSet);
      index++;
      console.log(command.action);
      console.log(command.args);
      transaction.executeSql(command.action, command.args || [], (function(_this) {
        return function(transaction, resultSet) {
          console.log(resultSet);
          if (command.result) {
            resultSet = command.result(resultSet);
          }
          _this.ExecuteCommands(commands, {
            transaction: transaction,
            index: index,
            previousResultSet: resultSet,
            successCallback: successCallback,
            failureCallback: failureCallback
          });
        };
      })(this), function(transaction, error) {
        console.log(error);
        if (typeof failureCallback === "function") {
          failureCallback(error);
        }
      });
    }
  });

}).call(this);
