# level-agile

base for log system being implemented using multi-level and leveldb

## What do we need

We need effective log storage that can be easily queried per `host` within
various `services`. So in order to do this we need to think about how we
namespace the keys. So what would a potential log key look like?

```js

//
// This would be the conversion in a transform stream when recieving events from
// instruments. uid refers to `username/appname` and we assume service to be `logs/`
//
key = data.service + uid +'\x00' + data.time + '\x00' + data.host

```

###

My logic behind this comes from how we would need to query this potentially and
taking advantage of certain aspects of `leveldb` using streaming range queries
(ReadStreams) and writeStreams. The key structure is made in a way where we
should be able to query based on `logs/username/appname/(Unix Epoch sheeit)` to
get all of the logs for `n` drones. If we wanted to query logs by a specific
host, that can just be added to the the end of the key in the range query to
pull those specific logs. (Not entirely confirmed the way to do this exactly but
should be accomplished by manipulating the lexicographical aspect of the
database).
