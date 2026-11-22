---
title: "Leaving Windows for Omarchy"
description: >-
  I moved my daily work off Windows and WSL to Omarchy. Why I wanted one system, why I took someone
  else's defaults instead of building my own, and what I use now.
date: 2026-11-15
tags: ["tools", "craft"]
---

For years my setup was Windows on the outside and Linux on the inside. I learned the basics of Linux
through [WSL](https://learn.microsoft.com/en-us/windows/wsl/), the Windows Subsystem for Linux, and
it did the job. Windows was the system I grew up with, and I never had to think about Linux until I
became a developer.

Windows has become bloated. It keeps pushing Copilot features on me that I do not care about. I want
to choose my own AI tools, and decide when I use AI and when I do not. I had followed
[Omarchy](https://omarchy.org) since its first release, but I never had a real reason to switch.
With the release of Omarchy 4, I decided it was time to try it and see if I liked it.

This is a note on why I switched and what I use now.

## The WSL tax

I wanted one system, and for me that is Linux. With WSL, I had two. I did all my development inside
WSL, but everything graphical lived on the Windows side. My editors, first
[Rider](https://www.jetbrains.com/rider/) and later Zed, had to reach into WSL through a remote
tunnel, which made opening projects, searching and running things slow. None of this was a big
problem on its own, but together it slowed down every task.

## Why Omarchy and not plain Arch

I had used Linux before, and I knew I could build a setup on plain Arch myself. I did not have the
time to get into all of it. Omarchy is a preconfigured setup on top of
[Arch Linux](https://archlinux.org), with [Hyprland](https://hyprland.org) for tiling windows and a
set of terminal tools already wired together. I like the _omakase_ approach DHH takes with it: the
chef chooses. Sometimes I just want good defaults from someone else. It is the same with open
source. Some people build good libraries, and I trust them, so I do not have to think too much about
it.

The defaults are good. The desktop is clean, and the tiling window manager does not get in the way.
Arch is a rolling release, so updates keep coming. Omarchy updates itself and the Arch packages
together, and I stay on the stable channel, which is the default.

## Terminals that stay alive

My day starts the same way. I open [Ghostty](https://ghostty.org), start
[Herdr](https://herdr.dev/), and run several [OpenCode](https://opencode.ai) sessions through it.
Ghostty is a fast terminal. Herdr keeps my sessions alive, so a long agent run does not die because
I closed the wrong window. OpenCode does most of the coding, and I review the files in Zed.

## One editor

Now that OpenCode does most of the coding, I use [Zed](https://zed.dev) to read code, look at git
diffs and make small edits. I picked it because it is fast. On Linux, it runs natively next to my
code instead of reaching into WSL through a tunnel. I find a set of tools that do the job well and
keep using them.

## What I miss

Before switching, I asked myself what I used my computer for. It came down to three things. For
programming, Linux is better. For browsing, any Chromium-based browser does the job. Gaming was the
one I was unsure about. Then I looked at my Steam history and saw I had been playing less over time,
and mostly indie games. Most of those run on Linux, and Valve is putting a lot of focus on it.

For my personal setup, I do not miss anything. I will not use Windows at home again. Work is a
different story, of course.
