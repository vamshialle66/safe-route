# SafeRoute feature batch

- [x] Fake call screen
- [x] Shareable route summary
- [x] 24/7 safe spots filter on Around Me
- [x] Rate a route after walking it
- [x] Departure time picker
- [x] Check-in timer on Emergency page
- [x] Offline emergency card note
- [x] Most reported areas list

# Live trip sharing

- [x] shared_trips table + RLS (owner writes, anyone with link reads) + realtime
- [x] Server functions: start/update/end trip, public fetch by share code
- [x] "Share live trip" from route details + Emergency page
- [x] Live trip page for the sharer (GPS tracking, share link, arrived/end)
- [x] Public watcher page /trip/:code (live map, status, no login)
- [x] Verified end-to-end: start → watch signed-out → live position on map
