How to update db in prod

1. get content in network tab
2. make updates to JSON
3. replace content.json with updated copy
4. copy content.json and go to chrome in console tab
5. set test = <copy>
6. run JSON.stringify(test).replace(/'/g,"''") and copy to clipboard
7. run update in local db (update key_value_storage set text = '<copied content>')
8. prepare sql statement in file, connect to postgres on terminal and run: < update.sql