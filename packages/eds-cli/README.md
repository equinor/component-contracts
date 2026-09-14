# eds-cli

**Status: proof of concept.** Built in 16 minutes from an `intent.md` to
show what a design-system CLI looks like when its answers are computed
rather than recalled: every command renders the contracts and the token
build live, with provenance on everything. It is a read-only lens; it
can answer questions about the system, and nothing else.

```sh
eds component <button|banner|tooltip|…>   # the contract: props, variants, states, geometry
eds explain <topic>                       # principles, with sources
eds contrast <target> [--scheme dark]     # APCA Lc, computed while you watch
eds search <query>
```

Not hardened, not published, no stability promises: the contract format
is the interface, and this package is one possible projection of it.
