Polymer
  Get: (id) ->
    =>
      action:  "SELECT * FROM #{@Table} WHERE id = ?"
      args: [id]
      result: (resultSet) ->
        if resultSet.rows.length is 1
          console.log resultSet.rows.item 0
          resultSet.rows.item 0
