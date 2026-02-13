# TODO

- [ ] currently have the active event info hard-coded in a bunch of places. Need to actually make use of the database to store and retrieve this information for future maintainability

- [ ] emails hard-code event dates
  - [ ] need a function that takes a date range and returns a formatted date range like `date1 -> date2 -> string_format -> string` which would work like `~D(16/05/2026) -> ~D(17/05/2026) -> "%b %d1-%d2, %Y" -> "May 16-17, 2026"`
