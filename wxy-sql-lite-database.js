(function() {
  Polymer({
    ready: function() {
      this.db = window.openDatabase(this.name, this.version, this.displayName, this.size);
    },
    Transaction: function(commands, _arg) {
      var failureCallback, successCallback;
      successCallback = _arg.successCallback, failureCallback = _arg.failureCallback;
      return this.db.transaction((function(_this) {
        return function(transaction) {
          _this.ExecuteCommands(commands, {
            transaction: transaction,
            index: 0,
            previousResultSet: null,
            successCallback: function(resultSet) {
              successCallback(resultSet);
            },
            failureCallback: function(error) {
              failureCallback(error);
            }
          });
        };
      })(this));
    },
    ExecuteCommands: function(commands, _arg) {
      var command, failureCallback, index, previousResultSet, successCallback, transaction;
      transaction = _arg.transaction, index = _arg.index, previousResultSet = _arg.previousResultSet, successCallback = _arg.successCallback, failureCallback = _arg.failureCallback;
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
        failureCallback(error);
      });
    }
  });

}).call(this);
