---
title: Shipping Herdr plugins people can actually use
date: 2026-07-22
description: "Three Herdr plugins already worked. Shipping them meant making the install path obvious, showing the real result, documenting every action, and proving the marketplace flow from public GitHub."
tags: [herdr, plugins, documentation, marketplace]
---

# Shipping Herdr plugins people can actually use

A plugin that only works from its own checkout is not shipped. It is a demo with a
manifest.

I had three small [Herdr](https://herdr.dev/) plugins that did what they promised:
number tabs, apply a tmux-style keymap, and show pane navigation hints. The code worked.
The tests passed. A new user still had to work too hard to answer four basic questions:

1. How do I install it?
2. What will it change?
3. What can I do with it afterwards?
4. How do I undo it?

That is a delivery problem, not a documentation detail. The work here was to make the
collection usable from the first screen, then prove that every public command worked
through the same GitHub path a user would take.

## Put the first useful command first

The old documentation explained the plugins before it helped anyone run them. That is
backwards. A README is usually opened at the exact moment somebody is deciding whether
to try the thing.

The root now starts with the prerequisites and copy-ready commands. To install the full
collection, you need Herdr 0.7.4 or newer and Node.js 24.12 or newer in the Node 24
release line. Each plugin remains independent.

Tab Numbers:

```sh
herdr plugin install oullin/herdr-plugins/plugins/tab-numbers
herdr plugin action invoke oullin.tab-numbers.sync
```

Tmux Keybindings:

```sh
herdr plugin install oullin/herdr-plugins/plugins/tmux-keybindings
herdr plugin action invoke oullin.tmux-keybindings.apply
```

Pane Navigation Hints:

```sh
herdr plugin install oullin/herdr-plugins/plugins/pane-navigation-hints
herdr plugin action invoke oullin.pane-navigation-hints.refresh
```

The second command matters. Installing registers the plugin and its event hooks. It
does not rewrite tabs or panes that were already open, and it should not silently change
an existing keymap without an explicit action. `sync`, `apply`, and `refresh` bridge
that initial state on purpose.

Afterwards, Herdr events keep things current: tab changes re-index labels, new
workspaces receive the keymap, and new panes receive navigation hints.

**Install is not the same as activate. Document both.**

## Show the result before asking for trust

Terminal plugins are unusually hard to explain with prose. "Adds navigation hints" is
technically correct and practically vague. Where do they appear? How long is the label?
Does the keybinding reference replace the terminal or open over it?

Each plugin now has a screenshot captured from a real Herdr session:

- [Numbered tab labels](https://github.com/oullin/herdr-plugins/blob/main/docs/images/tab-numbers.png)
- [The complete tmux keybinding dialog](https://github.com/oullin/herdr-plugins/blob/main/docs/images/tmux-keybindings.png)
- [Pane navigation legends across split panes](https://github.com/oullin/herdr-plugins/blob/main/docs/images/pane-navigation-hints.png)

These are not design mockups. I created a synthetic workspace, invoked the real plugin
actions, and captured the resulting Herdr UI. The names are deliberately fake, and the
frames contain no real projects, private paths, command history, or user information.

A mockup proves what somebody intended to build. A product screenshot proves what the
user will actually see. For installation documentation, that distinction matters.

## The manifest is the interface

Plugin actions are the public control surface. They belong next to installation, not
buried in implementation notes.

The READMEs now carry action tables checked directly against each
`herdr-plugin.toml`:

| Plugin                | Start     | Other controls      | Automatic afterwards           |
| --------------------- | --------- | ------------------- | ------------------------------ |
| Tab Numbers           | `sync`    | —                   | tab create, rename, move, close |
| Tmux Keybindings      | `apply`   | `toggle`, `restore` | new workspace                  |
| Pane Navigation Hints | `refresh` | `clear`             | new pane                       |

The interesting actions are not only the ones that turn features on.

`restore` puts back the keybindings recorded before the tmux profile was first applied.
`clear` removes only the pane metadata owned by the hints plugin. Uninstall instructions
explain what remains and what does not.

Reversibility is part of the interface. If the documentation makes activation obvious
but recovery mysterious, it is incomplete.

## Test the path users take

A local plugin link proves the source tree works. It does not prove that the public
repository is installable.

I created a disposable Herdr configuration so the verification could not rely on any
existing registrations, then installed all three plugins using the exact commands now
shown in the READMEs. For each one, `herdr plugin list --json` confirmed:

- the plugin ID and version;
- the complete action list;
- the public source repository;
- the selected repository subdirectory.

I then invoked a safe representative action for every plugin in the synthetic session
and checked the visible result. The normal repository readiness suite still passed after
the documentation work.

This catches a useful class of failure: documentation that looks right because it was
written from the local layout, while the remote installer sees a missing dependency,
the wrong manifest, or an invalid subdirectory. Test the distribution path, not only
the code behind it.

## The marketplace submission is a GitHub topic

Herdr's marketplace is deliberately simple. There is no submission form, review queue,
or separate package upload.

To publish a community plugin collection:

1. Keep the GitHub repository public and unarchived.
2. Add the `herdr-plugin` topic.
3. Give the repository an accurate description.
4. Wait for the marketplace index, which refreshes about every 30 minutes.

The collection is already live in the
[Herdr marketplace](https://herdr.dev/plugins/). Search for
`oullin/herdr-plugins` and the marketplace shows one repository card.

That card is the discovery unit. The manifest subdirectory is the installation unit:

```text
oullin/herdr-plugins/plugins/tab-numbers
oullin/herdr-plugins/plugins/tmux-keybindings
oullin/herdr-plugins/plugins/pane-navigation-hints
```

One repository can therefore hold related plugins without forcing users to install the
whole collection. GitHub carries the source and trust signals, Herdr indexes the
repository, and the install command selects the plugin.

That is the entire marketplace delivery process. The maintenance work is keeping the
repository public, tagged, described accurately, and installable. Herdr documents the
current rules in its [marketplace guide](https://herdr.dev/docs/marketplace/).

## What changed for the user

No runtime code, manifests, plugin IDs, or versions changed. The release still became
materially better.

| User question                 | Answer now available                                      |
| ----------------------------- | --------------------------------------------------------- |
| What does this do?            | A real screenshot and one-sentence description            |
| How do I start?               | Install and activation commands at the top                |
| What controls do I have?      | An action table matching the manifest                     |
| Will it affect existing work? | The initial `sync`, `apply`, or `refresh` step is explicit |
| Can I back out?               | `restore`, `clear`, and uninstall behaviour               |
| Where do I find it?           | One searchable marketplace collection                    |

That is the practical value of this kind of work. It shortens the distance between
interest and a working result, while making the trust boundary and exit path visible
before installation.

Good plugin distribution should feel boring: find it, see it, install it, activate it,
and remove it without guessing. The code is only one part of making that true.

---

_The three plugins and their complete installation notes live in
[oullin/herdr-plugins](https://github.com/oullin/herdr-plugins). You can find the
collection in the [Herdr marketplace](https://herdr.dev/plugins/) or follow future
build notes on [X (@gocanto)](https://x.com/gocanto)._
