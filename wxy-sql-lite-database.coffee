Polymer
  ready: ->
    @db = window.openDatabase @name, @version, @displayName, @size
    return

  Transaction: (commands,
    successCallback: successCallback
    failureCallback: failureCallback
  ) ->
    @db.transaction (transaction) =>
      @ExecuteCommands commands,
        transaction: transaction
        index: 0
        previousResultSet: null
        successCallback: (resultSet) ->
          successCallback resultSet
          return
        failureCallback: (error) ->
          failureCallback error
          return
      return

  ExecuteCommands: (commands,
    transaction: transaction
    index: index
    previousResultSet: previousResultSet
    successCallback: successCallback
    failureCallback: failureCallback
  ) ->
    if index is commands.length
      successCallback previousResultSet
      return

    command = commands[index] previousResultSet
    index++

    console.log command.action
    console.log command.args
    transaction.executeSql command.action, command.args || [], (transaction, resultSet) =>
      console.log resultSet
      resultSet = command.result resultSet if command.result
      @ExecuteCommands commands,
        transaction: transaction
        index: index
        previousResultSet: resultSet
        successCallback: successCallback
        failureCallback: failureCallback
      return
    , (transaction, error) ->
      console.log error
      failureCallback error
      return

    return
